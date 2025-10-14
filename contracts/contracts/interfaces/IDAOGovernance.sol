// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title IDAOGovernance
 * @dev Interface para DAOGovernance - reduce dependencias circulares
 */
interface IDAOGovernance {
    // Eventos (alineados con la implementación)
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

    enum ProposalType {
        GENERAL,
        SECTOR,
        TOKEN_MINT,
        PARAMETER
    }

    // Funciones requeridas
    function registerSectorToken(
        address _tokenAddress
    ) external returns (uint16);

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
    ) external returns (uint32);

    function vote(
        address _userAddress,
        uint32 _proposalId,
        bool _support
    ) external;

    function executeProposal(uint32 _proposalId) external;

    function getProposalInfo(
        uint32 _proposalId
    )
        external
        view
        returns (
            uint32 proposalId,
            address proposer,
            string memory title,
            string memory description,
            uint64 startTime,
            uint64 endTime,
            uint32 yesVotes,
            uint32 noVotes,
            bool executed,
            bool isActive,
            ProposalType proposalType,
            uint16 sectorTokenId,
            uint32 minVotingPower,
            uint8 quorumThreshold,
            uint8 approvalThreshold
        );
}
