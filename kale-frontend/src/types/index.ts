/**
 * Core type definitions for the Kale frontend application
 */

/**
 * Represents a trader in the social trading platform
 */
export interface Trader {
  /** Blockchain address of the trader */
  address: string;
  
  /** Profit amount in base currency */
  profit: number;
  
  /** Number of followers */
  followers: number;
  
  /** Optional trader display name */
  displayName?: string;
  
  /** Optional trader profile image URL */
  profileImage?: string;
  
  /** Trader's rank on the leaderboard (optional, may be calculated client-side) */
  rank?: number;
  
  /** Trader's success rate (percentage of profitable trades) */
  successRate?: number;
  
  /** Timestamp of when the trader joined */
  joinedAt?: string;
}

/**
 * Represents a liquidity pool in the AMM
 */
export interface Pool {
  /** First token in the pair */
  tokenA: string;
  
  /** Second token in the pair */
  tokenB: string;
  
  /** Amount of tokenA in the pool */
  reservesA: string;
  
  /** Amount of tokenB in the pool */
  reservesB: string;
  
  /** Pool's unique identifier */
  poolId?: string;
  
  /** Total value locked in the pool (in USD) */
  tvl?: string;
  
  /** Pool fee percentage */
  fee?: number;
  
  /** APY for liquidity providers */
  apy?: number;
}

/**
 * Represents staking rewards
 */
export interface Reward {
  /** Amount of tokens staked */
  staked: string;
  
  /** Yield amount earned */
  yield: string;
  
  /** Token denomination */
  denom?: string;
  
  /** Annual percentage yield */
  apy?: number;
  
  /** When rewards can be claimed */
  claimableAt?: string;
  
  /** Whether rewards are currently claimable */
  isClaimable?: boolean;
}

/**
 * Represents a token with its metadata
 */
export interface Token {
  /** Token denomination */
  denom: string;
  
  /** Human-readable token name */
  name: string;
  
  /** Token symbol */
  symbol: string;
  
  /** Number of decimal places */
  decimals: number;
  
  /** Token logo URL */
  logo?: string;
  
  /** Token price in USD */
  price?: number;
}

/**
 * Represents a swap transaction
 */
export interface SwapTransaction {
  /** Transaction hash */
  txHash: string;
  
  /** Sender address */
  sender: string;
  
  /** Input token */
  tokenIn: string;
  
  /** Output token */
  tokenOut: string;
  
  /** Input amount */
  amountIn: string;
  
  /** Output amount */
  amountOut: string;
  
  /** Transaction timestamp */
  timestamp: string;
  
  /** Transaction status */
  status: 'pending' | 'success' | 'failed';
}

/**
 * Represents a wallet connection state
 */
export interface WalletState {
  /** Whether wallet is connected */
  isConnected: boolean;
  
  /** Wallet address if connected */
  address?: string;
  
  /** Connection error if any */
  error?: string;
  
  /** Balances for different tokens */
  balances?: Record<string, string>;
}

/**
 * Represents a social action (follow/unfollow)
 */
export interface SocialAction {
  /** Action type */
  type: 'follow' | 'unfollow';
  
  /** User performing the action */
  fromAddress: string;
  
  /** Target of the action */
  toAddress: string;
  
  /** Timestamp of the action */
  timestamp: string;
}

/**
 * Represents API response pagination
 */
export interface PaginationResponse<T> {
  /** Array of items */
  items: T[];
  
  /** Total count of items */
  total: number;
  
  /** Current page number */
  page: number;
  
  /** Number of items per page */
  limit: number;
  
  /** Whether there are more items */
  hasMore: boolean;
} 