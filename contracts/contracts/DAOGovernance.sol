// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./interfaces/IUnitpointsTokens.sol";

/**
 * @title DAOGovernance
 * @dev Contrato para manejar votaciones DAO con peso basado en tokens
 */
contract DAOGovernance {
    // ===== Custom errors to reduce bytecode size =====
    error NotAuthorized();
    error ReentrantCall();
    error TitleEmpty();
    error DescriptionEmpty();
    error SectorTokenIdRequired();
    error VotingPeriodTooShort();
    error QuorumTooHigh();
    error ApprovalTooHigh();
    error ProposalNotActive();
    error VotingNotStarted();
    error VotingEnded();
    error AlreadyVoted();
    error InsufficientVotingPower();
    error VotingStillActive();
    error ProposalAlreadyExecuted();
    error QuorumNotReached();
    error NotEnoughYesVotes();
    error NotAuthorizedToCancel();
    error InvalidSectorTokenId();
    error InvalidTokenAddress();
    error InvalidAccount();

    // ===== Small constants =====
    uint8 private constant PERCENT_DENOMINATOR = 100;
    // Mapping simple para almacenar direcciones ADMIN
    mapping(address => bool) public admins;

    // Referencias a tokens
    mapping(uint16 => address) public sectorTokens;
    uint16 public nextSectorId = 1;

    // Estructuras de datos
    struct Proposal {
        uint32 proposalId;
        address proposer;
        string title;
        string description;
        uint64 startTime;
        uint64 endTime;
        uint32 yesVotes;
        uint32 noVotes;
        bool executed;
        bool isActive;
        ProposalType proposalType;
        uint16 sectorTokenId; // Para propuestas específicas de sector
        uint32 minVotingPower; // Configurable por propuesta
        uint8 quorumThreshold; // 0-100, configurable por propuesta
        uint8 approvalThreshold; // 0-100, configurable por propuesta
    }

    enum ProposalType {
        GENERAL, // Propuesta general del ecosistema
        SECTOR, // Propuesta específica de un sector
        TOKEN_MINT, // Propuesta para mintear nuevos tokens
        PARAMETER // Propuesta para cambiar parámetros del sistema
    }

    struct Vote {
        bool hasVoted;
        bool support;
        uint32 weight;
    }

    // Mappings
    mapping(uint32 => Proposal) public proposals;
    mapping(uint32 => mapping(address => Vote)) public votes;
    mapping(address => uint64) public lastVoteTime;

    // Contadores
    uint32 public nextProposalId = 1;

    // Eventos
    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed proposer,
        string title,
        ProposalType proposalType
    );
    event VoteCast(
        uint256 indexed proposalId,
        address indexed voter,
        bool support,
        uint256 weight
    );
    event ProposalExecuted(uint256 indexed proposalId);
    event ProposalCancelled(uint256 indexed proposalId);

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
     * @dev Crear una nueva propuesta
     * @param _title Título de la propuesta
     * @param _description Descripción detallada
     * @param _proposalType Tipo de propuesta
     * @param _sectorTokenId ID del token de sector (solo para propuestas SECTOR)
     */
    function createProposal(
        address _proposer,
        string memory _title,
        string memory _description,
        ProposalType _proposalType,
        uint16 _sectorTokenId,
        uint32 _votingPeriod,
        uint32 _minVotingPower,
        uint8 _quorumThreshold,
        uint8 _approvalThreshold
    ) external onlyRole returns (uint32) {
        if (bytes(_title).length == 0) revert TitleEmpty();
        if (bytes(_description).length == 0) revert DescriptionEmpty();
        if (_votingPeriod < 1 days) revert VotingPeriodTooShort();
        if (_quorumThreshold > PERCENT_DENOMINATOR) revert QuorumTooHigh();
        if (_approvalThreshold > PERCENT_DENOMINATOR) revert ApprovalTooHigh();

        if (_proposalType == ProposalType.SECTOR) {
            if (_sectorTokenId == 0) revert SectorTokenIdRequired();
        }

        uint32 proposalId = nextProposalId;
        Proposal storage newProposal = proposals[proposalId];

        newProposal.proposalId = proposalId;
        newProposal.proposer = _proposer;
        newProposal.title = _title;
        newProposal.description = _description;
        newProposal.startTime = uint64(block.timestamp);
        newProposal.endTime = uint64(block.timestamp + _votingPeriod);
        newProposal.yesVotes = 0;
        newProposal.noVotes = 0;
        newProposal.executed = false;
        newProposal.isActive = true;
        newProposal.proposalType = _proposalType;
        newProposal.sectorTokenId = _sectorTokenId;
        newProposal.minVotingPower = _minVotingPower;
        newProposal.quorumThreshold = _quorumThreshold;
        newProposal.approvalThreshold = _approvalThreshold;

        unchecked {
            nextProposalId++;
        }

        emit ProposalCreated(proposalId, _proposer, _title, _proposalType);
        return proposalId;
    }

    /**
     * @dev Votar en una propuesta
     * @param _proposalId ID de la propuesta
     * @param _support true para voto a favor, false para voto en contra
     */
    function vote(
        address _userAddress,
        uint32 _proposalId,
        bool _support
    ) external onlyRole nonReentrant {
        Proposal storage proposal = proposals[_proposalId];
        if (!proposal.isActive) revert ProposalNotActive();
        if (block.timestamp < proposal.startTime) revert VotingNotStarted();
        if (block.timestamp > proposal.endTime) revert VotingEnded();
        if (votes[_proposalId][_userAddress].hasVoted) revert AlreadyVoted();

        uint32 votingPower = getVotingPower(
            _userAddress,
            proposal.sectorTokenId
        );
        if (votingPower < proposal.minVotingPower)
            revert InsufficientVotingPower();

        votes[_proposalId][_userAddress] = Vote({
            hasVoted: true,
            support: _support,
            weight: votingPower
        });

        if (_support) {
            proposal.yesVotes += votingPower;
        } else {
            proposal.noVotes += votingPower;
        }

        lastVoteTime[_userAddress] = uint64(block.timestamp);

        emit VoteCast(_proposalId, _userAddress, _support, votingPower);
    }

    //*************************REVISION EXECUTION*********************************** */
    /**
     * @dev Ejecutar una propuesta aprobada
     * @param _proposalId ID de la propuesta
     */
    function executeProposal(uint32 _proposalId) external onlyRole {
        Proposal storage proposal = proposals[_proposalId];
        if (!proposal.isActive) revert ProposalNotActive();
        if (block.timestamp <= proposal.endTime) revert VotingStillActive();
        if (proposal.executed) revert ProposalAlreadyExecuted();

        uint256 totalVotes = proposal.yesVotes + proposal.noVotes;
        uint256 totalSupply = getTotalVotingPower(
            proposal.proposalType,
            proposal.sectorTokenId
        );

        if (
            totalVotes <
            (totalSupply * proposal.quorumThreshold) / PERCENT_DENOMINATOR
        ) revert QuorumNotReached();
        if (
            proposal.yesVotes <
            (totalVotes * proposal.approvalThreshold) / PERCENT_DENOMINATOR
        ) revert NotEnoughYesVotes();

        proposal.executed = true;
        proposal.isActive = false;

        // Aquí se ejecutarían las acciones específicas según el tipo de propuesta
        _executeProposalAction(_proposalId);

        emit ProposalExecuted(_proposalId);
    }

    /**
     * @dev Cancelar una propuesta
     * @param _proposalId ID de la propuesta
     */
    function cancelProposal(uint32 _proposalId) external {
        Proposal storage proposal = proposals[_proposalId];
        if (!(msg.sender == proposal.proposer || admins[msg.sender]))
            revert NotAuthorizedToCancel();
        if (!proposal.isActive) revert ProposalNotActive();
        if (proposal.executed) revert ProposalAlreadyExecuted();

        proposal.isActive = false;
        emit ProposalCancelled(_proposalId);
    }

    /**
     * @dev Obtener el poder de voto de una dirección
     * @param _voter Dirección del votante
     * @param _sectorTokenId ID del token de sector
     */
    function getVotingPower(
        address _voter,
        uint16 _sectorTokenId
    ) public view returns (uint32) {
        if (!(_sectorTokenId > 0 && _sectorTokenId < nextSectorId))
            revert InvalidSectorTokenId();
        return
            uint32(
                IUnitpointsTokens(sectorTokens[_sectorTokenId]).balanceOf(
                    _voter
                )
            );
    }

    /**
     * @dev Obtener el poder de voto total
     * @param _sectorTokenId ID del token de sector
     */
    function getTotalVotingPower(
        ProposalType,
        uint16 _sectorTokenId
    ) public view returns (uint32) {
        if (!(_sectorTokenId > 0 && _sectorTokenId < nextSectorId))
            revert InvalidSectorTokenId();
        return
            uint32(
                IUnitpointsTokens(sectorTokens[_sectorTokenId]).totalSupply()
            );
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
     * @dev Ejecutar acción específica de la propuesta
     * @param _proposalId ID de la propuesta
     */
    function _executeProposalAction(uint32 _proposalId) internal view {
        Proposal storage proposal = proposals[_proposalId];

        if (proposal.proposalType == ProposalType.TOKEN_MINT) {
            // Lógica para mintear tokens (requiere implementación específica)
            // Esta función se puede expandir según las necesidades
        }
        // Se pueden agregar más tipos de acciones aquí
    }

    /**
     * @dev Obtener información de una propuesta
     * @param _proposalId ID de la propuesta
     */
    function getProposalInfo(
        uint32 _proposalId
    )
        external
        view
        returns (
            uint256 proposalId,
            address proposer,
            string memory title,
            string memory description,
            uint256 startTime,
            uint256 endTime,
            uint256 yesVotes,
            uint256 noVotes,
            bool executed,
            bool isActive,
            ProposalType proposalType,
            uint256 sectorTokenId,
            uint256 minVotingPower,
            uint256 quorumThreshold,
            uint256 approvalThreshold
        )
    {
        Proposal storage proposal = proposals[_proposalId];
        return (
            proposal.proposalId,
            proposal.proposer,
            proposal.title,
            proposal.description,
            proposal.startTime,
            proposal.endTime,
            proposal.yesVotes,
            proposal.noVotes,
            proposal.executed,
            proposal.isActive,
            proposal.proposalType,
            proposal.sectorTokenId,
            proposal.minVotingPower,
            proposal.quorumThreshold,
            proposal.approvalThreshold
        );
    }

    /**
     * @dev Obtener el número total de sectores registrados
     */
    function getTotalSectors() external view returns (uint256) {
        return nextSectorId - 1;
    }

    // Función para asignar admin
    function grantAdmin(address account) external onlyRole {
        if (account == address(0)) revert InvalidAccount();
        admins[account] = true;
    }
}
