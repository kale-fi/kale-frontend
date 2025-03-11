import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Search, Star, UserPlus, User, TrendingUp, BadgeCheck, Users, Leaf } from 'lucide-react';

// Mock data for traders
const mockTraders = [
  { id: 1, address: 'kale1abc...def', name: 'Crypto Wizard', followers: 1240, profit: 145.8, verified: true },
  { id: 2, address: 'kale2ghi...jkl', name: 'DeFi Queen', followers: 980, profit: 132.5, verified: true },
  { id: 3, address: 'kale3mno...pqr', name: 'Trading King', followers: 756, profit: 118.7, verified: false },
  { id: 4, address: 'kale4stu...vwx', name: 'Swap Master', followers: 542, profit: 95.2, verified: true },
  { id: 5, address: 'kale5yza...bcd', name: 'Yield Hunter', followers: 421, profit: 82.9, verified: false },
  { id: 6, address: 'kale6efg...hij', name: 'Token Trader', followers: 385, profit: 76.3, verified: false },
  { id: 7, address: 'kale7klm...nop', name: 'Crypto Ninja', followers: 315, profit: 64.8, verified: true },
  { id: 8, address: 'kale8qrs...tuv', name: 'Whale Watcher', followers: 287, profit: 59.1, verified: false },
];

// Mock social feed data
const mockFeed = [
  { 
    id: 1, 
    trader: { id: 1, address: 'kale1abc...def', name: 'Crypto Wizard', verified: true }, 
    content: 'Just made a big swap on KALE/ATOM pair. Looking bullish for the next few days!', 
    timestamp: '5 mins ago',
    likes: 24,
  },
  { 
    id: 2, 
    trader: { id: 4, address: 'kale4stu...vwx', name: 'Swap Master', verified: true }, 
    content: 'Added liquidity to the USDC/KALE pool. Expecting some good yield in the coming weeks.', 
    timestamp: '25 mins ago',
    likes: 18,
  },
  { 
    id: 3, 
    trader: { id: 2, address: 'kale2ghi...jkl', name: 'DeFi Queen', verified: true }, 
    content: 'Market analysis: bullish on KALE, bearish on ATOM for the next 48 hours based on technical indicators.', 
    timestamp: '1 hour ago',
    likes: 42,
  },
  { 
    id: 4, 
    trader: { id: 7, address: 'kale7klm...nop', name: 'Crypto Ninja', verified: true }, 
    content: 'Just claimed my staking rewards! The APR is absolutely amazing right now.', 
    timestamp: '2 hours ago',
    likes: 15,
  },
];

