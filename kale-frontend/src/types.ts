import { SigningStargateClient } from '@cosmjs/stargate'

export interface Wallet {
  address: string
  client: SigningStargateClient | null
} 