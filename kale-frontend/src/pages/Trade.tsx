import React from 'react';
import { useWallet } from '../context/WalletContext';
import SwapForm from '../components/SwapForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Button } from '../components/ui/button';
import { Leaf, ArrowDownUp } from 'lucide-react';

// Mock data for recent trades
const recentTrades = [
  { id: 1, trader: 'kale1abc...def', tokenA: 'KALE', tokenB: 'USDC', amount: '1000', timestamp: '2 mins ago' },
  { id: 2, trader: 'kale2ghi...jkl', tokenA: 'USDC', tokenB: 'KALE', amount: '500', timestamp: '5 mins ago' },
  { id: 3, trader: 'kale3mno...pqr', tokenA: 'KALE', tokenB: 'ATOM', amount: '250', timestamp: '10 mins ago' },
  { id: 4, trader: 'kale4stu...vwx', tokenA: 'ATOM', tokenB: 'USDC', amount: '100', timestamp: '15 mins ago' },
  { id: 5, trader: 'kale5yza...bcd', tokenA: 'USDC', tokenB: 'KALE', amount: '2000', timestamp: '20 mins ago' },
];

const Trade: React.FC = () => {
  const { wallet, connectWallet } = useWallet();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <div className="flex items-center mb-6">
          <ArrowDownUp className="h-8 w-8 mr-2 text-kale-600" />
          <h1 className="text-3xl font-bold">Trade</h1>
        </div>
        
        {!wallet?.address ? (
          <Card className="border-kale-100 text-center py-10">
            <div className="flex justify-center mb-4">
              <Leaf className="h-16 w-16 text-kale-300" />
            </div>
            <h2 className="text-xl font-medium mb-4">Connect Your Wallet to Trade</h2>
            <button 
              onClick={connectWallet}
              className="bg-kale-600 hover:bg-kale-700 text-white px-6 py-3 rounded-md transition-colors"
            >
              Connect Wallet
            </button>
          </Card>
        ) : (
          <Card className="border-kale-100">
            <CardHeader>
              <CardTitle>Swap Tokens</CardTitle>
              <CardDescription>
                Trade tokens with minimal slippage and low fees
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SwapForm wallet={wallet} />
            </CardContent>
          </Card>
        )}
      </div>
      
      <div>
        <Card className="border-kale-100">
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle>Recent Trades</CardTitle>
              <CardDescription>Latest transactions on the platform</CardDescription>
            </div>
            <Button variant="outline" className="mt-2 border-kale-200 text-kale-700 hover:bg-kale-50">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-kale-50 dark:bg-kale-900/30">
                  <TableHead>Trader</TableHead>
                  <TableHead>Pair</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTrades.map((trade) => (
                  <TableRow key={trade.id} className="hover:bg-kale-50/50 dark:hover:bg-kale-900/10">
                    <TableCell className="font-medium">{trade.trader}</TableCell>
                    <TableCell>{trade.tokenA}/{trade.tokenB}</TableCell>
                    <TableCell className="text-right">{trade.amount}</TableCell>
                    <TableCell className="text-right">{trade.timestamp}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card className="mt-6 border-kale-100">
          <CardHeader>
            <CardTitle>Market Stats</CardTitle>
            <CardDescription>Current trading statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1 bg-kale-50/50 dark:bg-kale-900/10 p-4 rounded-md">
                <p className="text-sm text-muted-foreground">24h Volume</p>
                <p className="text-2xl font-bold text-kale-700">$1,245,678</p>
              </div>
              <div className="space-y-1 bg-kale-50/50 dark:bg-kale-900/10 p-4 rounded-md">
                <p className="text-sm text-muted-foreground">Total Liquidity</p>
                <p className="text-2xl font-bold text-kale-700">$8,765,432</p>
              </div>
              <div className="space-y-1 bg-kale-50/50 dark:bg-kale-900/10 p-4 rounded-md">
                <p className="text-sm text-muted-foreground">Trades Today</p>
                <p className="text-2xl font-bold text-kale-700">1,234</p>
              </div>
              <div className="space-y-1 bg-kale-50/50 dark:bg-kale-900/10 p-4 rounded-md">
                <p className="text-sm text-muted-foreground">Active Traders</p>
                <p className="text-2xl font-bold text-kale-700">567</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Trade; 