// Configuración de redes para Hardhat Ignition
// Basado en la documentación de https://hardhat.org/ignition

export const networkConfigs = {
  localhost: {
    name: "localhost",
    url: "http://127.0.0.1:8545",
    chainId: 31337,
    gasPrice: "auto",
    timeout: 60000,
  },
  hardhat: {
    name: "hardhat",
    chainId: 31337,
    gasPrice: "auto",
  },
  passetHubTestnet: {
    name: "passetHubTestnet",
    url: "https://testnet-passet-hub-eth-rpc.polkadot.io",
    chainId: 0, // Se configurará dinámicamente
    gasPrice: "auto",
    timeout: 120000,
  },
};

export const deploymentConfigs = {
  // Configuración para redes de prueba
  testnet: {
    gasLimit: 8000000,
    gasPrice: "auto",
    timeout: 120000,
    confirmations: 1,
  },
  // Configuración para redes principales
  mainnet: {
    gasLimit: 8000000,
    gasPrice: "auto",
    timeout: 300000,
    confirmations: 5,
  },
  // Configuración para desarrollo local
  local: {
    gasLimit: 8000000,
    gasPrice: "auto",
    timeout: 60000,
    confirmations: 0,
  },
};
