// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./interfaces/ICompanyManager.sol";

/**
 * @title CompanyManager
 * @dev Contrato para gestionar empresas
 */
contract CompanyManager is ICompanyManager {
    // ===== Custom errors =====
    error NotAuthorized();
    error InvalidCompanyAddress();
    error CompanyAlreadyRegistered();
    error CompanyNotActive();
    error CompanyAlreadyActive();
    error InvalidAccount();
    // Mapping simple para almacenar direcciones ADMIN
    mapping(address => bool) public admins;

    // Mappings
    mapping(address => Company) public companies;

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
     * @dev Verificar si una dirección es una empresa activa
     * @param _companyAddress Dirección de la empresa
     * @return true si la empresa está registrada y activa, false en caso contrario
     */
    function isActiveCompany(
        address _companyAddress
    ) external view override returns (bool) {
        return companies[_companyAddress].isActive;
    }

    /**
     * @dev Registrar una empresa
     * @param _name Nombre de la empresa
     * @param _description Descripción de la empresa
     */
    function registerCompany(
        string memory _name,
        string memory _description
    ) external override {
        if (msg.sender == address(0)) revert InvalidCompanyAddress();
        if (companies[msg.sender].isActive) revert CompanyAlreadyRegistered();

        companies[msg.sender] = Company({
            companyAddress: msg.sender,
            name: _name,
            description: _description,
            isActive: true,
            eventIds: new uint256[](0)
        });

        emit CompanyRegistered(msg.sender, _name);
    }

    /**
     * @dev Obtener información de una empresa
     * @param _companyAddress Dirección de la empresa
     * @return company Estructura de la empresa
     */
    function getCompany(
        address _companyAddress
    ) external view override returns (Company memory company) {
        return companies[_companyAddress];
    }

    /**
     * @dev Desactivar una empresa
     * @param _companyAddress Dirección de la empresa
     */
    function deactivateCompany(
        address _companyAddress
    ) external override onlyRole {
        if (_companyAddress == address(0)) revert InvalidCompanyAddress();
        if (!companies[_companyAddress].isActive) revert CompanyNotActive();

        companies[_companyAddress].isActive = false;
        emit CompanyDeactivated(_companyAddress);
    }

    /**
     * @dev Reactivar una empresa
     * @param _companyAddress Dirección de la empresa
     */
    function reactivateCompany(
        address _companyAddress
    ) external override onlyRole {
        if (_companyAddress == address(0)) revert InvalidCompanyAddress();
        if (companies[_companyAddress].isActive) revert CompanyAlreadyActive();

        companies[_companyAddress].isActive = true;
        emit CompanyReactivated(_companyAddress);
    }

    /**
     * @dev Agregar un evento a una empresa
     * @param _companyAddress Dirección de la empresa
     * @param _eventId ID del evento
     */
    function addEventToCompany(
        address _companyAddress,
        uint256 _eventId
    ) external override onlyRole {
        if (_companyAddress == address(0)) revert InvalidCompanyAddress();
        if (!companies[_companyAddress].isActive) revert CompanyNotActive();

        companies[_companyAddress].eventIds.push(_eventId);
    }

    /**
     * @dev Obtener los IDs de eventos de una empresa
     * @param _companyAddress Dirección de la empresa
     * @return Array de IDs de eventos
     */
    function getCompanyEvents(
        address _companyAddress
    ) external view override returns (uint256[] memory) {
        return companies[_companyAddress].eventIds;
    }

    // Función para asignar admin
    function grantAdmin(address account) external onlyRole {
        if (account == address(0)) revert InvalidAccount();
        admins[account] = true;
    }
}
