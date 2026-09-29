"use client";

import React, { useState } from "react";
import { X, Sparkles, Coins, Gift } from "lucide-react";
import { useCustomerStore } from "@/lib/customers/customer-store";
import { toast } from "sonner";

export function RewardPointsDialog() {
  const {
    rewardPointsModalOpen,
    closeRewardPointsModal,
    adjustPointsCustomerId,
    customers,
    rewardPoints,
  } = useCustomerStore();

  const [points, setPoints] = useState<number>(250);
  const [reason, setReason] = useState("Customer support courtesy");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!rewardPointsModalOpen || !adjustPointsCustomerId) return null;

  const customer = customers.find((c) => c.id === adjustPointsCustomerId);
  if (!customer) return null;

  const currentBal = customer.pointBalance;
  const newBal = currentBal + points;

  const reasons = [
    "Customer support courtesy",
    "Promotional bonus",
    "Birthday celebration",
    "Referral reward",
    "Review submission bonus",
    "Goodwill gesture",
    "Other",
  ];

  const presets = [50, 100, 250, 500, 1000];

  const handleReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (points <= 0) {
      toast.error("Please enter a point reward greater than 0.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      rewardPoints(customer.id, points, reason, note.trim() || undefined);
      setIsSubmitting(false);
      toast.success(`Awarded ${points.toLocaleString()} points to ${customer.name}.`);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity animate-in fade-in"
        onClick={closeRewardPointsModal}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-[480px] bg-white border border-[#ebebeb] rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#ebebeb]">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-[#5f3ed8]/10 text-[#5f3ed8] flex items-center justify-center">
              <Gift className="size-5" />
            </div>
            <div>
              <h3 className="text-[17px] font-bold text-[#0a0a0a]">
                Reward points
              </h3>
              <p className="text-[13px] text-[#71717a]">
                Grant loyalty points to {customer.name}
              </p>
            </div>
          </div>
          <button
            onClick={closeRewardPointsModal}
            className="size-8 rounded-lg flex items-center justify-center text-[#71717a] hover:text-[#0a0a0a] hover:bg-zinc-100 transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleReward} className="py-4 space-y-4">
          {/* Balance Preview Card */}
          <div className="flex items-center justify-between p-3.5 bg-purple-50/60 border border-purple-200/60 rounded-xl text-[13px]">
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
              <span className="font-bold text-[16px] text-emerald-600">
                {newBal.toLocaleString()} pts
              </span>
            </div>
          </div>

          {/* Points Input & Quick Presets */}
          <div>
            <label className="block text-[13px] font-semibold text-[#0a0a0a] mb-1">
              Points to reward <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              value={points || ""}
              onChange={(e) => setPoints(Math.max(1, parseInt(e.target.value) || 0))}
              className="w-full h-[40px] px-3 bg-white border border-[#ebebeb] rounded-xl text-[14px] text-[#0a0a0a] outline-none focus:border-[#5f3ed8] focus:ring-2 focus:ring-[#5f3ed8]/10"
              placeholder="e.g. 250"
            />

            <div className="flex flex-wrap gap-1.5 mt-2">
              {presets.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPoints(p)}
                  className={`text-[12px] px-2.5 py-1 rounded-lg border transition-colors ${
                    points === p
                      ? "bg-[#5f3ed8]/10 text-[#5f3ed8] border-[#5f3ed8]/40 font-bold"
                      : "bg-zinc-50 text-[#71717a] border-[#ebebeb] hover:bg-zinc-100"
                  }`}
                >
                  +{p}
                </button>
              ))}
            </div>
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
              placeholder="Optional staff note for transaction ledger..."
              className="w-full p-2.5 bg-white border border-[#ebebeb] rounded-xl text-[13px] text-[#0a0a0a] outline-none focus:border-[#5f3ed8] resize-none"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#ebebeb]">
            <button
              type="button"
              onClick={closeRewardPointsModal}
              className="h-[38px] px-4 rounded-xl text-[14px] font-medium text-[#71717a] hover:text-[#0a0a0a] hover:bg-zinc-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || points <= 0}
              className="h-[38px] px-5 bg-[#5f3ed8] hover:bg-[#5234c2] disabled:opacity-50 text-white rounded-xl text-[14px] font-semibold shadow-sm transition-all"
            >
              {isSubmitting ? "Awarding..." : "Reward points"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
