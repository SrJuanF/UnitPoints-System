// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./interfaces/IUserManager.sol";

/**
 * @title UserManager
 * @dev Contrato para gestionar usuarios y suscripciones
 */
contract UserManager is IUserManager {
    // ===== Custom errors =====
    error NotAuthorized();
    error InvalidUserAddress();
    error UserAlreadyRegistered();
    error UserNotRegistered();
    error AlreadySubscribed();
    error InvalidAccount();
    // Mapping simple para almacenar direcciones ADMIN
    mapping(address => bool) public admins;

    // Mappings
    mapping(address => User) public users;

    // Modifier para verificar admin
    modifier onlyRole() {
        if (!admins[msg.sender]) revert NotAuthorized();
        _;
    }

    constructor() {
        // Asignar admin al deployer
        admins[msg.sender] = true;
    }

    /**
     * @dev Verificar si un usuario está registrado
     * @param _userAddress Dirección del usuario
     * @return true si el usuario está registrado, false en caso contrario
     */
    function isUserRegistered(
        address _userAddress
    ) external view override returns (bool) {
        return users[_userAddress].isRegistered;
    }

    /**
     * @dev Registrar un nuevo usuario
     */
    function registerUser() external override {
        if (msg.sender == address(0)) revert InvalidUserAddress();
        if (users[msg.sender].isRegistered) revert UserAlreadyRegistered();

        users[msg.sender].userAddress = msg.sender;
        users[msg.sender].isRegistered = true;

        emit UserRegistered(msg.sender);
    }

    /**
     * @dev Verificar si un usuario está suscrito a un evento
     * @param _user Dirección del usuario
     * @param _eventId ID del evento
     */
    function isUserSubscribed(
        address _user,
        uint256 _eventId
    ) external view override returns (bool) {
        return users[_user].eventSubscriptions[_eventId];
    }

    /**
     * @dev Obtener eventos suscritos de un usuario
     * @param _user Dirección del usuario
     */
    function getUserSubscribedEvents(
        address _user
    ) external view override returns (uint256[] memory) {
        return users[_user].subscribedEvents;
    }

    /**
     * @dev Obtener información de un usuario
     * @param _userAddress Dirección del usuario
     * @return userAddress Dirección del usuario
     * @return isRegistered Si está registrado
     * @return subscribedEvents Array de eventos suscritos
     */
    function getUser(
        address _userAddress
    )
        external
        view
        override
        returns (
            address userAddress,
            bool isRegistered,
            uint256[] memory subscribedEvents
        )
    {
        User storage user = users[_userAddress];
        return (user.userAddress, user.isRegistered, user.subscribedEvents);
    }

    /**
     * @dev Desactivar un usuario (solo admin)
     * @param _userAddress Dirección del usuario
     */
    function deactivateUser(address _userAddress) external override onlyRole {
        if (_userAddress == address(0)) revert InvalidUserAddress();
        if (!users[_userAddress].isRegistered) revert UserNotRegistered();

        users[_userAddress].isRegistered = false;
        emit UserDeactivated(_userAddress);
    }

    /**
     * @dev Reactivar un usuario (solo admin)
     * @param _userAddress Dirección del usuario
     */
    function reactivateUser(address _userAddress) external override onlyRole {
        if (_userAddress == address(0)) revert InvalidUserAddress();
        if (users[_userAddress].isRegistered) revert UserAlreadyRegistered();

        users[_userAddress].isRegistered = true;
        emit UserReactivated(_userAddress);
    }

    // Función para asignar admin
    function grantAdmin(address account) external override onlyRole {
        if (account == address(0)) revert InvalidAccount();
        admins[account] = true;
    }
}
