'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Lock, Sparkles, AlertCircle, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { billingStore } from '@/lib/billing/billing-store';

interface PaymentMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isPlatformManaged?: boolean;
}

export function PaymentMethodDialog({
  open,
  onOpenChange,
  isPlatformManaged = false,
}: PaymentMethodDialogProps) {
  const [billingName, setBillingName] = useState('Alex Lawrence');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('123');
  const [postalCode, setPostalCode] = useState('94103');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fillValidTestCard = () => {
    setBillingName('Olivia Morgan');
    setCardNumber('4242 •••• •••• 4242');
    setExpiry('08/29');
    setCvc('789');
    setPostalCode('10001');
    toast.info('Autofilled valid Visa card');
  };

  const fillDecliningTestCard = () => {
    setBillingName('Test Declined');
    setCardNumber('4000 •••• •••• 0002');
    setExpiry('01/25');
    setCvc('000');
    setPostalCode('90210');
    toast.warning('Autofilled declining test card (simulates decline)');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      if (cardNumber.endsWith('0002')) {
        billingStore.setPaymentStatus('failed', true);
        toast.error('Card declined: Transaction could not be authorized.');
        onOpenChange(false);
        return;
      }

      billingStore.updatePaymentMethod({
        brand: 'visa',
        last4: cardNumber.replace(/\s+/g, '').slice(-4) || '4242',
        expiryMonth: 8,
        expiryYear: 2029,
        billingName,
        billingEmail: 'olivia@northstargoods.com',
      });

      toast.success('Payment method updated successfully.');
      onOpenChange(false);
    }, 700);
  };

  if (isPlatformManaged) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md bg-white p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-[#0a0a0a]">
              Manage Shopify Billing
            </DialogTitle>
            <DialogDescription className="text-xs text-[#71717a]">
              Your Reloopin usage charges are billed directly through your primary Shopify subscription and merchant payout balance.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-3 text-xs text-[#52525b]">
            <p>
              To update your card, payout preferences, or billing address, please visit the Shopify Admin Billing Settings.
            </p>
            <div className="p-3 bg-[#f8f7ff] border border-[#e5e1fc] rounded-xl text-xs text-[#5f3ed8]">
              Charges will appear as <strong>Reloopin App Usage</strong> on your unified Shopify monthly invoice.
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs border-[#ebebeb] cursor-pointer"
            >
              Close
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => {
                window.open('https://admin.shopify.com/store/northstargoods/settings/billing', '_blank');
                onOpenChange(false);
              }}
              className="text-xs bg-[#5f3ed8] hover:bg-[#5034b8] text-white gap-1.5 cursor-pointer"
            >
              <span>Open Shopify Billing</span>
              <ExternalLink className="h-3 w-3" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white p-6">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-[#5f3ed8]/10 text-[#5f3ed8] flex items-center justify-center">
              <CreditCard className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold text-[#0a0a0a]">
                Update Payment Card
              </DialogTitle>
              <DialogDescription className="text-xs text-[#71717a]">
                Add a card to be charged automatically at the end of each billing cycle.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Test card helpers */}
        <div className="flex items-center gap-2 pt-1 pb-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={fillValidTestCard}
            className="text-[11px] h-7 px-2 border-[#ebebeb] hover:bg-[#f4f4f5] text-[#0a0a0a] cursor-pointer"
          >
            <Sparkles className="h-3 w-3 mr-1 text-[#5f3ed8]" />
            Fill valid test card
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={fillDecliningTestCard}
            className="text-[11px] h-7 px-2 border-[#ebebeb] hover:bg-[#f4f4f5] text-rose-600 cursor-pointer"
          >
            <AlertCircle className="h-3 w-3 mr-1" />
            Fill declining test card
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="space-y-1">
            <Label htmlFor="billingName" className="text-xs font-medium text-[#0a0a0a]">
              Name on card
            </Label>
            <Input
              id="billingName"
              value={billingName}
              onChange={(e) => setBillingName(e.target.value)}
              required
              className="h-8 text-xs border-[#ebebeb] text-[#0a0a0a]"
              placeholder="Full Name"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="cardNumber" className="text-xs font-medium text-[#0a0a0a]">
              Card number
            </Label>
            <div className="relative">
              <Input
                id="cardNumber"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                required
                className="h-8 text-xs pl-8 font-mono border-[#ebebeb] text-[#0a0a0a]"
                placeholder="4242 •••• •••• 4242"
              />
              <CreditCard className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-zinc-400" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div className="space-y-1">
              <Label htmlFor="expiry" className="text-xs font-medium text-[#0a0a0a]">
                Expires
              </Label>
              <Input
                id="expiry"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                required
                className="h-8 text-xs font-mono border-[#ebebeb] text-[#0a0a0a]"
                placeholder="MM/YY"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="cvc" className="text-xs font-medium text-[#0a0a0a]">
                CVC
              </Label>
              <Input
                id="cvc"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                required
                className="h-8 text-xs font-mono border-[#ebebeb] text-[#0a0a0a]"
                placeholder="123"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="postal" className="text-xs font-medium text-[#0a0a0a]">
                Postal code
              </Label>
              <Input
                id="postal"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                required
                className="h-8 text-xs border-[#ebebeb] text-[#0a0a0a]"
                placeholder="94103"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center gap-1.5 text-[11px] text-[#71717a]">
            <Lock className="h-3 w-3 shrink-0 text-[#71717a]" />
            <span>Encrypted with 256-bit SSL. Card numbers are tokenized by Stripe.</span>
          </div>

          <DialogFooter className="pt-3 border-t border-[#ebebeb] gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs h-8 border-[#ebebeb] cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="text-xs h-8 bg-[#5f3ed8] hover:bg-[#5034b8] text-white cursor-pointer"
            >
              {isSubmitting ? 'Saving...' : 'Save card'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
