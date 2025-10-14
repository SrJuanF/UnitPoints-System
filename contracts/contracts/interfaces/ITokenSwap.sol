// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title ITokenSwap
 * @dev Interface para TokenSwap - reduce dependencias circulares
 */
interface ITokenSwap {
    // Eventos
    event SwapPairCreated(
        uint256 indexed pairId,
        address indexed tokenAddress,
        string tokenName
    );
    event SwapExecuted(
        address indexed user,
        uint256 indexed pairId,
        uint256 amountIn,
        uint256 amountOut
    );
    event ExchangeRateUpdated(uint256 indexed pairId, uint256 newRate);

    // Estructuras
    struct SwapPair {
        address tokenAddress;
        string tokenName;
        string tokenSymbol;
        uint256 exchangeRate; // Rate: 1 UnitPoint = X company tokens
        bool isActive;
        bool isDefault;
        address company;
    }

    // Funciones que necesita SimpleTokenAdministrator
    function registerSectorToken(
        address _tokenAddress
    ) external returns (uint16);

    function createSwapPair(
        address _tokenAddress,
        string memory _tokenName,
        string memory _tokenSymbol,
        uint256 _exchangeRate,
        address _company
    ) external returns (uint256);

    function executeSwap(
        uint256 _pairId,
        uint256 _amountIn,
        bool _isUnitPointsToCompany
    ) external;

    function getSwapPairInfo(
        uint256 _pairId
    )
        external
        view
        returns (
            address tokenAddress,
            string memory tokenName,
            string memory tokenSymbol,
            uint256 exchangeRate,
            bool isActive,
            bool isDefault,
            address company
        );

    function getActiveSwapPairs() external view returns (uint256[] memory);

    function calculateSwapAmount(
        uint256 _pairId,
        uint256 _amountIn,
        bool _isUnitPointsToCompany
    ) external view returns (uint256);
}
