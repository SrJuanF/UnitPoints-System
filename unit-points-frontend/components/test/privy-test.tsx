"use client";

import {shorten} from '../../lib/utils';

import {usePrivy, useWallets} from '@privy-io/react-auth';
import {useLogin} from '@privy-io/react-auth';
import {useSetActiveWallet} from '@privy-io/wagmi';
import {useAccount, useDisconnect} from 'wagmi';

import SwitchNetwork from '../wallet/SwitchNetwork';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function PrivyTest() {
  // Privy hooks
  const {wallets, ready: walletsReady} = useWallets();
  const {ready, user, authenticated, connectWallet, logout, linkWallet} = usePrivy();

  const {login} = useLogin({
    onComplete: (loginData: any) => {
      //console.log('📊 Complete login data:', loginData);
      console.log('👤 LinkedAccounts:', loginData?.linkedAccounts?.length);
      
      // Verificar si hay una wallet conectada recientemente (últimos 3 minutos)
      const hasRecentWalletConnection = loginData?.linkedAccounts?.some((account: any) => {
        if (account.type === "wallet" && account.verifiedAt) {
          const verifiedTime = new Date(account.verifiedAt);
          const currentTime = new Date();
          const timeDifferenceInMinutes = (currentTime.getTime() - verifiedTime.getTime()) / (1000 * 60);
          
          console.log('🔍 Wallet verification check:', {
            type: account.type,
            verifiedAt: account.verifiedAt,
            timeDifferenceInMinutes: timeDifferenceInMinutes.toFixed(2),
            isRecent: timeDifferenceInMinutes <= 3
          });
          
          return timeDifferenceInMinutes <= 3;
        }
        return false;
      });
      
      if (hasRecentWalletConnection) {
        console.log('✅ Wallet conectada recientemente detectada!');
        // Aquí puedes agregar la lógica adicional que necesites cuando se detecte una conexión reciente
      } else {
        console.log('⏰ No se detectó creacion de wallet reciente (últimos 3 minutos)');
      }
    },
    onError: (error: any) => {
      console.error('❌ Login failed:', error);
      // Show error message
    },
  });

  // WAGMI hooks
  const {address, isConnected, isConnecting, isDisconnected} = useAccount();
  const {disconnect} = useDisconnect();
  const {setActiveWallet} = useSetActiveWallet();

  if (!ready) {
    return null;
  }

  return(
    <>
    <main className="min-h-screen bg-slate-200 p-4 text-slate-800">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="border-1 flex flex-col items-start gap-2 rounded border border-black bg-slate-100 p-3">
            <h1 className="text-4xl font-bold">Privy</h1>
            {ready && !authenticated && (
              <>
                <p>You are not authenticated with Privy</p>
                <div className="flex items-center gap-4">
                  <Button onClick={login}>Login with Privy</Button>
                  <span>or</span>
                  <Button onClick={connectWallet}>Connect only</Button>
                </div>
              </>
            )}

            {walletsReady &&
              wallets.map((wallet) => {
                return (
                  <div
                    key={wallet.address}
                    className="flex min-w-full flex-row flex-wrap items-center justify-between gap-2 bg-slate-50 p-4"
                  >
                    <div>
                      <Badge variant="secondary" className="font-mono">
                        {shorten(wallet.address)}
                      </Badge>
                    </div>
                    <Button
                      className="bg-primary text-white"
                      onClick={() => {
                        setActiveWallet(wallet);
                      }}
                    >
                      Make active
                    </Button>
                  </div>
                );
              })}

            {ready && authenticated && (
              <>
                <p className="mt-2">You are logged in with privy.</p>
                <Button onClick={connectWallet}>Connect another wallet</Button>
                <Button onClick={linkWallet}>Link another wallet</Button>
                <textarea
                  value={JSON.stringify(wallets, null, 2)}
                  className="mt-2 w-full rounded-md bg-slate-700 p-4 font-mono text-xs text-slate-50 sm:text-sm"
                  rows={JSON.stringify(wallets, null, 2).split('\n').length}
                  disabled
                />
                <br />
                <textarea
                  value={JSON.stringify(user, null, 2)}
                  className="mt-2 w-full rounded-md bg-slate-700 p-4 font-mono text-xs text-slate-50 sm:text-sm"
                  rows={JSON.stringify(user, null, 2).split('\n').length}
                  disabled
                />
                <br />
                <Button onClick={logout}>Logout</Button>
              </>
            )}
          </div>
          <div className="border-1 flex flex-col items-start gap-2 rounded border border-black bg-slate-100 p-3">
            <h1 className="text-4xl font-bold">WAGMI</h1>
            <p>
              Connection status: {isConnecting && <span>🟡 connecting...</span>}
              {isConnected && <span>🟢 connected.</span>}
              {isDisconnected && <span> 🔴 disconnected.</span>}
            </p>
            {isConnected && address && (
              <>
                <h2 className="mt-6 text-2xl">useAccount</h2>
                <p>
                  address: <Badge variant="secondary" className="font-mono">{address}</Badge>
                </p>
                <SwitchNetwork />
                <h2 className="mt-6 text-2xl">useDisconnect</h2>
                <Button onClick={() => disconnect} className="bg-primary text-white">
                  Disconnect from WAGMI
                </Button>
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );

  
}

