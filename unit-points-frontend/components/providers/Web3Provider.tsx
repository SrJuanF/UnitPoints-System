'use client';

import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {defineChain, http} from 'viem';
import {mainnet, sepolia} from 'viem/chains';

import type {PrivyClientConfig} from '@privy-io/react-auth';
import {PrivyProvider} from '@privy-io/react-auth';
import {WagmiProvider, createConfig} from '@privy-io/wagmi';


export const passetHub = defineChain({
  id: 420420422, // Replace this with your chain's ID
  name: 'Polkadot Hub TestNet',
  //network: 'my-custom-chain',
  nativeCurrency: {
    decimals: 18, // Replace this with the number of decimals for your chain's native token
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
export const chains = [passetHub, sepolia, mainnet] as const;

// Create wagmi config with Privy integration
export const wagmiConfig = createConfig({
  chains,
  //connectors: [injected()],
  transports: {
    [passetHub.id]: http(),
    [sepolia.id]: http(),
    [mainnet.id]: http(),
  },
  //ssr: true, // Enable SSR support
});
/*export const wagmiConfig = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});*/

const privyConfig: PrivyClientConfig = {
  embeddedWallets: {
    createOnLogin: 'users-without-wallets',
    requireUserPasswordOnCreate: true,
    noPromptOnSignature: false,
  },
  loginMethods: ['wallet', 'email', 'sms'],
  appearance: {
    showWalletLoginFirst: true,
  },
  defaultChain: passetHub,
  supportedChains: [passetHub, sepolia, mainnet],
};

const queryClient = new QueryClient();

export default function Web3Providers({children}: {children: React.ReactNode}) {
  return (
    <PrivyProvider
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      apiUrl={process.env.NEXT_PUBLIC_PRIVY_AUTH_URL as string}
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID as string}
      config={privyConfig}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig} reconnectOnMount={false}>
          {children}
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}