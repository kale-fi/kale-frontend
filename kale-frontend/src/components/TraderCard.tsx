import React, { useState } from 'react';
import { SigningStargateClient } from '@cosmjs/stargate';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import { Trader, Wallet } from '../types';

// Contract address (replace with actual address in production)
const KALE_SOCIAL_CONTRACT = '<kale-social-address>';

interface TraderCardProps {
  trader: Trader;
  wallet: Wallet;
}

const TraderCard: React.FC<TraderCardProps> = ({ trader, wallet }) => {
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  // Format address for display (first 6 and last 4 characters)
  const formatAddress = (address: string): string => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const handleFollow = async () => {
    if (!wallet.address || !wallet.client) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to follow this trader",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Prepare the follow message
      const followMsg = {
        kale_follow: {
          trader: trader.address,
          stake_amount: '100'
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
            contract: KALE_SOCIAL_CONTRACT,
            msg: Buffer.from(JSON.stringify(followMsg)),
            funds: [{ denom: 'ukale', amount: '100' }]
          }
        }],
        fee
      );

      if (result.code === 0) {
        setIsFollowing(true);
        toast({
          title: "Successfully followed",
          description: `You are now following ${formatAddress(trader.address)}`,
        });
      } else {
        throw new Error(`Transaction failed with code ${result.code}: ${result.rawLog}`);
      }
    } catch (error) {
      console.error('Follow error:', error);
      toast({
        title: "Failed to follow",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{formatAddress(trader.address)}</span>
          <span className={trader.profit >= 0 ? "text-green-500" : "text-red-500"}>
            {trader.profit >= 0 ? '+' : ''}{trader.profit.toFixed(2)}%
          </span>
        </CardTitle>
        <CardDescription>Trader Profile</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Followers</span>
            <span>{trader.followers}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Trades</span>
            <span>{trader.trades || 0}</span>
          </div>
          {trader.description && (
            <p className="text-sm mt-4">{trader.description}</p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleFollow}
          disabled={isLoading || isFollowing || !wallet.address}
          variant={isFollowing ? "outline" : "default"}
        >
          {isLoading ? "Processing..." : isFollowing ? "Following" : "Follow"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TraderCard; 