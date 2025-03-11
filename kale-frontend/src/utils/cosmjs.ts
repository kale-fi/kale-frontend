import { SigningStargateClient, StargateClient, StdFee } from "@cosmjs/stargate";
import { OfflineSigner } from "@cosmjs/proto-signing";
import { GasPrice } from "@cosmjs/stargate";

// Chain configuration
export const CHAIN_ID = "kale-test-1";
export const RPC_ENDPOINT = "tcp://localhost:26657";
export const GAS_PRICE = GasPrice.fromString("0.025ukale");

// Contract addresses
export const CONTRACT_ADDRESSES = {
  ammContract: "kale-amm", // Replace with actual contract address
  socialContract: "kale-social", // Replace with actual contract address
  rewardsContract: "kale-rewards", // Replace with actual contract address
};

/**
 * Interface for Keplr window object
 */
export interface KeplrWindow extends Window {
  keplr?: {
    enable: (chainId: string) => Promise<void>;
    getOfflineSigner: (chainId: string) => OfflineSigner;
    experimentalSuggestChain: (chainInfo: any) => Promise<void>;
  };
}

/**
 * Checks if Keplr wallet is installed
 */
export const checkKeplrInstalled = (): boolean => {
  const keplrWindow = window as KeplrWindow;
  return !!keplrWindow.keplr;
};

/**
 * Suggests the Kale chain to Keplr wallet
 */
export const suggestKaleChain = async (): Promise<void> => {
  const keplrWindow = window as KeplrWindow;
  
  if (!keplrWindow.keplr) {
    throw new Error("Keplr wallet not found. Please install Keplr extension.");
  }

  await keplrWindow.keplr.experimentalSuggestChain({
    chainId: CHAIN_ID,
    chainName: "Kale Testnet",
    rpc: RPC_ENDPOINT,
    rest: "http://localhost:1317", // Replace with actual REST endpoint
    bip44: {
      coinType: 118,
    },
    bech32Config: {
      bech32PrefixAccAddr: "kale",
      bech32PrefixAccPub: "kalepub",
      bech32PrefixValAddr: "kalevaloper",
      bech32PrefixValPub: "kalevaloperpub",
      bech32PrefixConsAddr: "kalevalcons",
      bech32PrefixConsPub: "kalevalconspub",
    },
    currencies: [
      {
        coinDenom: "KALE",
        coinMinimalDenom: "ukale",
        coinDecimals: 6,
      },
    ],
    feeCurrencies: [
      {
        coinDenom: "KALE",
        coinMinimalDenom: "ukale",
        coinDecimals: 6,
        gasPriceStep: {
          low: 0.01,
          average: 0.025,
          high: 0.04,
        },
      },
    ],
    stakeCurrency: {
      coinDenom: "KALE",
      coinMinimalDenom: "ukale",
      coinDecimals: 6,
    },
  });
};

/**
 * Connects to Keplr wallet and returns the signer and first account address
 */
export const connectWallet = async (): Promise<{
  signer: OfflineSigner;
  address: string;
}> => {
  const keplrWindow = window as KeplrWindow;
  
  if (!keplrWindow.keplr) {
    throw new Error("Keplr wallet not found. Please install Keplr extension.");
  }

  try {
    // Suggest chain if it's not already added to Keplr
    try {
      await suggestKaleChain();
    } catch (error) {
      console.warn("Chain suggestion failed, trying to enable anyway:", error);
    }

    // Enable the chain in Keplr
    await keplrWindow.keplr.enable(CHAIN_ID);
    
    // Get the offline signer
    const signer = keplrWindow.keplr.getOfflineSigner(CHAIN_ID);
    
    // Get the user's account
    const accounts = await signer.getAccounts();
    
    if (accounts.length === 0) {
      throw new Error("No accounts found in Keplr wallet");
    }
    
    return {
      signer,
      address: accounts[0].address,
    };
  } catch (error) {
    console.error("Error connecting to Keplr wallet:", error);
    throw new Error(`Failed to connect to Keplr wallet: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Creates a SigningStargateClient with the provided signer
 */
export const createSigningClient = async (
  signer: OfflineSigner
): Promise<SigningStargateClient> => {
  try {
    return await SigningStargateClient.connectWithSigner(
      RPC_ENDPOINT,
      signer,
      { gasPrice: GAS_PRICE }
    );
  } catch (error) {
    console.error("Error creating signing client:", error);
    throw new Error(`Failed to create signing client: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Creates a read-only StargateClient
 */
export const createQueryClient = async (): Promise<StargateClient> => {
  try {
    return await StargateClient.connect(RPC_ENDPOINT);
  } catch (error) {
    console.error("Error creating query client:", error);
    throw new Error(`Failed to create query client: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Interface for transaction message
 */
export interface TxMessage {
  typeUrl: string;
  value: any;
}

/**
 * Sends a transaction to the blockchain
 */
export const sendTx = async (
  client: SigningStargateClient,
  address: string,
  msgs: TxMessage[],
  fee?: StdFee,
  memo?: string
): Promise<string> => {
  try {
    // If fee is not provided, let the client estimate it
    const txResponse = await client.signAndBroadcast(
      address,
      msgs,
      fee || "auto",
      memo || ""
    );
    
    if (txResponse.code !== 0) {
      throw new Error(`Transaction failed with code ${txResponse.code}: ${txResponse.rawLog}`);
    }
    
    return txResponse.transactionHash;
  } catch (error) {
    console.error("Error sending transaction:", error);
    throw new Error(`Failed to send transaction: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Executes a smart contract
 */
export const executeContract = async (
  client: SigningStargateClient,
  senderAddress: string,
  contractAddress: string,
  msg: Record<string, unknown>,
  funds: readonly { denom: string; amount: string }[] = []
): Promise<string> => {
  try {
    const executeMsg = {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: {
        sender: senderAddress,
        contract: contractAddress,
        msg: Buffer.from(JSON.stringify(msg)),
        funds,
      },
    };
    
    return await sendTx(client, senderAddress, [executeMsg]);
  } catch (error) {
    console.error("Error executing contract:", error);
    throw new Error(`Failed to execute contract: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Queries a smart contract
 */
export const queryContract = async (
  contractAddress: string,
  queryMsg: Record<string, unknown>
): Promise<any> => {
  try {
    const client = await createQueryClient();
    const queryResult = await client.queryContractSmart(
      contractAddress,
      queryMsg
    );
    return queryResult;
  } catch (error) {
    console.error("Error querying contract:", error);
    throw new Error(`Failed to query contract: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Helper function to format coin amounts
 */
export const formatCoin = (amount: string | number, denom: string): string => {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  
  if (denom === "ukale") {
    return `${(numAmount / 1_000_000).toFixed(6)} KALE`;
  }
  
  return `${numAmount} ${denom}`;
};

/**
 * Helper function to parse coin amounts to the smallest denomination
 */
export const parseCoins = (amount: number, denom: string): string => {
  if (denom === "KALE") {
    return `${Math.floor(amount * 1_000_000)}ukale`;
  }
  
  return `${amount}${denom}`;
}; 