import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Coins, Gift, TrendingUp, Clock, AlertCircle, CheckCircle2, Trophy, Leaf } from 'lucide-react';

// Mock rewards data
const mockRewards = {
  totalStaked: 12500,
  availableRewards: 345.75,
  stakingRewards: 245.25,
  tradingRewards: 68.50,
  referralRewards: 32.00,
  apr: 14.5,
  nextDistribution: '2 days, 14 hours',
  stakingTiers: [
    { tier: 'Bronze', minStake: 100, apy: 8, multiplier: 1 },
    { tier: 'Silver', minStake: 1000, apy: 12, multiplier: 1.5 },
    { tier: 'Gold', minStake: 5000, apy: 15, multiplier: 2 },
    { tier: 'Platinum', minStake: 10000, apy: 18, multiplier: 2.5 },
    { tier: 'Diamond', minStake: 50000, apy: 20, multiplier: 3 },
  ],
  recentClaims: [
    { id: 1, amount: 125.5, source: 'Staking', timestamp: '3 days ago', status: 'Completed' },
    { id: 2, amount: 75.25, source: 'Trading', timestamp: '1 week ago', status: 'Completed' },
    { id: 3, amount: 45.8, source: 'Referral', timestamp: '2 weeks ago', status: 'Completed' },
  ]
};