const Social: React.FC = () => {
  const { wallet } = useWallet();
  const [searchQuery, setSearchQuery] = useState('');
  const [followedTraders, setFollowedTraders] = useState<number[]>([]);
  const [likedPosts, setLikedPosts] = useState<number[]>([]);

  const toggleFollow = (traderId: number) => {
    setFollowedTraders(prev => 
      prev.includes(traderId) 
        ? prev.filter(id => id !== traderId) 
        : [...prev, traderId]
    );
  };

  const toggleLike = (postId: number) => {
    setLikedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId) 
        : [...prev, postId]
    );
  };

  const filteredTraders = mockTraders.filter(trader => 
    trader.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trader.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <Users className="h-8 w-8 mr-2 text-kale-600" />
        <h1 className="text-3xl font-bold">Social</h1>
      </div>

      <Tabs defaultValue="feed" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6 bg-kale-50 dark:bg-kale-900/30">
          <TabsTrigger value="feed" className="data-[state=active]:bg-kale-600 data-[state=active]:text-white">Feed</TabsTrigger>
          <TabsTrigger value="traders" className="data-[state=active]:bg-kale-600 data-[state=active]:text-white">Traders</TabsTrigger>
          <TabsTrigger value="following" className="data-[state=active]:bg-kale-600 data-[state=active]:text-white">Following</TabsTrigger>
        </TabsList>

        <TabsContent value="feed">
          {!wallet?.address ? (
            <Card className="border-kale-100 text-center py-10">
              <div className="flex justify-center mb-4">
                <Leaf className="h-16 w-16 text-kale-300" />
              </div>
              <h2 className="text-xl font-medium mb-2">Connect Your Wallet</h2>
              <p className="text-muted-foreground mb-4">
                Connect your wallet to see the latest updates from traders you follow
              </p>
              <Button className="bg-kale-600 hover:bg-kale-700 text-white">
                Connect Wallet
              </Button>
            </Card>
          ) : (
            <div className="space-y-6">
              {mockFeed.map((post) => (
                <Card key={post.id} className="border-kale-100 hover:border-kale-300 transition-colors">
                  <CardContent className="pt-6">
                    <div className="flex items-start">
                      <div className="h-10 w-10 rounded-full bg-kale-100 flex items-center justify-center text-kale-600 mr-3">
                        <User className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span className="font-medium">{post.trader.name}</span>
                          {post.trader.verified && (
                            <BadgeCheck className="h-4 w-4 text-kale-600 ml-1" />
                          )}
                          <span className="text-xs text-muted-foreground ml-2">• {post.timestamp}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mb-2">
                          {post.trader.address}
                        </div>
                        <p className="mt-1">{post.content}</p>
                        <div className="mt-4 flex items-center space-x-4">
                          <button 
                            onClick={() => toggleLike(post.id)}
                            className={`flex items-center text-sm ${
                              likedPosts.includes(post.id) ? 'text-kale-600' : 'text-muted-foreground hover:text-kale-600'
                            }`}
                          >
                            <Star className="h-4 w-4 mr-1" />
                            {likedPosts.includes(post.id) ? post.likes + 1 : post.likes}
                          </button>
                          <button className="flex items-center text-sm text-muted-foreground hover:text-kale-600">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            View Analytics
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="traders">
          <Card className="border-kale-100">
            <CardHeader>
              <CardTitle>Top Traders</CardTitle>
              <CardDescription>
                Follow traders to see their updates and trading signals
              </CardDescription>
              <div className="relative mt-4">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or address"
                  className="pl-8 border-kale-200 focus-visible:ring-kale-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="bg-kale-50 dark:bg-kale-900/30">
                    <TableHead>Trader</TableHead>
                    <TableHead>Followers</TableHead>
                    <TableHead className="text-right">30d Profit</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTraders.map((trader) => (
                    <TableRow key={trader.id} className="hover:bg-kale-50/50 dark:hover:bg-kale-900/10">
                      <TableCell>
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-kale-100 flex items-center justify-center text-kale-600 mr-2">
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="flex items-center">
                              <span className="font-medium">{trader.name}</span>
                              {trader.verified && (
                                <BadgeCheck className="h-4 w-4 text-kale-600 ml-1" />
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {trader.address}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{trader.followers.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-green-600">
                        +{trader.profit.toFixed(2)}%
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleFollow(trader.id)}
                          className={
                            followedTraders.includes(trader.id)
                              ? "border-kale-200 bg-kale-50 text-kale-700"
                              : "border-kale-200 hover:bg-kale-50 hover:text-kale-700"
                          }
                        >
                          {followedTraders.includes(trader.id) ? (
                            <>
                              <Star className="h-4 w-4 mr-1 fill-kale-600 text-kale-600" /> Following
                            </>
                          ) : (
                            <>
                              <UserPlus className="h-4 w-4 mr-1" /> Follow
                            </>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="following">
          {followedTraders.length === 0 ? (
            <Card className="border-kale-100 text-center py-10">
              <div className="flex justify-center mb-4">
                <Users className="h-16 w-16 text-kale-300" />
              </div>
              <h2 className="text-xl font-medium mb-2">No Traders Followed Yet</h2>
              <p className="text-muted-foreground mb-4">
                Follow some traders to see them here
              </p>
              <Button
                variant="outline"
                className="border-kale-200 hover:bg-kale-50 text-kale-700"
                onClick={() => document.querySelector('button[value="traders"]')?.click()}
              >
                Explore Traders
              </Button>
            </Card>
          ) : (
            <Card className="border-kale-100">
              <CardHeader>
                <CardTitle>Traders You Follow</CardTitle>
                <CardDescription>
                  Your personalized list of traders to track
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-kale-50 dark:bg-kale-900/30">
                      <TableHead>Trader</TableHead>
                      <TableHead className="text-right">30d Profit</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTraders
                      .filter((trader) => followedTraders.includes(trader.id))
                      .map((trader) => (
                        <TableRow key={trader.id} className="hover:bg-kale-50/50 dark:hover:bg-kale-900/10">
                          <TableCell>
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-kale-100 flex items-center justify-center text-kale-600 mr-2">
                                <User className="h-4 w-4" />
                              </div>
                              <div>
                                <div className="flex items-center">
                                  <span className="font-medium">{trader.name}</span>
                                  {trader.verified && (
                                    <BadgeCheck className="h-4 w-4 text-kale-600 ml-1" />
                                  )}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {trader.address}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right text-green-600">
                            +{trader.profit.toFixed(2)}%
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleFollow(trader.id)}
                              className="border-kale-200 text-kale-700 hover:bg-kale-50"
                            >
                              <Star className="h-4 w-4 mr-1 fill-kale-600 text-kale-600" /> Unfollow
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Social; 