// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

/**
 * @title SectorToken
 * @dev Token específico para cada sector de eventos
 * Ejemplos: Eventos Académicos, Eventos Musicales, etc.
 */
contract UnitpointsTokens is ERC20, ERC20Burnable {
    // Mapping simple para almacenar direcciones ADMIN
    mapping(address => bool) public admins;

    // Información del sector
    string public sectorDescription;

    // Eventos
    event TokensMinted(address indexed to, uint256 amount);
    event TokensBurned(address indexed from, uint256 amount);
    event SectorInfoUpdated(string sectorName, string sectorDescription);

    // Modifier para verificar admin
    modifier onlyRole() {
        require(admins[msg.sender], "Not authorized");
        _;
    }

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _sectorDescription
    ) ERC20(_name, _symbol) {
        sectorDescription = _sectorDescription;
        // Asignar admin al deployer y al tokenAdministrator
        admins[msg.sender] = true;
    }

    /**
     * @dev Mint tokens solo a través del TokenAdministrator o DAO
     * @param to Dirección que recibirá los tokens
     * @param amount Cantidad de tokens a mintear
     */
    function mint(address to, uint256 amount) external onlyRole {
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    /**
     * @dev Burn tokens
     * @param amount Cantidad de tokens a quemar
     */
    function burn(uint256 amount) public override onlyRole {
        _burn(msg.sender, amount);
        emit TokensBurned(msg.sender, amount);
    }

    /**
     * @dev Burn tokens de una dirección específica
     * @param from Dirección de la cual quemar tokens
     * @param amount Cantidad de tokens a quemar
     */
    function burnFrom(address from, uint256 amount) public override onlyRole {
        _spendAllowance(from, msg.sender, amount);
        _burn(from, amount);
        emit TokensBurned(from, amount);
    }

    /**
     * @dev Hook que se ejecuta antes de cualquier transferencia
     */
    function _update(
        address from,
        address to,
        uint256 value
    ) internal override {
        super._update(from, to, value);
    }

    // Función para asignar admin
    function grantAdmin(address account) external onlyRole {
        require(account != address(0), "Invalid account");
        admins[account] = true;
    }
}
