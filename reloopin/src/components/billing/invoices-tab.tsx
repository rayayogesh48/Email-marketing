"use client";

import { Invoice, BillingPermission } from "@/lib/billing/billing-types";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export function InvoicesTab({
  invoices,
  permission,
  onViewInvoice,
}: {
  invoices: Invoice[];
  permission: BillingPermission;
  onViewInvoice: (invoice: Invoice) => void;
}) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = (inv: Invoice) => {
    setDownloadingId(inv.id);
    setTimeout(() => {
      setDownloadingId(null);
      toast.success(`Downloaded ${inv.number}.pdf`);
    }, 700);
  };

  const getStatusBadge = (status: Invoice["status"]) => {
    switch (status) {
      case "paid":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 size={11} />
            Paid
          </span>
        );
      case "open":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Clock size={11} />
            Open
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <AlertCircle size={11} />
            Failed
          </span>
        );
      case "refunded":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)]">
            Refunded
          </span>
        );
      case "voided":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)]">
            Voided
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold tracking-tight text-[var(--foreground)]">
          Invoices
        </h2>
        <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
          Review and download past subscription billing receipts and tax statements.
        </p>
      </div>

      {invoices.length === 0 ? (
        <div className="p-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[var(--muted)] text-[var(--muted-foreground)] flex items-center justify-center mx-auto">
            <FileText size={22} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-[var(--foreground)]">
              No invoices yet
            </h3>
            <p className="text-xs text-[var(--muted-foreground)] mt-1 max-w-sm mx-auto">
              Invoices will appear here after your first paid billing period.
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--muted)]/40 font-semibold text-[var(--muted-foreground)]">
                  <th className="py-3.5 px-4">Invoice</th>
                  <th className="py-3.5 px-4">Billing period</th>
                  <th className="py-3.5 px-4">Plan</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[var(--muted)]/20 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-[var(--foreground)]">
                      {inv.number}
                    </td>
                    <td className="py-3 px-4 text-[var(--muted-foreground)]">
                      {inv.billingPeriod}
                    </td>
                    <td className="py-3 px-4 font-medium text-[var(--foreground)]">
                      {inv.planName}
                    </td>
                    <td className="py-3 px-4 font-semibold text-[var(--foreground)]">
                      ${inv.amount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(inv.status)}
                    </td>
                    <td className="py-3 px-4 text-[var(--muted-foreground)]">
                      {inv.date}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewInvoice(inv)}
                          className="h-7 px-2 text-xs gap-1 cursor-pointer"
                        >
                          <Eye size={12} />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(inv)}
                          disabled={downloadingId === inv.id}
                          className="h-7 px-2 text-xs gap-1 cursor-pointer"
                        >
                          <Download size={12} />
                          {downloadingId === inv.id ? "Downloading..." : "Download"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
