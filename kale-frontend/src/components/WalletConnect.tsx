import React from 'react';
import { Button } from './ui/button';
import { useWallet } from '../hooks/useWallet';
import { Loader2 } from 'lucide-react';

const WalletConnect: React.FC = () => {
  const { address, connect, isConnecting } = useWallet();

  // Format address for display (first 6 and last 4 characters)
  const formatAddress = (address: string): string => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <Button
      onClick={connect}
      disabled={isConnecting}
      variant={address ? "outline" : "default"}
      className="min-w-[140px]"
    >
      {isConnecting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : address ? (
        formatAddress(address)
      ) : (
        "Connect Wallet"
      )}
    </Button>
  );
};

export default WalletConnect; 