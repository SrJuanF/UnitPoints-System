'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {useAccount} from 'wagmi';
import {useSwitchChain} from 'wagmi';

export const SwitchNetwork = () => {
  const {chain} = useAccount();
  const {chains, error: switchNetworkError, switchChain} = useSwitchChain();

  return (
    <div className="flex items-center gap-2">
      {chain && (
        <Badge variant="secondary" className="font-mono text-xs">
          {chain.name}
        </Badge>
      )}
      <div className="flex gap-1">
        {chains.map((x) => (
          <Button
            disabled={!switchChain || x.id === chain?.id}
            key={x.id}
            onClick={() => switchChain?.({chainId: x.id})}
            variant={x.id === chain?.id ? "default" : "outline"}
            size="sm"
            className="text-xs px-2 py-1 h-7"
          >
            {x.name}
          </Button>
        ))}
      </div>
      {switchNetworkError && (
        <div className="text-red-500 text-xs mt-2">
          Error: {switchNetworkError.message}
        </div>
      )}
    </div>
  );
};

export default SwitchNetwork;
