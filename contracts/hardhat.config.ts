import { HardhatUserConfig, vars } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@parity/hardhat-polkadot";

const privateKey = vars.get("PRIVATE_KEY");
if (!privateKey) {
  console.warn(
    "⚠️  WARNING: PRIVATE_KEY environment variable not found. Please set it in your .env file for network deployments."
  );
}

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
  resolc: {
    compilerSource: "npm",
    settings: {},
  },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
      // polkavm: true,
      // forking: {
      //   url: "https://testnet-passet-hub-eth-rpc.polkadot.io"
      // },
      // adapterConfig: {
      //   adapterBinaryPath: "./bin/eth-rpc",
      //   dev: true,
      // },
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
    },
    passetHubTestnet: {
      polkavm: true,
      url: "https://testnet-passet-hub-eth-rpc.polkadot.io",
      accounts: privateKey ? [privateKey] : [],
    },
  },
  etherscan: {
    apiKey: {
      passetHubTestnet: vars.get("ETHERSCAN_API_KEY")
    },
    customChains: [
      {
        network: "passetHubTestnet",
        chainId: 420420422,
        urls: {
          apiURL: "https://blockscout-passet-hub.parity-testnet.parity.io/api",
          browserURL: "https://blockscout-passet-hub.parity-testnet.parity.io"
        }
      }
    ]
  },
  sourcify: {
    enabled: true
  },
};

/*
npx hardhat verify --network passetHubTestnet 0x6359B710A473f62A31f5aB74031FC3177e4a7B75 ["UnitPoints", "UPT", "Token para eventos, conferencias, seminarios y actividades"]
*/

export default config;
