/**
 * Web3 utility functions for address formatting, network handling, and blockchain interactions
 */

/**
 * Shortens a wallet address for display purposes
 * @param address - The full wallet address
 * @param startLength - Number of characters to show at the start (default: 6)
 * @param endLength - Number of characters to show at the end (default: 4)
 * @returns Shortened address in format "0x1234...5678"
 */
export function shortenAddress(
  address: string,
  startLength: number = 6,
  endLength: number = 4
): string {
  if (!address) return "";
  if (address.length <= startLength + endLength) return address;
  
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
}

/**
 * Validates if a string is a valid Ethereum address
 * @param address - The address to validate
 * @returns True if valid Ethereum address
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Formats token amounts for display
 * @param amount - The token amount (in wei or smallest unit)
 * @param decimals - Number of decimals for the token (default: 18)
 * @param displayDecimals - Number of decimals to show (default: 4)
 * @returns Formatted token amount
 */
export function formatTokenAmount(
  amount: string | number | bigint,
  decimals: number = 18,
  displayDecimals: number = 4
): string {
  try {
    const amountBigInt = BigInt(amount);
    const divisor = BigInt(10 ** decimals);
    const quotient = amountBigInt / divisor;
    const remainder = amountBigInt % divisor;
    
    if (remainder === 0n) {
      return quotient.toString();
    }
    
    const decimalPart = remainder.toString().padStart(decimals, '0');
    const trimmedDecimal = decimalPart.slice(0, displayDecimals).replace(/0+$/, '');
    
    if (trimmedDecimal === '') {
      return quotient.toString();
    }
    
    return `${quotient}.${trimmedDecimal}`;
  } catch (error) {
    console.error('Error formatting token amount:', error);
    return '0';
  }
}

/**
 * Gets the block explorer URL for a given network
 * @param chainId - The chain ID
 * @returns Block explorer base URL
 */
export function getExplorerUrl(chainId: number): string {
  const explorers: Record<number, string> = {
    1: 'https://etherscan.io',
    5: 'https://goerli.etherscan.io',
    11155111: 'https://sepolia.etherscan.io',
    137: 'https://polygonscan.com',
    80001: 'https://mumbai.polygonscan.com',
    42161: 'https://arbiscan.io',
    421613: 'https://goerli.arbiscan.io',
    10: 'https://optimistic.etherscan.io',
    420: 'https://goerli-optimism.etherscan.io',
  };
  
  return explorers[chainId] || 'https://etherscan.io';
}

/**
 * Gets the full explorer URL for a transaction
 * @param txHash - Transaction hash
 * @param chainId - Chain ID (default: 1 for mainnet)
 * @returns Full URL to view transaction
 */
export function getTransactionUrl(txHash: string, chainId: number = 1): string {
  const baseUrl = getExplorerUrl(chainId);
  return `${baseUrl}/tx/${txHash}`;
}

/**
 * Gets the full explorer URL for an address
 * @param address - Wallet address
 * @param chainId - Chain ID (default: 1 for mainnet)
 * @returns Full URL to view address
 */
export function getAddressUrl(address: string, chainId: number = 1): string {
  const baseUrl = getExplorerUrl(chainId);
  return `${baseUrl}/address/${address}`;
}

/**
 * Converts wei to ether
 * @param wei - Amount in wei
 * @returns Amount in ether as string
 */
export function weiToEther(wei: string | number | bigint): string {
  return formatTokenAmount(wei, 18, 6);
}

/**
 * Converts ether to wei
 * @param ether - Amount in ether
 * @returns Amount in wei as bigint
 */
export function etherToWei(ether: string | number): bigint {
  const etherStr = ether.toString();
  const [whole, decimal = ''] = etherStr.split('.');
  const paddedDecimal = decimal.padEnd(18, '0').slice(0, 18);
  return BigInt(whole + paddedDecimal);
}