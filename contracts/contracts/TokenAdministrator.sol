// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./interfaces/IUnitpointsTokens.sol";
import "./interfaces/IEventManager.sol";
import "./interfaces/IUserManager.sol";
import "./interfaces/IDAOGovernance.sol";

//import "./interfaces/ITokenSwap.sol";

/**
 * @title TokenAdministrator
 * @dev Contrato simplificado para gestionar la lógica entre tokens, eventos, empresas y usuarios
 */
contract TokenAdministrator {
    // ===== Custom errors =====
    error NotAuthorized();
    error ReentrantCall();
    error InvalidTokenAddress();
    error EventManagerNotConfigured();
    error UserManagerNotConfigured();
    error DAOGovernanceNotConfigured();
    error AlreadySubscribed();
    error NotSubscribedToEvent();
    error ActivityNotActive();
    error ActivityFull();
    error InsufficientPoints();
    error NotVotingActivity();

    // Direcciones de contratos (reduce bytecode significativamente)
    address public eventManager;
    address public userManager;
    address public daoGovernance;
    //address public tokenSwap;

    // Mapeo de tokens de sector
    mapping(uint16 => address) public sectorTokens;
    uint16 public nextSectorId = 1;

    // Mapping simple para almacenar direcciones ADMIN
    mapping(address => bool) public admins;

    // Eventos
    event PointsEarned(address indexed user, uint32 amount, uint32 eventId);
    event PointsRedeemed(address indexed user, uint32 amount, uint32 eventId);
    event DAOProposalVoted(
        uint32 indexed eventId,
        string activityName,
        uint32 indexed proposalId,
        address voter,
        bool support
    );
    event DAOProposalExecuted(
        uint32 indexed eventId,
        string activityName,
        uint32 indexed proposalId,
        address executor
    );

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

    constructor() {
        // Asignar admin al deployer
        admins[msg.sender] = true;
        _status = _NOT_ENTERED;
    }

    /**
     * @dev Configurar contratos auxiliares
     * @param _eventManager Dirección del EventManager
     * @param _userManager Dirección del UserManager
     * @param _daoGovernance Dirección del DAOGovernance
     *
     */
    function setAuxiliaryContracts(
        address _eventManager,
        address _userManager,
        address _daoGovernance
    )
        external
        /*address _tokenSwap*/
        onlyRole
    {
        eventManager = _eventManager;
        userManager = _userManager;
        daoGovernance = _daoGovernance;
        //tokenSwap = _tokenSwap;
    }

    /**
     * @dev Registrar un token de sector existente
     * @param _tokenAddress Dirección del token ya creado
     */
    function registerSectorToken(
        address _tokenAddress
    ) external onlyRole returns (uint16) {
        if (_tokenAddress == address(0)) revert InvalidTokenAddress();
        if (eventManager == address(0)) revert EventManagerNotConfigured();
        if (daoGovernance == address(0)) revert DAOGovernanceNotConfigured();
        //require(tokenSwap != address(0), "TokenSwap not configured");

        sectorTokens[nextSectorId] = _tokenAddress;

        // Registrar automáticamente en contratos auxiliares usando interfaces
        IEventManager(eventManager).registerSectorToken(_tokenAddress);
        IDAOGovernance(daoGovernance).registerSectorToken(_tokenAddress);
        //ITokenSwap(tokenSwap).registerSectorToken(_tokenAddress);

        unchecked {
            nextSectorId++;
        }
        return nextSectorId - 1;
    }

    /**
     * @dev Suscribir al usuario llamador a un evento a través de UserManager
     * @param _eventId ID del evento
     */
    function subscribeToEvent(uint32 _eventId) external nonReentrant {
        if (userManager == address(0)) revert UserManagerNotConfigured();
        if (IUserManager(userManager).isUserSubscribed(msg.sender, _eventId))
            revert AlreadySubscribed();
        IUserManager(userManager).subscribeToEvent(_eventId, msg.sender);
    }

    /**
     * @dev Participar en una actividad (REDEEM/EARN) o votar (VOTE)
     * @param _eventId ID del evento
     * @param _activityName Nombre de la actividad
     * @param _support Voto a favor/en contra (solo para VOTE)
     */
    function participateInActivity(
        uint32 _eventId,
        string memory _activityName,
        bool _support
    ) external nonReentrant {
        if (eventManager == address(0)) revert EventManagerNotConfigured();
        if (userManager == address(0)) revert UserManagerNotConfigured();
        if (!IUserManager(userManager).isUserSubscribed(msg.sender, _eventId))
            revert NotSubscribedToEvent();

        (
            bool isActive,
            IEventManager.ActivityType activityType,
            uint32 pointsReward,
            uint32 pointsCost,
            uint16 maxParticipants,
            uint16 currentParticipants,
            uint32 activityProposalId
        ) = IEventManager(eventManager).getActivityInfo(
                _eventId,
                _activityName
            );

        if (!isActive) revert ActivityNotActive();
        if (!(currentParticipants < maxParticipants)) revert ActivityFull();

        address sectorToken = IEventManager(eventManager).getEventSectorToken(
            _eventId
        );

        if (activityType == IEventManager.ActivityType.REDEEM) {
            if (
                IUnitpointsTokens(sectorToken).balanceOf(msg.sender) <
                pointsCost
            ) revert InsufficientPoints();
            IUnitpointsTokens(sectorToken).burnFrom(msg.sender, pointsCost);
            emit PointsRedeemed(msg.sender, pointsCost, _eventId);
        } else if (activityType == IEventManager.ActivityType.EARN) {
            IUnitpointsTokens(sectorToken).mint(msg.sender, pointsReward);
            emit PointsEarned(msg.sender, pointsReward, _eventId);
        } else if (activityType == IEventManager.ActivityType.VOTE) {
            if (daoGovernance == address(0))
                revert DAOGovernanceNotConfigured();
            IDAOGovernance(daoGovernance).vote(
                msg.sender,
                activityProposalId,
                _support
            );
            emit DAOProposalVoted(
                _eventId,
                _activityName,
                activityProposalId,
                msg.sender,
                _support
            );
        }

        IEventManager(eventManager).incrementActivityParticipants(
            _eventId,
            _activityName
        );
    }

    /**
     * @dev Ejecutar una propuesta DAO desde una actividad de evento (solo usuarios suscritos)
     * @param _eventId ID del evento
     * @param _activityName Nombre de la actividad
     */
    function executeDAOProposal(
        uint32 _eventId,
        string memory _activityName
    ) external onlyRole nonReentrant {
        if (eventManager == address(0)) revert EventManagerNotConfigured();
        if (daoGovernance == address(0)) revert DAOGovernanceNotConfigured();

        (
            bool isActive,
            IEventManager.ActivityType activityType,
            ,
            ,
            ,
            ,
            uint32 activityProposalId
        ) = IEventManager(eventManager).getActivityInfo(
                _eventId,
                _activityName
            );

        if (!isActive) revert ActivityNotActive();
        if (activityType != IEventManager.ActivityType.VOTE)
            revert NotVotingActivity();

        IDAOGovernance(daoGovernance).executeProposal(activityProposalId);

        emit DAOProposalExecuted(
            _eventId,
            _activityName,
            activityProposalId,
            msg.sender
        );
    }

    /**
     * @dev Obtener el número total de sectores registrados
     */
    function getTotalSectors() external view returns (uint16) {
        return nextSectorId - 1;
    }

    /**
     * @dev Obtener las direcciones de los contratos auxiliares
     * @return Array con las direcciones de [EventManager, UserManager, DAOGovernance, TokenSwap]
     */
    function getAuxiliaryContracts() external view returns (address[3] memory) {
        return [eventManager, userManager, daoGovernance]; //,tokenSwap
    }

    /**
     * @dev Obtener la dirección de un token de sector
     */
    function getSectorToken(uint16 _sectorId) external view returns (address) {
        return sectorTokens[_sectorId];
    }

    // Función para asignar admin
    function grantAdmin(address account) external onlyRole {
        require(account != address(0), "Invalid account");
        admins[account] = true;
    }
}
