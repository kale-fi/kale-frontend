import { SigningStargateClient } from '@cosmjs/stargate'
import { Window as KeplrWindow } from '@keplr-wallet/types'

declare global {
  interface Window extends KeplrWindow {}
}

// Chain configuration for Kale testnet
const CHAIN_ID = "kale-test-1"
const RPC_ENDPOINT = "tcp://localhost:26657"

// Renamed to make it clear this is the Keplr-specific hook
export const useKeplrWallet = () => {
  const connectKeplr = async () => {
    // Check if Keplr is installed
    if (!window.keplr) {
      throw new Error("Keplr wallet not found. Please install Keplr extension.")
    }

    try {
      // Request access to the chain
      await window.keplr.enable(CHAIN_ID)

      // Get the offline signer
      const offlineSigner = window.keplr.getOfflineSigner(CHAIN_ID)

      // Get accounts
      const accounts = await offlineSigner.getAccounts()
      if (accounts.length === 0) {
        throw new Error("No accounts found in Keplr")
      }

      // Create signing client
      const client = await SigningStargateClient.connectWithSigner(
        RPC_ENDPOINT,
        offlineSigner
      )

      return {
        address: accounts[0].address,
        client
      }
    } catch (error) {
      console.error("Error connecting to Keplr:", error)
      throw error
    }
  }

  const disconnectKeplr = () => {
    // Currently, Keplr doesn't have a direct method to disconnect,
    // we just reset our app state when user wants to disconnect
  }

  return {
    connectKeplr,
    disconnectKeplr
  }
} 