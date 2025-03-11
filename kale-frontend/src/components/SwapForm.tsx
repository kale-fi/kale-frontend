import React, { useState } from 'react';
import { SigningStargateClient } from '@cosmjs/stargate';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { useToast } from './ui/use-toast';
import { Wallet } from '../types';

// Contract address (replace with actual address in production)
const KALE_AMM_CONTRACT = '<kale-amm-address>';

interface SwapFormProps {
  wallet: Wallet;
}

const SwapForm: React.FC<SwapFormProps> = ({ wallet }) => {
  const [tokenA, setTokenA] = useState<string>('ukale');
  const [tokenB, setTokenB] = useState<string>('usdc');
  const [amount, setAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const calculateFee = (amount: number): number => {
    return amount * 0.002; // 0.2% fee
  };

  const handleSwap = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!wallet.address || !wallet.client) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to perform a swap",
        variant: "destructive",
      });
      return;
    }

    if (amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to swap",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Prepare the swap message
      const swapMsg = {
        kale_swap: {
          amount: amount.toString(),
          token_in: tokenA,
          token_out: tokenB
        }
      };

      // Execute the contract call
      const client = wallet.client as SigningStargateClient;
      const fee = {
        amount: [{ denom: 'ukale', amount: '5000' }],
        gas: '200000',
      };

      const result = await client.signAndBroadcast(
        wallet.address,
        [{
          typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
          value: {
            sender: wallet.address,
            contract: KALE_AMM_CONTRACT,
            msg: Buffer.from(JSON.stringify(swapMsg)),
            funds: [{ denom: tokenA, amount: amount.toString() }]
          }
        }],
        fee
      );

      if (result.code === 0) {
        toast({
          title: "Swap successful",
          description: `Swapped ${amount} ${tokenA} for ${tokenB}`,
        });
      } else {
        throw new Error(`Transaction failed with code ${result.code}: ${result.rawLog}`);
      }
    } catch (error) {
      console.error('Swap error:', error);
      toast({
        title: "Swap failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate the fee for display
  const fee = calculateFee(amount);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Swap Tokens</CardTitle>
        <CardDescription>Exchange tokens with 0.2% fee</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSwap} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tokenA">From</Label>
            <Input
              id="tokenA"
              value={tokenA}
              onChange={(e) => setTokenA(e.target.value)}
              placeholder="Token symbol (e.g., ukale)"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              value={amount || ''}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              placeholder="0.0"
              min="0"
              step="0.000001"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tokenB">To</Label>
            <Input
              id="tokenB"
              value={tokenB}
              onChange={(e) => setTokenB(e.target.value)}
              placeholder="Token symbol (e.g., usdc)"
              required
            />
          </div>

          {amount > 0 && (
            <div className="text-sm text-muted-foreground">
              <p>Fee: {fee.toFixed(6)} {tokenA} (0.2%)</p>
              <p>You will receive approximately: {(amount - fee).toFixed(6)} {tokenB}</p>
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          type="submit" 
          className="w-full" 
          onClick={handleSwap}
          disabled={isLoading || !wallet.address || amount <= 0}
        >
          {isLoading ? "Processing..." : "Swap"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SwapForm; 