const Rewards: React.FC = () => {
  const { wallet } = useWallet();
  const [stakeAmount, setStakeAmount] = useState('');
  const [isStaking, setIsStaking] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  // Calculate current tier based on staked amount
  const getCurrentTier = () => {
    const tiers = [...mockRewards.stakingTiers].reverse();
    return tiers.find(tier => mockRewards.totalStaked >= tier.minStake) || mockRewards.stakingTiers[0];
  };

  const currentTier = getCurrentTier();
  const nextTier = mockRewards.stakingTiers.find(tier => tier.minStake > mockRewards.totalStaked);
  const progressToNextTier = nextTier 
    ? (mockRewards.totalStaked / nextTier.minStake) * 100
    : 100;

  // Mock staking function
  const handleStake = () => {
    setIsStaking(true);
    setTimeout(() => {
      setIsStaking(false);
      setStakeAmount('');
    }, 2000);
  };

  // Mock claiming function
  const handleClaimRewards = () => {
    setIsClaiming(true);
    setTimeout(() => {
      setIsClaiming(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <Trophy className="h-8 w-8 mr-2 text-kale-600" />
        <h1 className="text-3xl font-bold">Rewards</h1>
      </div>

      {!wallet?.address ? (
        <Card className="border-kale-100 text-center py-12">
          <div className="flex justify-center mb-4">
            <Leaf className="h-16 w-16 text-kale-300" />
          </div>
          <CardContent>
            <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
            <p className="text-muted-foreground mb-6">
              Stake KALE tokens to earn rewards from trading fees, platform activities, and more
            </p>
            <Button className="bg-kale-600 hover:bg-kale-700 text-white" size="lg" onClick={() => {}}>Connect Wallet</Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-kale-100 hover:border-kale-300 transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Staked</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-kale-700">{mockRewards.totalStaked.toLocaleString()}</span>
                  <span className="ml-2 text-muted-foreground">KALE</span>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Current Tier</span>
                    <span className="font-medium text-kale-600">{currentTier.tier}</span>
                  </div>
                  {nextTier && (
                    <>
                      <Progress value={progressToNextTier} className="h-2" 
                        indicatorClassName="bg-kale-600" />
                      <div className="flex justify-between text-sm">
                        <span className="text-xs text-muted-foreground">
                          {nextTier.minStake - mockRewards.totalStaked} KALE to {nextTier.tier}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {progressToNextTier.toFixed(0)}%
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-kale-100 hover:border-kale-300 transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Available Rewards</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-kale-700">{mockRewards.availableRewards.toLocaleString()}</span>
                  <span className="ml-2 text-muted-foreground">KALE</span>
                </div>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Staking</span>
                    <span>{mockRewards.stakingRewards.toLocaleString()} KALE</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Trading</span>
                    <span>{mockRewards.tradingRewards.toLocaleString()} KALE</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Referrals</span>
                    <span>{mockRewards.referralRewards.toLocaleString()} KALE</span>
                  </div>
                </div>
                <Button 
                  className="w-full mt-4 bg-kale-600 hover:bg-kale-700 text-white" 
                  onClick={handleClaimRewards}
                  disabled={isClaiming || mockRewards.availableRewards === 0}
                >
                  {isClaiming ? 'Claiming...' : 'Claim All Rewards'}
                </Button>
              </CardContent>
            </Card>

            <Card className="border-kale-100 hover:border-kale-300 transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Reward Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 text-kale-600 mr-2" />
                      <span className="text-sm">Current APR</span>
                    </div>
                    <span className="font-medium text-kale-600">{mockRewards.apr}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-kale-600 mr-2" />
                      <span className="text-sm">Next Distribution</span>
                    </div>
                    <span className="font-medium">{mockRewards.nextDistribution}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Gift className="h-4 w-4 text-kale-600 mr-2" />
                      <span className="text-sm">Tier Multiplier</span>
                    </div>
                    <span className="font-medium text-kale-600">{currentTier.multiplier}x</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card className="border-kale-100">
              <CardHeader>
                <CardTitle>Stake KALE</CardTitle>
                <CardDescription>
                  Increase your stake to earn more rewards and reach higher tiers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Amount to Stake</label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(e.target.value)}
                        placeholder="Enter amount"
                        className="flex-1 py-2 px-3 rounded-md border border-kale-200 focus:outline-none focus:ring-2 focus:ring-kale-600 focus:border-transparent"
                      />
                      <Button 
                        variant="outline" 
                        className="border-kale-200 text-kale-700 hover:bg-kale-50"
                        onClick={() => setStakeAmount('100')}
                      >
                        Min
                      </Button>
                      <Button 
                        variant="outline" 
                        className="border-kale-200 text-kale-700 hover:bg-kale-50"
                        onClick={() => setStakeAmount('1000')}
                      >
                        Max
                      </Button>
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-kale-600 hover:bg-kale-700 text-white" 
                    onClick={handleStake}
                    disabled={isStaking || !stakeAmount}
                  >
                    {isStaking ? 'Staking...' : 'Stake KALE'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-kale-100">
              <CardHeader>
                <CardTitle>Tier Benefits</CardTitle>
                <CardDescription>
                  Higher tiers provide increased rewards and platform benefits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-kale-50 dark:bg-kale-900/30">
                      <TableHead>Tier</TableHead>
                      <TableHead>Min Stake</TableHead>
                      <TableHead className="text-right">APY</TableHead>
                      <TableHead className="text-right">Multiplier</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockRewards.stakingTiers.map((tier) => (
                      <TableRow 
                        key={tier.tier} 
                        className={
                          currentTier.tier === tier.tier 
                            ? "bg-kale-50 dark:bg-kale-900/30" 
                            : "hover:bg-kale-50/50 dark:hover:bg-kale-900/10"
                        }
                      >
                        <TableCell className={
                          currentTier.tier === tier.tier 
                            ? "font-medium text-kale-700" 
                            : "font-medium"
                        }>
                          {tier.tier}
                        </TableCell>
                        <TableCell>{tier.minStake.toLocaleString()} KALE</TableCell>
                        <TableCell className="text-right">{tier.apy}%</TableCell>
                        <TableCell className="text-right">{tier.multiplier}x</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6 border-kale-100">
            <CardHeader>
              <CardTitle>Recent Reward Claims</CardTitle>
              <CardDescription>
                History of your claimed rewards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="bg-kale-50 dark:bg-kale-900/30">
                    <TableHead>Amount</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockRewards.recentClaims.map((claim) => (
                    <TableRow key={claim.id} className="hover:bg-kale-50/50 dark:hover:bg-kale-900/10">
                      <TableCell className="font-medium text-kale-700">
                        {claim.amount} KALE
                      </TableCell>
                      <TableCell>{claim.source}</TableCell>
                      <TableCell>{claim.timestamp}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mr-1" />
                          {claim.status}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Rewards; 