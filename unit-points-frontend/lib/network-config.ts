import {defineChain} from 'viem';
import {createConfig} from '@privy-io/wagmi';
import {http} from 'wagmi'
import { sepolia, hardhat } from "wagmi/chains";
import { injected } from "wagmi/connectors";


export const passetHub = defineChain({
  id: 420420422, // Replace this with your chain's ID
  name: 'Polkadot Hub TestNet',
  //network: 'my-custom-chain',
  nativeCurrency: {
    decimals: 12, // Replace this with the number of decimals for your chain's native token
    name: 'PAS',
    symbol: 'PAS'
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-passet-hub-eth-rpc.polkadot.io'],
      //webSocket: ['wss://my-custom-chain-websocket-rpc']
    }
  },
  blockExplorers: {
    default: {name: 'Explorer', url: 'https://blockscout-passet-hub.parity-testnet.parity.io'}
  }
});

// Configure the chains you want to support
export const chains = [passetHub, sepolia, hardhat] as const;

// Create wagmi config with Privy integration
export const config = createConfig({
  chains,
  //connectors: [injected()],
  transports: {
    [passetHub.id]: http(),
    [sepolia.id]: http(),
    [hardhat.id]: http("http://127.0.0.1:8545"),
  },
  ssr: true, // Enable SSR support
});

// Export the config type for TypeScript
export type Config = typeof config;



