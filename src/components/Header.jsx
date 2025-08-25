import { useState } from 'react';
import { useApp } from '../lib/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Menu, X } from 'lucide-react';

export function Header() {
  const { state, dispatch, ACTIONS } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleUpgrade = () => {
    // Open Stripe payment link in new tab
    const paymentLink = import.meta.env.VITE_STRIPE_PAYMENT_LINK;
    if (paymentLink) {
      window.open(paymentLink, '_blank');
    } else {
      // Fallback for demo
      alert('Stripe payment link not configured. This would open the subscription page.');
    }
  };

  const handleActivatePro = () => {
    const email = prompt('Enter your email address used for the subscription:');
    if (email) {
      // This would call the activation API
      dispatch({ type: ACTIONS.SET_USER, payload: { tier: 'pro' } });
      alert('Pro features activated! (Demo mode)');
    }
  };

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">TR</span>
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white">
              TradeReferee
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex items-center space-x-4">
              <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Pricing
              </a>
              <a href="#help" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Help
              </a>
            </nav>

            {/* User Status */}
            <div className="flex items-center space-x-3">
              {state.user.tier === 'pro' ? (
                <Badge variant="default" className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                  <Crown className="w-3 h-3 mr-1" />
                  Pro
                </Badge>
              ) : (
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">Free</Badge>
                  <Button onClick={handleUpgrade} size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    Upgrade to Pro
                  </Button>
                </div>
              )}
              
              {state.user.tier === 'free' && (
                <Button onClick={handleActivatePro} variant="outline" size="sm">
                  Activate Pro
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <nav className="flex flex-col space-y-3">
              <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Pricing
              </a>
              <a href="#help" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Help
              </a>
              
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                {state.user.tier === 'pro' ? (
                  <Badge variant="default" className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                    <Crown className="w-3 h-3 mr-1" />
                    Pro
                  </Badge>
                ) : (
                  <div className="space-y-2">
                    <Button onClick={handleUpgrade} size="sm" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                      Upgrade to Pro
                    </Button>
                    <Button onClick={handleActivatePro} variant="outline" size="sm" className="w-full">
                      Activate Pro
                    </Button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

