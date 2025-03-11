import React, { createContext, useContext, useState, ReactNode } from 'react'
import { useToast } from '../components/ui/use-toast'
import { Wallet } from '../types'
import { useKeplrWallet } from '../hooks/useWallet'

interface WalletContextType {
  wallet: Wallet
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<Wallet>({ address: '', client: null })
  const { toast } = useToast()
  const { connectKeplr, disconnectKeplr } = useKeplrWallet()

  const connectWallet = async () => {
    try {
      const { address, client } = await connectKeplr()
      setWallet({ address, client })
      toast({
        title: 'Wallet connected',
        description: `Connected to ${address.slice(0, 8)}...${address.slice(-8)}`,
      })
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      toast({
        title: 'Connection failed',
        description: error instanceof Error ? error.message : 'Could not connect to wallet',
        variant: 'destructive',
      })
    }
  }

  const disconnectWallet = () => {
    disconnectKeplr()
    setWallet({ address: '', client: null })
    toast({
      title: 'Wallet disconnected',
    })
  }

  return (
    <WalletContext.Provider value={{ wallet, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
} 