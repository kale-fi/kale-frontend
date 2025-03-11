import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { SigningStargateClient, StargateClient } from '@cosmjs/stargate';
import { OfflineSigner } from '@cosmjs/proto-signing';
import { Wallet } from '../types';

interface WalletContextType {
  address: string | null;
  balance: string | null;
  client: SigningStargateClient | null;
  readOnlyClient: StargateClient | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  isConnecting: boolean;
  error: string | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [client, setClient] = useState<SigningStargateClient | null>(null);
  const [readOnlyClient, setReadOnlyClient] = useState<StargateClient | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const RPC_URL = 'tcp://localhost:26657';
  const CHAIN_ID = 'kale-test-1';

  useEffect(() => {
    const initReadOnlyClient = async () => {
      try {
        const client = await StargateClient.connect(RPC_URL);
        setReadOnlyClient(client);
      } catch (err) {
        console.error('Failed to connect to read-only client:', err);
        setError('Failed to connect to blockchain. Please try again later.');
      }
    };

    initReadOnlyClient();
  }, []);

  const checkKeplrInstalled = useCallback((): boolean => {
    return window.keplr !== undefined;
  }, []);

  const getOfflineSigner = useCallback(async (): Promise<OfflineSigner> => {
    if (!checkKeplrInstalled()) {
      throw new Error('Keplr wallet extension is not installed');
    }

    await window.keplr!.enable(CHAIN_ID);
    return window.keplr!.getOfflineSigner(CHAIN_ID);
  }, [checkKeplrInstalled]);

  const connect = useCallback(async () => {
    if (address) return;
    
    setIsConnecting(true);
    setError(null);

    try {
      const signer = await getOfflineSigner();
      const accounts = await signer.getAccounts();
      
      if (accounts.length === 0) {
        throw new Error('No accounts found in Keplr');
      }

      const signingClient = await SigningStargateClient.connectWithSigner(
        RPC_URL,
        signer
      );

      setAddress(accounts[0].address);
      setClient(signingClient);
    } catch (err) {
      console.error('Failed to connect to Keplr:', err);
      setError(err instanceof Error ? err.message : 'Unknown error connecting to wallet');
    } finally {
      setIsConnecting(false);
    }
  }, [address, getOfflineSigner]);

  const disconnect = useCallback(() => {
    setAddress(null);
    setBalance(null);
    setClient(null);
    setError(null);
  }, []);

  const signAndBroadcast = useCallback(
    async (messages: any[], fee: any) => {
      if (!client || !address) {
        throw new Error('Wallet not connected');
      }

      try {
        return await client.signAndBroadcast(address, messages, fee);
      } catch (err) {
        console.error('Transaction failed:', err);
        throw err;
      }
    },
    [client, address]
  );

  useEffect(() => {
    const autoConnect = async () => {
      if (checkKeplrInstalled() && !address && !isConnecting) {
        try {
          await connect();
        } catch (err) {
          console.log('Auto-connect failed, user can connect manually');
        }
      }
    };

    autoConnect();
  }, [checkKeplrInstalled, connect, address, isConnecting]);

  useEffect(() => {
    const handleAccountChange = () => {
      if (address) {
        disconnect();
        connect();
      }
    };

    window.addEventListener('keplr_keystorechange', handleAccountChange);

    return () => {
      window.removeEventListener('keplr_keystorechange', handleAccountChange);
    };
  }, [address, disconnect, connect]);

  const wallet: Wallet = {
    address,
    client,
    isConnecting,
    error,
    connect,
    disconnect,
    signAndBroadcast
  };

  return (
    <WalletContext.Provider
      value={{
        address,
        balance,
        client,
        readOnlyClient,
        connect,
        disconnect,
        isConnecting,
        error
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

// Add Keplr type definitions
declare global {
  interface Window {
    keplr?: {
      enable: (chainId: string) => Promise<void>;
      getOfflineSigner: (chainId: string) => OfflineSigner;
    };
  }
} 