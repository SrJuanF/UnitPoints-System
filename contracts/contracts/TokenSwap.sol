// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./interfaces/IUnitpointsTokens.sol";

/**
 * @title TokenSwap
 * @dev Contrato para intercambiar UnitPoints por tokens de empresas y viceversa
 */
contract TokenSwap {
    using SafeERC20 for IERC20;

    // ===== Custom errors to reduce bytecode size =====
    error NotAuthorized();
    error InvalidTokenAddress();
    error ExchangeRateMustBePositive();
    error TokenAlreadyRegistered();
    error TokenNotRegistered();
    error SwapPairNotActive();
    error AmountExceedsMaximum();
    error InvalidSectorToken();
    error InsufficientSectorTokens();
    error InsufficientLiquidity();
    error InsufficientTokens();
    error InsufficientSectorTokenLiquidity();
    error AmountMustBePositive();
    error InsufficientBalance();
    error InvalidAccount();
    error SwapFeeTooHigh();
    error InvalidExchangeRate();
    error InvalidMaxAmount();
    error ReentrantCall();

    // ===== Small constants reused across calculations =====
    uint256 private constant FEE_DENOMINATOR = 10_000;
    uint256 private constant ONE_ETHER = 1e18;

    // Mapping simple para almacenar direcciones ADMIN
    mapping(address => bool) public admins;

    // Referencias a tokens de sector
    mapping(uint16 => address) public sectorTokens;
    uint16 public nextSectorId = 1;
    mapping(address => bool) public isSectorToken; // marca rápida para evitar loops

    // Estructuras de datos
    struct SwapPair {
        address tokenAddress;
        string tokenName;
        string tokenSymbol;
        uint256 exchangeRate; // Rate: 1 UnitPoint = X company tokens
        bool isActive;
        bool isDefault;
        address company;
    }

    struct SwapRequest {
        uint256 requestId;
        address user;
        address fromToken;
        address toToken;
        uint256 amount;
        uint256 expectedOutput;
        bool isCompleted;
        uint256 timestamp;
    }

    // Mappings
    mapping(address => SwapPair) public swapPairs;
    mapping(uint256 => SwapRequest) public swapRequests;
    mapping(address => bool) public registeredTokens;
    mapping(address => mapping(address => uint256)) public liquidityPools;

    // Contadores
    uint256 public nextSwapRequestId = 1;
    address[] public registeredTokenList;

    // Parámetros por defecto
    uint256 public defaultExchangeRate = 100; // 1 UnitPoint = 100 company tokens por defecto
    uint256 public swapFee = 25; // 0.25% fee (25/10000)
    uint256 public maxSwapAmount = 10000 * 10 ** 18; // Máximo 10,000 UnitPoints por swap

    // Eventos
    event SwapPairRegistered(
        address indexed tokenAddress,
        string tokenName,
        uint256 exchangeRate,
        address indexed company
    );
    event SwapPairUpdated(
        address indexed tokenAddress,
        uint256 newExchangeRate,
        bool isActive
    );
    event SwapExecuted(
        uint256 indexed requestId,
        address indexed user,
        address fromToken,
        address toToken,
        uint256 inputAmount,
        uint256 outputAmount
    );
    event LiquidityAdded(
        address indexed token,
        uint256 amount,
        address indexed provider
    );
    event LiquidityRemoved(
        address indexed token,
        uint256 amount,
        address indexed provider
    );
    event ParametersUpdated(
        uint256 defaultExchangeRate,
        uint256 swapFee,
        uint256 maxSwapAmount
    );

    // Modifier para verificar admin
    modifier onlyRole() {
        if (!admins[msg.sender]) revert NotAuthorized();
        _;
    }

    // Reentrancy Guard (OZ-style pattern)
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
     * @dev Registrar un nuevo token para swap
     * @param _tokenAddress Dirección del token de la empresa
     * @param _tokenName Nombre del token
     * @param _tokenSymbol Símbolo del token
     * @param _exchangeRate Tasa de intercambio (1 UnitPoint = X company tokens)
     * @param _company Dirección de la empresa propietaria
     */
    function registerSwapPair(
        address _tokenAddress,
        string memory _tokenName,
        string memory _tokenSymbol,
        uint256 _exchangeRate,
        address _company
    ) external onlyRole {
        if (_tokenAddress == address(0)) revert InvalidTokenAddress();
        if (_exchangeRate == 0) revert ExchangeRateMustBePositive();
        if (registeredTokens[_tokenAddress]) revert TokenAlreadyRegistered();

        swapPairs[_tokenAddress] = SwapPair({
            tokenAddress: _tokenAddress,
            tokenName: _tokenName,
            tokenSymbol: _tokenSymbol,
            exchangeRate: _exchangeRate,
            isActive: true,
            isDefault: false,
            company: _company
        });

        registeredTokens[_tokenAddress] = true;
        registeredTokenList.push(_tokenAddress);

        emit SwapPairRegistered(
            _tokenAddress,
            _tokenName,
            _exchangeRate,
            _company
        );
    }

    /**
     * @dev Actualizar parámetros de un token de swap
     * @param _tokenAddress Dirección del token
     * @param _newExchangeRate Nueva tasa de intercambio
     * @param _isActive Si el par está activo
     */
    function updateSwapPair(
        address _tokenAddress,
        uint256 _newExchangeRate,
        bool _isActive
    ) external onlyRole {
        if (!registeredTokens[_tokenAddress]) revert TokenNotRegistered();
        if (_newExchangeRate == 0) revert ExchangeRateMustBePositive();

        swapPairs[_tokenAddress].exchangeRate = _newExchangeRate;
        swapPairs[_tokenAddress].isActive = _isActive;

        emit SwapPairUpdated(_tokenAddress, _newExchangeRate, _isActive);
    }

    /**
     * @dev Registrar un token de sector
     * @param _tokenAddress Dirección del token de sector
     */
    function registerSectorToken(
        address _tokenAddress
    ) external onlyRole returns (uint16) {
        if (_tokenAddress == address(0)) revert InvalidTokenAddress();

        uint16 sectorId = nextSectorId;
        sectorTokens[sectorId] = _tokenAddress;
        isSectorToken[_tokenAddress] = true;
        unchecked {
            nextSectorId++;
        }

        return sectorId;
    }

    /**
     * @dev Intercambiar tokens de sector por tokens de empresa
     * @param _sectorTokenId ID del token de sector
     * @param _toToken Dirección del token de destino
     * @param _amount Cantidad de tokens de sector a intercambiar
     */
    function swapSectorTokenToCompanyToken(
        uint16 _sectorTokenId,
        address _toToken,
        uint256 _amount
    ) external nonReentrant {
        if (!registeredTokens[_toToken]) revert TokenNotRegistered();
        SwapPair storage pair = swapPairs[_toToken];
        if (!pair.isActive) revert SwapPairNotActive();
        if (_amount > maxSwapAmount) revert AmountExceedsMaximum();
        if (!isSectorToken[sectorTokens[_sectorTokenId]])
            revert InvalidSectorToken();
        if (
            IUnitpointsTokens(sectorTokens[_sectorTokenId]).balanceOf(
                msg.sender
            ) < _amount
        ) revert InsufficientSectorTokens();

        uint256 fee = (_amount * swapFee) / FEE_DENOMINATOR;
        uint256 amountAfterFee = _amount - fee;
        uint256 outputAmount = (amountAfterFee * pair.exchangeRate) / ONE_ETHER;

        if (IERC20(_toToken).balanceOf(address(this)) < outputAmount)
            revert InsufficientLiquidity();

        // Transferir tokens de sector del usuario al contrato
        IUnitpointsTokens(sectorTokens[_sectorTokenId]).transferFrom(
            msg.sender,
            address(this),
            _amount
        );

        // Transferir tokens de empresa al usuario
        IERC20(_toToken).safeTransfer(msg.sender, outputAmount);

        // Registrar el swap
        uint256 requestId = nextSwapRequestId;
        swapRequests[requestId] = SwapRequest({
            requestId: requestId,
            user: msg.sender,
            fromToken: sectorTokens[_sectorTokenId],
            toToken: _toToken,
            amount: _amount,
            expectedOutput: outputAmount,
            isCompleted: true,
            timestamp: block.timestamp
        });
        unchecked {
            nextSwapRequestId++;
        }

        emit SwapExecuted(
            requestId,
            msg.sender,
            sectorTokens[_sectorTokenId],
            _toToken,
            _amount,
            outputAmount
        );
    }

    /**
     * @dev Intercambiar tokens de empresa por tokens de sector
     * @param _fromToken Dirección del token de origen
     * @param _sectorTokenId ID del token de sector de destino
     * @param _amount Cantidad de tokens de empresa a intercambiar
     */
    function swapCompanyTokenToSectorToken(
        address _fromToken,
        uint16 _sectorTokenId,
        uint256 _amount
    ) external nonReentrant {
        if (!registeredTokens[_fromToken]) revert TokenNotRegistered();
        SwapPair storage pair = swapPairs[_fromToken];
        if (!pair.isActive) revert SwapPairNotActive();
        if (!isSectorToken[sectorTokens[_sectorTokenId]])
            revert InvalidSectorToken();
        if (IERC20(_fromToken).balanceOf(msg.sender) < _amount)
            revert InsufficientTokens();

        uint256 outputAmount = (_amount * ONE_ETHER) / pair.exchangeRate;
        uint256 fee = (outputAmount * swapFee) / FEE_DENOMINATOR;
        uint256 finalOutput = outputAmount - fee;

        if (
            IUnitpointsTokens(sectorTokens[_sectorTokenId]).balanceOf(
                address(this)
            ) < finalOutput
        ) revert InsufficientSectorTokenLiquidity();

        // Transferir tokens de empresa del usuario al contrato
        IERC20(_fromToken).safeTransferFrom(msg.sender, address(this), _amount);

        // Transferir tokens de sector al usuario
        IUnitpointsTokens(sectorTokens[_sectorTokenId]).transfer(
            msg.sender,
            finalOutput
        );

        // Registrar el swap
        uint256 requestId = nextSwapRequestId;
        swapRequests[requestId] = SwapRequest({
            requestId: requestId,
            user: msg.sender,
            fromToken: _fromToken,
            toToken: sectorTokens[_sectorTokenId],
            amount: _amount,
            expectedOutput: finalOutput,
            isCompleted: true,
            timestamp: block.timestamp
        });
        unchecked {
            nextSwapRequestId++;
        }

        emit SwapExecuted(
            requestId,
            msg.sender,
            _fromToken,
            address(sectorTokens[_sectorTokenId]),
            _amount,
            finalOutput
        );
    }

    /**
     * @dev Agregar liquidez para un token
     * @param _tokenAddress Dirección del token
     * @param _amount Cantidad de tokens a agregar
     */
    function addLiquidity(address _tokenAddress, uint256 _amount) external {
        if (!registeredTokens[_tokenAddress]) revert TokenNotRegistered();
        if (_amount == 0) revert AmountMustBePositive();
        if (IERC20(_tokenAddress).balanceOf(msg.sender) < _amount)
            revert InsufficientBalance();

        IERC20(_tokenAddress).safeTransferFrom(
            msg.sender,
            address(this),
            _amount
        );
        liquidityPools[_tokenAddress][msg.sender] += _amount;

        emit LiquidityAdded(_tokenAddress, _amount, msg.sender);
    }

    /**
     * @dev Remover liquidez para un token
     * @param _tokenAddress Dirección del token
     * @param _amount Cantidad de tokens a remover
     */
    function removeLiquidity(address _tokenAddress, uint256 _amount) external {
        if (liquidityPools[_tokenAddress][msg.sender] < _amount)
            revert InsufficientLiquidity();

        liquidityPools[_tokenAddress][msg.sender] -= _amount;
        IERC20(_tokenAddress).safeTransfer(msg.sender, _amount);

        emit LiquidityRemoved(_tokenAddress, _amount, msg.sender);
    }

    /**
     * @dev Obtener la cantidad de output esperada para un swap
     * @param _fromToken Token de origen
     * @param _toToken Token de destino
     * @param _amount Cantidad a intercambiar
     */
    function getSwapOutput(
        address _fromToken,
        address _toToken,
        uint256 _amount
    ) external view returns (uint256) {
        // Verificar si es un token de sector con marca O(1)
        if (isSectorToken[_fromToken]) {
            if (!registeredTokens[_toToken]) revert TokenNotRegistered();
            uint256 fee = (_amount * swapFee) / FEE_DENOMINATOR;
            uint256 amountAfterFee = _amount - fee;
            return
                (amountAfterFee * swapPairs[_toToken].exchangeRate) / ONE_ETHER;
        } else {
            if (!registeredTokens[_fromToken]) revert TokenNotRegistered();
            uint256 outputAmount = (_amount * ONE_ETHER) /
                swapPairs[_fromToken].exchangeRate;
            uint256 fee = (outputAmount * swapFee) / FEE_DENOMINATOR;
            return outputAmount - fee;
        }
    }

    /**
     * @dev Obtener lista de tokens registrados
     */
    function getRegisteredTokens() external view returns (address[] memory) {
        return registeredTokenList;
    }

    /**
     * @dev Obtener información de un par de swap
     * @param _tokenAddress Dirección del token
     */
    function getSwapPairInfo(
        address _tokenAddress
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
        )
    {
        SwapPair storage pair = swapPairs[_tokenAddress];
        return (
            pair.tokenAddress,
            pair.tokenName,
            pair.tokenSymbol,
            pair.exchangeRate,
            pair.isActive,
            pair.isDefault,
            pair.company
        );
    }

    /**
     * @dev Actualizar parámetros del sistema
     * @param _defaultExchangeRate Nueva tasa de intercambio por defecto
     * @param _swapFee Nueva comisión de swap
     * @param _maxSwapAmount Nuevo monto máximo de swap
     */
    function updateParameters(
        uint256 _defaultExchangeRate,
        uint256 _swapFee,
        uint256 _maxSwapAmount
    ) external onlyRole {
        if (_swapFee > 1000) revert SwapFeeTooHigh(); // Máximo 10%
        if (_defaultExchangeRate == 0) revert InvalidExchangeRate();
        if (_maxSwapAmount == 0) revert InvalidMaxAmount();

        defaultExchangeRate = _defaultExchangeRate;
        swapFee = _swapFee;
        maxSwapAmount = _maxSwapAmount;

        emit ParametersUpdated(_defaultExchangeRate, _swapFee, _maxSwapAmount);
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
