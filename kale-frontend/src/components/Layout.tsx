import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { Button } from './ui/button';
import { 
  BarChart3, 
  Home, 
  Users, 
  Trophy, 
  ArrowLeftRight, 
  Menu, 
  X,
  ChevronDown,
  Leaf
} from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { wallet, connectWallet, disconnectWallet } = useWallet();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = React.useState(false);

  const navItems = [
    { path: '/', label: 'Home', icon: <Home className="h-5 w-5 mr-2" /> },
    { path: '/trade', label: 'Trade', icon: <ArrowLeftRight className="h-5 w-5 mr-2" /> },
    { path: '/social', label: 'Social', icon: <Users className="h-5 w-5 mr-2" /> },
    { path: '/rewards', label: 'Rewards', icon: <Trophy className="h-5 w-5 mr-2" /> },
    { path: '/stats', label: 'Stats', icon: <BarChart3 className="h-5 w-5 mr-2" /> },
  ];

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const toggleAccountMenu = () => setAccountMenuOpen(!accountMenuOpen);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <Link to="/" className="font-bold text-2xl flex items-center">
                <Leaf className="h-6 w-6 text-kale-600 mr-2" />
                <span className="text-kale-600">Kale</span>
                <span className="text-foreground">Fi</span>
              </Link>
            </div>

            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center text-sm font-medium transition-colors hover:text-kale-600 ${
                    location.pathname === item.path
                      ? 'text-kale-600'
                      : 'text-muted-foreground'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Wallet connection */}
            <div className="flex items-center space-x-2">
              {wallet.address ? (
                <div className="relative">
                  <Button
                    variant="outline"
                    onClick={toggleAccountMenu}
                    className="flex items-center border-kale-200 hover:bg-kale-50"
                  >
                    <span className="mr-2">
                      {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  
                  {accountMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-background border border-border">
                      <div className="py-1">
                        <button
                          onClick={disconnectWallet}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-muted"
                        >
                          Disconnect Wallet
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Button 
                  onClick={connectWallet} 
                  className="bg-kale-600 hover:bg-kale-700 text-white"
                >
                  Connect Wallet
                </Button>
              )}
              <button
                className="p-2 md:hidden"
                onClick={toggleMobileMenu}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-30 bg-background border-t p-4">
          <nav className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center text-lg py-2 px-4 rounded-md ${
                  location.pathname === item.path
                    ? 'bg-kale-100 text-kale-700'
                    : 'text-foreground hover:bg-muted'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 container py-6 md:py-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t py-6 md:py-0 bg-kale-50 dark:bg-kale-950">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} KaleFi. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-muted-foreground">
            <Link to="/about" className="text-sm hover:text-kale-600 hover:underline">
              About
            </Link>
            <Link to="/terms" className="text-sm hover:text-kale-600 hover:underline">
              Terms
            </Link>
            <Link to="/privacy" className="text-sm hover:text-kale-600 hover:underline">
              Privacy
            </Link>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm hover:text-kale-600 hover:underline"
            >
              Twitter
            </a>
            <a 
              href="https://discord.com" 
              target="_blank"
              rel="noopener noreferrer" 
              className="text-sm hover:text-kale-600 hover:underline"
            >
              Discord
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 