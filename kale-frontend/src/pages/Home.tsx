import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Shield, Users, Zap, Leaf } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';

const Home: React.FC = () => {
  return (
    <div className="space-y-16">
      {/* Hero section */}
      <section className="py-12 md:py-24 text-center">
        <div className="flex justify-center mb-6">
          <Leaf className="h-16 w-16 text-kale-600" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          The Next-Gen <span className="text-kale-600">SocialFi</span> Trading Platform
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 md:max-w-3xl mx-auto">
          Trade, follow top performers, and earn rewards all in one decentralized platform
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-kale-600 hover:bg-kale-700 text-white" asChild>
            <Link to="/trade">Start Trading</Link>
          </Button>
          <Button size="lg" variant="outline" className="border-kale-600 text-kale-600 hover:bg-kale-50" asChild>
            <Link to="/social">Explore Social</Link>
          </Button>
        </div>
      </section>

      {/* Features section */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Platform Features</h2>
          <p className="text-muted-foreground md:max-w-2xl mx-auto">
            KaleFi combines DEX trading with social features and rewards to create a comprehensive DeFi experience
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-kale-100 hover:border-kale-300 transition-colors">
            <CardHeader>
              <Zap className="h-8 w-8 mb-4 text-kale-600" />
              <CardTitle>Fast & Low-Fee Trading</CardTitle>
              <CardDescription>
                Swap tokens with minimal slippage and low fees
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>0.2% swap fee - 90% to liquidity providers</li>
                <li>Lightning-fast transactions</li>
                <li>Multiple token pairs supported</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full border-kale-200 text-kale-700 hover:bg-kale-50" asChild>
                <Link to="/trade" className="flex items-center justify-center">
                  Start Trading <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-kale-100 hover:border-kale-300 transition-colors">
            <CardHeader>
              <Users className="h-8 w-8 mb-4 text-kale-600" />
              <CardTitle>Social Trading</CardTitle>
              <CardDescription>
                Follow top traders and gain insights from the community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Leaderboards of best performing traders</li>
                <li>Follow traders and get notifications</li>
                <li>Social feed with trading insights</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full border-kale-200 text-kale-700 hover:bg-kale-50" asChild>
                <Link to="/social" className="flex items-center justify-center">
                  Explore Social <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-kale-100 hover:border-kale-300 transition-colors">
            <CardHeader>
              <Shield className="h-8 w-8 mb-4 text-kale-600" />
              <CardTitle>Rewards & Staking</CardTitle>
              <CardDescription>
                Earn rewards for participation and liquidity provision
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Stake KALE tokens for platform rewards</li>
                <li>Earn from trading volume and referrals</li>
                <li>Weekly rewards distribution</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full border-kale-200 text-kale-700 hover:bg-kale-50" asChild>
                <Link to="/rewards" className="flex items-center justify-center">
                  View Rewards <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Stats section */}
      <section className="py-16 px-8 rounded-2xl bg-gradient-to-r from-kale-50 to-kale-100 dark:from-kale-950 dark:to-kale-900">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Platform Statistics</h2>
          <p className="text-muted-foreground md:max-w-2xl mx-auto">
            Join thousands of traders already using KaleFi
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <p className="text-4xl font-bold text-kale-700">$12.5M</p>
            <p className="text-sm text-muted-foreground">Total Volume</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-kale-700">5.2K</p>
            <p className="text-sm text-muted-foreground">Active Users</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-kale-700">24K</p>
            <p className="text-sm text-muted-foreground">Transactions</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-kale-700">$2.8M</p>
            <p className="text-sm text-muted-foreground">Total Rewards</p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Button size="lg" className="bg-kale-600 hover:bg-kale-700 text-white" asChild>
            <Link to="/stats" className="flex items-center justify-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              View Detailed Stats
            </Link>
          </Button>
        </div>
      </section>

      {/* CTA section */}
      <section className="text-center py-16">
        <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
        <p className="text-muted-foreground md:max-w-2xl mx-auto mb-8">
          Join KaleFi today and experience the future of social trading
        </p>
        <Button size="lg" className="bg-kale-600 hover:bg-kale-700 text-white" asChild>
          <Link to="/trade">Launch App</Link>
        </Button>
      </section>
    </div>
  );
};

export default Home; 