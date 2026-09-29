"use client";

import React, { useState } from "react";
import { X, MinusCircle, AlertTriangle } from "lucide-react";
import { useCustomerStore } from "@/lib/customers/customer-store";
import { toast } from "sonner";

export function DeductPointsDialog() {
  const {
    deductPointsModalOpen,
    closeDeductPointsModal,
    adjustPointsCustomerId,
    customers,
    deductPoints,
  } = useCustomerStore();

  const [points, setPoints] = useState<number>(100);
  const [reason, setReason] = useState("Customer support correction");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!deductPointsModalOpen || !adjustPointsCustomerId) return null;

  const customer = customers.find((c) => c.id === adjustPointsCustomerId);
  if (!customer) return null;

  const currentBal = customer.pointBalance;
  const newBal = Math.max(0, currentBal - points);
  const willOverdraw = points > currentBal;

  const reasons = [
    "Customer support correction",
    "Order cancellation / refund",
    "Points expired",
    "Fraud / misuse correction",
    "Other",
  ];

  const handleDeduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (points <= 0) {
      toast.error("Please enter a point deduction greater than 0.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      deductPoints(customer.id, points, reason, note.trim() || undefined);
      setIsSubmitting(false);
      toast.success(`Deducted ${points.toLocaleString()} points from ${customer.name}.`);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity animate-in fade-in"
        onClick={closeDeductPointsModal}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-[480px] bg-white border border-[#ebebeb] rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-150 text-[#0a0a0a]">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#ebebeb]">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
              <MinusCircle className="size-5" />
            </div>
            <div>
              <h3 className="text-[17px] font-bold text-[#0a0a0a]">
                Deduct points
              </h3>
              <p className="text-[13px] text-[#71717a]">
                Decrease points balance for {customer.name}
              </p>
            </div>
          </div>
          <button
            onClick={closeDeductPointsModal}
            className="size-8 rounded-lg flex items-center justify-center text-[#71717a] hover:text-[#0a0a0a] hover:bg-zinc-100 transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleDeduct} className="py-4 space-y-4">
          {/* Balance Preview Card */}
          <div className="flex items-center justify-between p-3.5 bg-red-50/50 border border-red-200/60 rounded-xl text-[13px]">
            <div>
              <span className="text-[#71717a] block text-[11px] uppercase font-bold">
                Current balance
              </span>
              <span className="font-bold text-[16px] text-[#0a0a0a]">
                {currentBal.toLocaleString()} pts
              </span>
            </div>
            <div className="text-right">
              <span className="text-[#71717a] block text-[11px] uppercase font-bold">
                New balance
              </span>
              <span className="font-bold text-[16px] text-red-600">
                {newBal.toLocaleString()} pts
              </span>
            </div>
          </div>

          {/* Points Input */}
          <div>
            <label className="block text-[13px] font-semibold text-[#0a0a0a] mb-1">
              Points to deduct <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              value={points || ""}
              onChange={(e) => setPoints(Math.max(1, parseInt(e.target.value) || 0))}
              className="w-full h-[40px] px-3 bg-white border border-[#ebebeb] rounded-xl text-[14px] text-[#0a0a0a] outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
              placeholder="e.g. 150"
            />
            {willOverdraw && (
              <div className="flex items-center gap-1.5 text-[12px] text-amber-600 mt-1.5">
                <AlertTriangle className="size-3.5 shrink-0" />
                <span>
                  Deduction exceeds balance. Customer balance will become 0 pts.
                </span>
              </div>
            )}
          </div>

          {/* Reason */}
          <div>
            <label className="block text-[13px] font-semibold text-[#0a0a0a] mb-1">
              Reason <span className="text-red-500">*</span>
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full h-[40px] px-3 bg-white border border-[#ebebeb] rounded-xl text-[14px] text-[#0a0a0a] outline-none focus:border-[#5f3ed8]"
            >
              {reasons.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Note */}
          <div>
            <label className="block text-[13px] font-semibold text-[#0a0a0a] mb-1">
              Internal note (optional)
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add explanation for team reference..."
              className="w-full p-2.5 bg-white border border-[#ebebeb] rounded-xl text-[13px] text-[#0a0a0a] outline-none focus:border-red-500 resize-none"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#ebebeb]">
            <button
              type="button"
              onClick={closeDeductPointsModal}
              className="h-[38px] px-4 rounded-xl text-[14px] font-medium text-[#71717a] hover:text-[#0a0a0a] hover:bg-zinc-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || points <= 0}
              className="h-[38px] px-5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl text-[14px] font-semibold shadow-xs transition-all"
            >
              {isSubmitting ? "Deducting..." : "Deduct points"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
