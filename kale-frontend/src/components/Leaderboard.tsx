import React, { useState, useMemo } from 'react';
import { useTraderData } from '../hooks/useTraderData';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Button } from './ui/button';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Trader, Wallet } from '../types';
import TraderCard from './TraderCard';

type SortField = 'rank' | 'profit' | 'followers';
type SortDirection = 'asc' | 'desc';

interface LeaderboardProps {
  wallet: Wallet;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ wallet }) => {
  const { traders, isLoading, error } = useTraderData();
  const [sortField, setSortField] = useState<SortField>('profit');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedTrader, setSelectedTrader] = useState<Trader | null>(null);

  // Format address for display (first 6 and last 4 characters)
  const formatAddress = (address: string): string => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Handle sort change
  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Get sort icon based on current sort state
  const getSortIcon = (field: SortField) => {
    if (field !== sortField) return <ArrowUpDown className="ml-2 h-4 w-4" />;
    return sortDirection === 'asc' ? 
      <ArrowUp className="ml-2 h-4 w-4" /> : 
      <ArrowDown className="ml-2 h-4 w-4" />;
  };

  // Sort traders based on current sort field and direction
  const sortedTraders = useMemo(() => {
    if (!traders) return [];
    
    return [...traders].sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'rank':
          comparison = (a.rank || 0) - (b.rank || 0);
          break;
        case 'profit':
          comparison = a.profit - b.profit;
          break;
        case 'followers':
          comparison = a.followers - b.followers;
          break;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [traders, sortField, sortDirection]);

  if (isLoading) {
    return <div className="text-center py-8">Loading leaderboard data...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error loading leaderboard: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Trader Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>Top traders ranked by performance</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">
                  <Button variant="ghost" onClick={() => handleSort('rank')} className="flex items-center">
                    Rank {getSortIcon('rank')}
                  </Button>
                </TableHead>
                <TableHead>Address</TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort('profit')} className="flex items-center">
                    Profit {getSortIcon('profit')}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort('followers')} className="flex items-center">
                    Followers {getSortIcon('followers')}
                  </Button>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTraders.map((trader, index) => (
                <TableRow key={trader.address} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">{trader.rank || index + 1}</TableCell>
                  <TableCell>{formatAddress(trader.address)}</TableCell>
                  <TableCell className={trader.profit >= 0 ? "text-green-500" : "text-red-500"}>
                    {trader.profit >= 0 ? '+' : ''}{trader.profit.toFixed(2)}%
                  </TableCell>
                  <TableCell>{trader.followers}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setSelectedTrader(trader)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedTrader && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-4">Trader Details</h3>
          <TraderCard trader={selectedTrader} wallet={wallet} />
          <Button 
            variant="outline" 
            className="mt-4" 
            onClick={() => setSelectedTrader(null)}
          >
            Close
          </Button>
        </div>
      )}
    </div>
  );
};

export default Leaderboard; 