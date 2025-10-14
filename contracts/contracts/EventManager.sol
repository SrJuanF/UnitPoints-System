// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./interfaces/IUnitpointsTokens.sol";
import "./interfaces/IDAOGovernance.sol";
import "./interfaces/ICompanyManager.sol";

/**
 * @title EventManager
 * @dev Contrato para gestionar eventos y actividades
 */
contract EventManager {
    // ===== Custom errors =====
    error NotAuthorized();
    error ReentrantCall();
    error CompanyManagerNotConfigured();
    error CompanyNotRegistered();
    error InvalidTokenAddress();
    error InvalidDAOAddress();
    error InvalidCompanyManagerAddress();
    error InvalidSectorToken();
    error InvalidDates();
    error NotEventOwner();
    error EventNotActive();
    error ActivityNotActive();
    error ActivityFull();

    // Mapping simple para almacenar direcciones ADMIN
    mapping(address => bool) public admins;

    // Referencias a contratos usando direcciones
    mapping(uint16 => address) public sectorTokens;
    address public daoGovernance;
    address public companyManager;
    uint16 public nextSectorId = 1;

    // Estructuras de datos
    struct Event {
        uint32 eventId;
        address company;
        string name;
        string description;
        uint16 sectorTokenId;
        uint64 startDate;
        uint64 endDate;
        bool isActive;
        mapping(string => Activity) activities;
        string[] activityNames;
    }

    struct Activity {
        string name;
        string description;
        ActivityType activityType;
        uint32 pointsReward;
        uint32 pointsCost;
        uint32 proposalId; // 0 for non-vote activities; >0 for vote activities
        bool isActive;
        uint16 maxParticipants;
        uint16 currentParticipants;
    }

    enum ActivityType {
        REDEEM, // Redimir puntos por productos
        EARN, // Obtener puntos por asistencia
        VOTE // Votar en propuestas DAO
    }

    // Mappings
    mapping(uint32 => Event) public events;

    // Contadores
    uint32 public nextEventId = 1;

    // Eventos
    event EventCreated(
        uint256 indexed eventId,
        address indexed company,
        string name
    );
    event ActivityAdded(
        uint256 indexed eventId,
        string activityName,
        ActivityType activityType
    );
    event DAOProposalCreated(
        uint256 indexed eventId,
        string activityName,
        uint256 indexed proposalId,
        address indexed creator
    );

    // Eventos auxiliares expuestos vía funciones helper

    // Modifier para verificar admin
    modifier onlyRole() {
        if (!admins[msg.sender]) revert NotAuthorized();
        _;
    }

    // Reentrancy guard OZ-style
    uint8 private constant _NOT_ENTERED = 1;
    uint8 private constant _ENTERED = 2;
    uint8 private _status;
    modifier nonReentrant() {
        if (_status == _ENTERED) revert ReentrantCall();
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }

    modifier CompanyUp() {
        if (address(companyManager) == address(0))
            revert CompanyManagerNotConfigured();
        if (!ICompanyManager(companyManager).isActiveCompany(msg.sender))
            revert CompanyNotRegistered();
        _;
    }

    constructor() {
        // Asignar admin al deployer
        admins[msg.sender] = true;
        _status = _NOT_ENTERED;
    }

    /**
     * @dev Registrar un token de sector
     * @param _tokenAddress Dirección del contrato del token
     */
    function registerSectorToken(
        address _tokenAddress
    ) external onlyRole returns (uint16) {
        if (_tokenAddress == address(0)) revert InvalidTokenAddress();

        uint16 sectorId = nextSectorId;
        sectorTokens[sectorId] = _tokenAddress;
        unchecked {
            nextSectorId++;
        }

        return sectorId;
    }

    /**
     * @dev Configurar el contrato DAOGovernance
     * @param _daoGovernance Dirección del contrato DAOGovernance
     */
    function setDAOGovernance(address _daoGovernance) external onlyRole {
        if (_daoGovernance == address(0)) revert InvalidDAOAddress();
        daoGovernance = _daoGovernance;
    }

    /**
     * @dev Configurar el contrato CompanyManager
     * @param _companyManager Dirección del contrato CompanyManager
     */
    function setCompanyManager(address _companyManager) external onlyRole {
        if (_companyManager == address(0))
            revert InvalidCompanyManagerAddress();
        companyManager = _companyManager;
    }

    /**
     * @dev Crear un nuevo evento
     * @param _name Nombre del evento
     * @param _description Descripción del evento
     * @param _sectorTokenId ID del token de sector
     * @param _startDate Fecha de inicio
     * @param _endDate Fecha de fin
     */
    function createEvent(
        string memory _name,
        string memory _description,
        uint16 _sectorTokenId,
        uint64 _startDate,
        uint64 _endDate
    ) external CompanyUp returns (uint32) {
        if (!(_sectorTokenId < nextSectorId)) revert InvalidSectorToken();
        if (!(_startDate < _endDate)) revert InvalidDates();

        uint32 eventId = nextEventId;
        Event storage newEvent = events[eventId];

        newEvent.eventId = eventId;
        newEvent.company = msg.sender;
        newEvent.name = _name;
        newEvent.description = _description;
        newEvent.sectorTokenId = _sectorTokenId;
        newEvent.startDate = _startDate;
        newEvent.endDate = _endDate;
        newEvent.isActive = true;

        // Agregar evento a la empresa a través del CompanyManager
        ICompanyManager(companyManager).addEventToCompany(msg.sender, eventId);
        unchecked {
            nextEventId++;
        }

        emit EventCreated(eventId, msg.sender, _name);
        return eventId;
    }

    /**
     * @dev Agregar actividad de tipo EARN, REDEEM o VOTE.
     * Para EARN y REDEEM, usa `_points` como puntos de recompensa o costo.
     * Para VOTE, se deben pasar los parámetros DAO correspondientes.
     */
    function addActivity(
        uint32 _eventId,
        string memory _activityName,
        string memory _description,
        ActivityType _activityType,
        uint32 _points, // usado solo si EARN o REDEEM
        uint16 _maxParticipants,
        // parámetros DAO (solo se usan si _activityType == VOTE)
        IDAOGovernance.ProposalType _proposalType,
        uint32 _votingPeriod,
        uint32 _minVotingPower,
        uint8 _quorumThreshold,
        uint8 _approvalThreshold
    ) external CompanyUp {
        Event storage eventData = events[_eventId];
        if (eventData.company != msg.sender) revert NotEventOwner();
        if (!eventData.isActive) revert EventNotActive();

        uint32 pointsReward = 0;
        uint32 pointsCost = 0;
        uint32 proposalId = 0;

        if (_activityType == ActivityType.EARN) {
            pointsReward = _points;
        } else if (_activityType == ActivityType.REDEEM) {
            pointsCost = _points;
        } else if (_activityType == ActivityType.VOTE) {
            uint16 sectorTokenId = eventData.sectorTokenId;
            proposalId = uint32(
                IDAOGovernance(daoGovernance).createProposal(
                    msg.sender,
                    _activityName,
                    _description,
                    _proposalType,
                    sectorTokenId,
                    _votingPeriod,
                    _minVotingPower,
                    _quorumThreshold,
                    _approvalThreshold
                )
            );
            emit DAOProposalCreated(
                _eventId,
                _activityName,
                proposalId,
                msg.sender
            );
        } else {
            revert ActivityNotActive();
        }

        // Crear y guardar la actividad
        eventData.activities[_activityName] = Activity({
            name: _activityName,
            description: _description,
            activityType: _activityType,
            pointsReward: pointsReward,
            pointsCost: pointsCost,
            proposalId: proposalId,
            isActive: true,
            maxParticipants: _maxParticipants,
            currentParticipants: 0
        });

        eventData.activityNames.push(_activityName);
        emit ActivityAdded(_eventId, _activityName, _activityType);
    }

    /**
     * @dev Helper: incrementar participantes de una actividad (requiere rol)
     */
    function incrementActivityParticipants(
        uint32 _eventId,
        string memory _activityName
    ) external onlyRole {
        unchecked {
            events[_eventId].activities[_activityName].currentParticipants++;
        }
    }

    /**
     * @dev Helper: obtener direccion del token de sector asociado a un evento
     */
    function getEventSectorToken(
        uint32 _eventId
    ) external view returns (address) {
        uint16 sectorId = events[_eventId].sectorTokenId;
        return sectorTokens[sectorId];
    }

    // Nota: los eventos relacionados a la participación se emiten ahora desde TokenAdministrator

    /**
     * @dev Obtener información de un evento
     * @param _eventId ID del evento
     */
    function getEventInfo(
        uint32 _eventId
    )
        external
        view
        returns (
            uint32 eventId,
            address company,
            string memory name,
            string memory description,
            uint16 sectorTokenId,
            uint64 startDate,
            uint64 endDate,
            bool isActive
        )
    {
        Event storage eventData = events[_eventId];
        return (
            eventData.eventId,
            eventData.company,
            eventData.name,
            eventData.description,
            eventData.sectorTokenId,
            eventData.startDate,
            eventData.endDate,
            eventData.isActive
        );
    }

    /**
     * @dev Helper: obtener información de una actividad (solo lectura)
     */
    function getActivityInfo(
        uint32 _eventId,
        string memory _activityName
    )
        external
        view
        returns (
            bool isActive,
            ActivityType activityType,
            uint32 pointsReward,
            uint32 pointsCost,
            uint16 maxParticipants,
            uint16 currentParticipants,
            uint32 proposalId
        )
    {
        Activity storage activity = events[_eventId].activities[_activityName];
        return (
            activity.isActive,
            activity.activityType,
            activity.pointsReward,
            activity.pointsCost,
            activity.maxParticipants,
            activity.currentParticipants,
            activity.proposalId
        );
    }

    /**
     * @dev Obtener actividades de un evento
     * @param _eventId ID del evento
     */
    function getEventActivities(
        uint32 _eventId
    ) external view returns (string[] memory) {
        return events[_eventId].activityNames;
    }

    // Función para asignar admin
    function grantAdmin(address account) external onlyRole {
        require(account != address(0), "Invalid account");
        admins[account] = true;
    }
}
