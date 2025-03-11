import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { LineChart, BarChart, PieChart, DollarSign, TrendingUp, Users, Activity } from 'lucide-react';

// Mock data for stats
const mockVolumeData = {
  daily: '$245,678',
  weekly: '$1,456,789',
  monthly: '$5,678,912',
  change: '+12.5%',
};

const mockTradersData = {
  total: '5,234',
  active: '1,245',
  new: '132',
  change: '+8.3%',
};

const mockTokensData = {
  topGainers: [
    { name: 'KALE', price: '$1.24', change: '+15.7%' },
    { name: 'ATOM', price: '$8.76', change: '+7.2%' },
    { name: 'USDC', price: '$1.00', change: '+0.1%' },
  ],
  topLosers: [
    { name: 'ETH', price: '$2,450', change: '-3.2%' },
    { name: 'BTC', price: '$42,350', change: '-1.8%' },
    { name: 'OSMO', price: '$0.45', change: '-5.4%' },
  ],
  mostTraded: [
    { name: 'KALE', volume: '$456,789' },
    { name: 'ATOM', volume: '$345,678' },
    { name: 'USDC', volume: '$234,567' },
  ],
};

// Stats metrics cards
const StatCard: React.FC<{
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  change?: string;
  isPositive?: boolean;
}> = ({ title, value, description, icon, change, isPositive }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {change && (
          <div className={`mt-2 flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className="mr-1 h-4 w-4" />
            {change}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const Stats: React.FC = () => {
  return (
    <div>
      <h1>Stats Page</h1>
      <p>This is a simplified version to test if exports work correctly.</p>
    </div>
  );
};

export default Stats; 