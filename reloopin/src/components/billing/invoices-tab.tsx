'use client';

import React, { useState } from 'react';
import {
  Download,
  Eye,
  Receipt,
  CheckCircle2,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { Invoice, BillingPermission } from '@/lib/billing/billing-types';
import { toast } from 'sonner';

interface InvoicesTabProps {
  invoices: Invoice[];
  permission: BillingPermission;
  onViewInvoice: (invoice: Invoice) => void;
}

export function InvoicesTab({
  invoices,
  permission,
  onViewInvoice,
}: InvoicesTabProps) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const canDownload = permission === 'owner' || permission === 'billing_admin';

  const handleDownload = (invoice: Invoice) => {
    if (!canDownload) {
      toast.error('Only the account owner or billing admin can download invoices.');
      return;
    }

    setDownloadingId(invoice.id);
    setTimeout(() => {
      // Mock CSV generation
      const content = `Invoice Number,${invoice.invoiceNumber}\nBilling Period,${invoice.periodName}\nMerchant,${invoice.merchantName}\nCounted Orders,${invoice.countedOrders}\nRate Per Order,$${invoice.ratePerOrder.toFixed(2)}\nTotal Amount,$${invoice.amount.toFixed(2)}\nStatus,${invoice.status.toUpperCase()}\nDate,${invoice.date}\nPayment Method,${invoice.billingMethod}\n`;
      const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${invoice.invoiceNumber}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDownloadingId(null);
      toast.success(`Downloaded ${invoice.invoiceNumber}.`);
    }, 600);
  };

  if (invoices.length === 0) {
    return (
      <div className="bg-white border border-[#ebebeb] rounded-2xl p-12 text-center shadow-xs max-w-lg mx-auto space-y-3">
        <div className="size-12 rounded-2xl bg-zinc-100 text-[#71717a] flex items-center justify-center mx-auto">
          <Receipt className="size-6" />
        </div>
        <h3 className="text-[17px] font-bold text-[#0a0a0a]">
          No invoices yet
        </h3>
        <p className="text-[13px] text-[#71717a] leading-relaxed">
          Invoices will appear after a monthly billing period closes and order usage is finalized.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#ebebeb] rounded-2xl overflow-hidden shadow-xs space-y-0">
      <div className="p-5 border-b border-[#ebebeb] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-[16px] font-bold text-[#0a0a0a]">
            Invoice history
          </h3>
          <p className="text-[12px] text-[#71717a] mt-0.5">
            Download past usage invoices and tax receipts.
          </p>
        </div>
        {!canDownload && (
          <span className="text-[12px] text-[#71717a] bg-zinc-100 px-2.5 py-1 rounded-lg">
            Staff view: downloads restricted
          </span>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-[13px]">
          <thead>
            <tr className="bg-[#f7f7f8] border-b border-[#ebebeb] text-[11px] font-bold uppercase tracking-wider text-[#71717a] h-[40px]">
              <th className="px-5 py-2">Invoice</th>
              <th className="px-5 py-2">Billing period</th>
              <th className="px-5 py-2 w-32">Counted orders</th>
              <th className="px-5 py-2 w-28">Rate</th>
              <th className="px-5 py-2 w-32 text-right">Amount</th>
              <th className="px-5 py-2">Status</th>
              <th className="px-5 py-2">Issued date</th>
              <th className="px-5 py-2 text-right w-36">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ebebeb]">
            {invoices.map((inv) => {
              const isPaid = inv.status === 'paid';
              const isFailed = inv.status === 'failed';
              const isFree = inv.isFreeMonth || inv.amount === 0;

              return (
                <tr
                  key={inv.id}
                  className="hover:bg-zinc-50 transition-colors"
                >
                  {/* Invoice # */}
                  <td className="px-5 py-3.5 font-semibold text-[#0a0a0a] font-mono">
                    {inv.invoiceNumber}
                  </td>

                  {/* Period */}
                  <td className="px-5 py-3.5 text-[#0a0a0a] font-medium">
                    {inv.periodName}
                  </td>

                  {/* Counted Orders */}
                  <td className="px-5 py-3.5 text-[#71717a]">
                    {inv.countedOrders} orders
                  </td>

                  {/* Rate */}
                  <td className="px-5 py-3.5 font-mono text-[12px] text-[#71717a]">
                    ${inv.ratePerOrder.toFixed(2)}
                  </td>

                  {/* Amount */}
                  <td className="px-5 py-3.5 text-right font-mono font-bold text-[#0a0a0a]">
                    {isFree ? (
                      <span className="text-emerald-600 font-sans font-medium text-[12px]">
                        No charge ($0.00)
                      </span>
                    ) : (
                      `$${inv.amount.toFixed(2)}`
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-5 py-3.5">
                    {isPaid ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="size-3" />
                        {isFree ? 'Free tier' : 'Paid'}
                      </span>
                    ) : isFailed ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                        <AlertCircle className="size-3" />
                        Failed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="size-3" />
                        {inv.status}
                      </span>
                    )}
                  </td>

                  {/* Date */}
                  <td className="px-5 py-3.5 text-[#71717a] text-[12px] whitespace-nowrap">
                    {inv.date}
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-3.5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onViewInvoice(inv)}
                        className="inline-flex items-center gap-1 h-[30px] px-2.5 rounded-lg border border-[#ebebeb] bg-white hover:bg-zinc-50 text-[12px] font-medium text-[#0a0a0a] transition-colors cursor-pointer"
                      >
                        <Eye className="size-3.5 text-[#71717a]" />
                        <span>View</span>
                      </button>

                      <button
                        type="button"
                        disabled={!canDownload || downloadingId === inv.id}
                        onClick={() => handleDownload(inv)}
                        className="inline-flex items-center gap-1 h-[30px] px-2.5 rounded-lg border border-[#ebebeb] bg-white hover:bg-zinc-50 text-[12px] font-medium text-[#71717a] hover:text-[#0a0a0a] disabled:opacity-40 transition-colors cursor-pointer"
                        title={canDownload ? 'Download invoice' : 'Restricted for staff'}
                      >
                        <Download className="size-3.5" />
                        <span>{downloadingId === inv.id ? 'Saving...' : 'PDF'}</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
