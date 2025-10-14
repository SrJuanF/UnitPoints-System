// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title IEventManager
 * @dev Interface alineada con la implementación actual de EventManager
 */
interface IEventManager {
    // Tipos
    enum ActivityType {
        REDEEM,
        EARN,
        VOTE
    }

    // Funciones usadas externamente por otros contratos
    function registerSectorToken(
        address _tokenAddress
    ) external returns (uint16);

    function createEvent(
        string memory _name,
        string memory _description,
        uint16 _sectorTokenId,
        uint64 _startDate,
        uint64 _endDate
    ) external returns (uint32);

    function addSimpleActivity(
        uint32 _eventId,
        string memory _activityName,
        string memory _description,
        ActivityType _activityType,
        uint32 _points,
        uint16 _maxParticipants
    ) external;

    function addVoteActivity(
        uint32 _eventId,
        string memory _activityName,
        string memory _description,
        uint8 _proposalType,
        uint32 _votingPeriod,
        uint32 _minVotingPower,
        uint8 _quorumThreshold,
        uint8 _approvalThreshold,
        uint16 _maxParticipants
    ) external;

    // executeDAOProposal y participación se realizan desde TokenAdministrator

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
        );

    function getEventActivities(
        uint32 _eventId
    ) external view returns (string[] memory);

    function setDAOGovernance(address _daoGovernance) external;

    function setCompanyManager(address _companyManager) external;

    // Helpers to allow external orchestrator (TokenAdministrator) logic
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
        );

    function getEventSectorToken(
        uint32 _eventId
    ) external view returns (address);

    function incrementActivityParticipants(
        uint32 _eventId,
        string memory _activityName
    ) external;
}
