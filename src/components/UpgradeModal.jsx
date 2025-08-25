import { useState } from 'react';
import { useApp } from '../lib/store';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Crown, Check } from 'lucide-react';

export function UpgradeModal() {
  const { state } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  // This would be triggered by various upgrade prompts throughout the app
  // For now, it's just a placeholder component

  const handleUpgrade = () => {
    const paymentLink = import.meta.env.VITE_STRIPE_PAYMENT_LINK;
    if (paymentLink) {
      window.open(paymentLink, '_blank');
    } else {
      alert('Stripe payment link not configured');
    }
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-500" />
            Upgrade to Pro
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">$3.99/month</div>
            <p className="text-gray-600 dark:text-gray-300">
              Unlock advanced fantasy football analysis
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Check className="w-4 h-4 text-green-500" />
              <span className="text-sm">League-wide Monte Carlo simulations</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-4 h-4 text-green-500" />
              <span className="text-sm">AI-powered counter-offer suggestions</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-4 h-4 text-green-500" />
              <span className="text-sm">Real-time injury analysis</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-4 h-4 text-green-500" />
              <span className="text-sm">Commissioner collusion detection</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-4 h-4 text-green-500" />
              <span className="text-sm">Auto-generated trade summaries</span>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
              Maybe Later
            </Button>
            <Button onClick={handleUpgrade} className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white">
              <Crown className="w-4 h-4 mr-2" />
              Upgrade Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

