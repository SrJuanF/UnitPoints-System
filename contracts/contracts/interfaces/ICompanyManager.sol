// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title ICompanyManager
 * @dev Interface para gestionar empresas
 */
interface ICompanyManager {
    // Estructura de Company
    struct Company {
        address companyAddress;
        string name;
        string description;
        bool isActive;
        uint256[] eventIds;
    }

    // Eventos
    event CompanyRegistered(address indexed company, string name);
    event CompanyDeactivated(address indexed company);
    event CompanyReactivated(address indexed company);

    /**
     * @dev Registrar una empresa
     * @param _name Nombre de la empresa
     * @param _description Descripción de la empresa
     */
    function registerCompany(
        string memory _name,
        string memory _description
    ) external;

    /**
     * @dev Verificar si una dirección es una empresa activa
     * @param _companyAddress Dirección de la empresa
     * @return true si la empresa está registrada y activa, false en caso contrario
     */
    function isActiveCompany(
        address _companyAddress
    ) external view returns (bool);

    /**
     * @dev Obtener información de una empresa
     * @param _companyAddress Dirección de la empresa
     * @return company Estructura de la empresa
     */
    function getCompany(
        address _companyAddress
    ) external view returns (Company memory company);

    /**
     * @dev Desactivar una empresa
     * @param _companyAddress Dirección de la empresa
     */
    function deactivateCompany(address _companyAddress) external;

    /**
     * @dev Reactivar una empresa
     * @param _companyAddress Dirección de la empresa
     */
    function reactivateCompany(address _companyAddress) external;

    /**
     * @dev Agregar un evento a una empresa
     * @param _companyAddress Dirección de la empresa
     * @param _eventId ID del evento
     */
    function addEventToCompany(
        address _companyAddress,
        uint256 _eventId
    ) external;

    /**
     * @dev Obtener los IDs de eventos de una empresa
     * @param _companyAddress Dirección de la empresa
     * @return Array de IDs de eventos
     */
    function getCompanyEvents(
        address _companyAddress
    ) external view returns (uint256[] memory);
}
