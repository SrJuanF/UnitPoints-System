// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title IUnitpointsTokens
 * @dev Interface para UnitpointsTokens - reduce dependencias circulares
 */
interface IUnitpointsTokens {
    // Eventos alineados con el contrato
    event TokensMinted(address indexed to, uint256 amount);
    event TokensBurned(address indexed from, uint256 amount);
    event SectorInfoUpdated(string sectorName, string sectorDescription);

    // Funciones ERC20 mínimas utilizadas externamente
    function transfer(address to, uint256 amount) external returns (bool);

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);

    function balanceOf(address account) external view returns (uint256);

    function totalSupply() external view returns (uint256);

    // Funciones específicas del token
    function mint(address to, uint256 amount) external;

    function burn(uint256 amount) external;

    function burnFrom(address from, uint256 amount) external;

    function grantAdmin(address account) external;

    // Getter público existente en el contrato
    function sectorDescription() external view returns (string memory);
}
