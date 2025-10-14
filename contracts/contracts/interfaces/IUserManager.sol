// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title IUserManager
 * @dev Interface para el contrato UserManager
 */
interface IUserManager {
    // Estructuras de datos
    struct User {
        address userAddress;
        bool isRegistered;
        uint256[] subscribedEvents;
        mapping(uint256 => bool) eventSubscriptions;
    }

    // Eventos
    event UserRegistered(address indexed user);
    event UserSubscribed(uint256 indexed eventId, address indexed user);
    event UserDeactivated(address indexed user);
    event UserReactivated(address indexed user);

    // Funciones públicas
    function isUserRegistered(
        address _userAddress
    ) external view returns (bool);

    function registerUser() external;

    function subscribeToEvent(uint256 _eventId, address _user) external;

    function isUserSubscribed(
        address _user,
        uint256 _eventId
    ) external view returns (bool);

    function getUserSubscribedEvents(
        address _user
    ) external view returns (uint256[] memory);

    function getUser(
        address _userAddress
    )
        external
        view
        returns (
            address userAddress,
            bool isRegistered,
            uint256[] memory subscribedEvents
        );

    // Funciones de administración
    function deactivateUser(address _userAddress) external;

    function reactivateUser(address _userAddress) external;

    function grantAdmin(address account) external;
}
