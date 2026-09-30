'use client';

import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Invoice } from '@/lib/billing/billing-types';
import { Download, CheckCircle2, Clock, AlertCircle, FileText, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface InvoiceDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  invoice: Invoice | null;
}

export function InvoiceDetailDrawer({
  open,
  onClose,
  invoice,
}: InvoiceDetailDrawerProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  if (!invoice) return null;

  const isFree = invoice.isFreeMonth || invoice.amount === 0;

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      toast.success(`Downloaded ${invoice.invoiceNumber}.pdf`);
    }, 700);
  };

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent className="sm:max-w-lg w-full overflow-y-auto bg-white p-6">
        <SheetHeader className="text-left pb-4 border-b border-[#ebebeb]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-[#5f3ed8]/10 text-[#5f3ed8] flex items-center justify-center">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <SheetTitle className="text-lg font-semibold text-[#0a0a0a]">
                  {invoice.invoiceNumber}
                </SheetTitle>
                <SheetDescription className="text-xs text-[#71717a]">
                  Issued on {invoice.date}
                </SheetDescription>
              </div>
            </div>

            {invoice.status === 'paid' && (
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 font-medium">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Paid
              </Badge>
            )}
            {invoice.status === 'open' && (
              <Badge className="bg-blue-50 text-blue-700 border-blue-200 font-medium">
                <Clock className="h-3 w-3 mr-1" />
                Open
              </Badge>
            )}
            {invoice.status === 'failed' && (
              <Badge className="bg-rose-50 text-rose-700 border-rose-200 font-medium">
                <AlertCircle className="h-3 w-3 mr-1" />
                Payment failed
              </Badge>
            )}
            {isFree && invoice.status !== 'paid' && invoice.status !== 'failed' && (
              <Badge variant="outline" className="bg-zinc-50 text-zinc-600 border-zinc-200 font-medium">
                <Sparkles className="h-3 w-3 mr-1 text-[#5f3ed8]" />
                Free (Under 50)
              </Badge>
            )}
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6 text-sm text-[#0a0a0a]">
          {/* Total card */}
          <div className="p-4 rounded-xl border border-[#ebebeb] bg-[#fafafa] flex items-center justify-between">
            <div>
              <span className="text-[11px] text-[#71717a] block font-medium">
                Total Billed
              </span>
              <span className="text-xl font-bold text-[#0a0a0a]">
                ${invoice.amount.toFixed(2)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-[#71717a] block font-medium">
                Counted Store Orders
              </span>
              <span className="text-base font-semibold text-[#0a0a0a]">
                {invoice.countedOrders} {invoice.countedOrders === 1 ? 'order' : 'orders'}
              </span>
            </div>
          </div>

          {/* Pricing Formula Callout */}
          <div className="p-3.5 rounded-xl bg-[#f8f7ff] border border-[#e5e1fc] text-xs">
            <span className="font-semibold text-[#5f3ed8] block mb-1">
              Pricing formula breakdown
            </span>
            {isFree ? (
              <p className="text-[#52525b] leading-relaxed">
                {invoice.countedOrders} counted orders ≤ 50 free threshold. This cycle qualified for 100% free usage ($0.00).
              </p>
            ) : (
              <p className="text-[#52525b] leading-relaxed">
                {invoice.countedOrders} counted orders × ${invoice.ratePerOrder.toFixed(2)} per order = ${invoice.amount.toFixed(2)}. Standard usage pricing applied once exceeding the 50 order threshold.
              </p>
            )}
          </div>

          {/* Merchant & Period details */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#71717a]">
              Invoice Details
            </h4>
            <div className="p-4 rounded-xl border border-[#ebebeb] bg-white space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-[#71717a]">Merchant</span>
                <span className="font-medium text-[#0a0a0a]">{invoice.merchantName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#71717a]">Billing Email</span>
                <span className="font-medium text-[#0a0a0a]">{invoice.billingEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#71717a]">Billing Period</span>
                <span className="font-medium text-[#0a0a0a]">{invoice.periodName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#71717a]">Payment Method</span>
                <span className="font-medium text-[#0a0a0a]">{invoice.billingMethod}</span>
              </div>
            </div>
          </div>

          {/* Line items & totals */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#71717a]">
              Line Items
            </h4>
            <div className="border border-[#ebebeb] rounded-xl overflow-hidden divide-y divide-[#ebebeb] text-xs">
              <div className="p-3.5 flex justify-between items-center bg-white">
                <div>
                  <span className="font-medium text-[#0a0a0a] block">
                    {isFree ? 'Monthly Order Allowance (Under 50 Free)' : 'Counted Store Orders (Usage fee)'}
                  </span>
                  <span className="text-[11px] text-[#71717a]">
                    {invoice.countedOrders} orders × ${invoice.ratePerOrder.toFixed(2)}
                  </span>
                </div>
                <span className="font-semibold text-[#0a0a0a]">
                  ${invoice.amount.toFixed(2)}
                </span>
              </div>
              <div className="p-3.5 bg-[#fafafa] space-y-1.5 text-xs">
                <div className="flex justify-between text-[#71717a]">
                  <span>Subtotal</span>
                  <span>${invoice.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#71717a]">
                  <span>Tax (0%)</span>
                  <span>${invoice.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-[#0a0a0a] pt-2 border-t border-[#ebebeb]">
                  <span>Total</span>
                  <span>${invoice.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#ebebeb]">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="h-8 text-xs border-[#ebebeb] cursor-pointer"
            >
              Close
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleDownload}
              disabled={isDownloading}
              className="h-8 text-xs bg-[#5f3ed8] hover:bg-[#5034b8] text-white gap-1.5 font-medium cursor-pointer"
            >
              <Download size={13} />
              {isDownloading ? 'Generating PDF...' : 'Download invoice PDF'}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
