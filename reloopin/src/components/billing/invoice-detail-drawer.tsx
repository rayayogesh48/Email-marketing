"use client";

import { Invoice } from "@/lib/billing/billing-types";
import { Modal } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, FileText, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export function InvoiceDetailDrawer({
  open,
  onClose,
  invoice,
}: {
  open: boolean;
  onClose: () => void;
  invoice: Invoice | null;
}) {
  const [isDownloading, setIsDownloading] = useState(false);

  if (!invoice) return null;

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      toast.success(`Downloaded ${invoice.number}.pdf`);
    }, 800);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      side={true}
      title={invoice.number}
      description={`Issued on ${invoice.date} for ${invoice.merchantName}`}
    >
      <div className="space-y-6 pt-4 text-xs">
        {/* Status card */}
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] flex items-center justify-between">
          <div>
            <span className="text-[11px] text-[var(--muted-foreground)] block">
              Payment status
            </span>
            <div className="flex items-center gap-1.5 mt-0.5 font-semibold text-[var(--foreground)] capitalize">
              {invoice.status === "paid" && (
                <CheckCircle2 size={14} className="text-emerald-600" />
              )}
              {invoice.status === "open" && <Clock size={14} className="text-blue-600" />}
              {invoice.status === "failed" && (
                <AlertCircle size={14} className="text-rose-600" />
              )}
              <span>{invoice.status}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-[var(--muted-foreground)] block">Amount paid</span>
            <span className="text-base font-bold text-[var(--foreground)]">
              ${invoice.amount.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Invoice breakdown */}
        <div className="space-y-3">
          <h4 className="font-semibold text-[var(--foreground)]">Invoice details</h4>
          <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--muted)]/30 space-y-2.5">
            <div className="flex justify-between">
              <span className="text-[var(--muted-foreground)]">Merchant name</span>
              <span className="font-medium text-[var(--foreground)]">{invoice.merchantName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted-foreground)]">Billing email</span>
              <span className="font-medium text-[var(--foreground)]">{invoice.billingEmail}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted-foreground)]">Billing period</span>
              <span className="font-medium text-[var(--foreground)]">{invoice.billingPeriod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted-foreground)]">Subscription plan</span>
              <span className="font-medium text-[var(--foreground)]">{invoice.planName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted-foreground)]">Payment method</span>
              <span className="font-medium text-[var(--foreground)]">{invoice.paymentMethodSummary}</span>
            </div>
          </div>
        </div>

        {/* Line items & totals */}
        <div className="space-y-3">
          <h4 className="font-semibold text-[var(--foreground)]">Items</h4>
          <div className="border border-[var(--border)] rounded-xl overflow-hidden divide-y divide-[var(--border)]">
            {invoice.items.map((item, index) => (
              <div key={index} className="p-3 flex justify-between items-center bg-[var(--card)]">
                <span className="text-[var(--foreground)]">{item.description}</span>
                <span className="font-medium text-[var(--foreground)]">
                  ${item.amount.toFixed(2)}
                </span>
              </div>
            ))}
            <div className="p-3 bg-[var(--muted)]/40 space-y-1.5">
              <div className="flex justify-between text-[var(--muted-foreground)]">
                <span>Subtotal</span>
                <span>${invoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[var(--muted-foreground)]">
                <span>Tax</span>
                <span>${invoice.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-[var(--foreground)] pt-1 border-t border-[var(--border)]">
                <span>Total</span>
                <span>${invoice.amount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-[var(--border)]">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleDownload}
            disabled={isDownloading}
            className="gap-1.5 font-medium cursor-pointer"
          >
            <Download size={13} />
            {isDownloading ? "Downloading..." : "Download invoice"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
