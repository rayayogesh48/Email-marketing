"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  User,
  Mail,
  Phone,
  Calendar,
  ArrowUpRight,
  ArrowDownLeft,
  ShoppingBag,
  PlusCircle,
  MinusCircle,
  Sparkles,
} from "lucide-react";
import { useCustomerStore } from "@/lib/customers/customer-store";
import { CustomerTierBadge, CustomerStatusBadge } from "./customer-badges";
import { Customer } from "@/lib/customers/customer-types";

export function CustomerProfileView({
  customer,
  isFullPage = false,
}: {
  customer: Customer;
  isFullPage?: boolean;
}) {
  const {
    openAccountDetailsSheet,
    openActivityDetailsSheet,
    openRewardPointsModal,
    openDeductPointsModal,
  } = useCustomerStore();

  const [activeTab, setActiveTab] = useState<"ledger" | "orders">("ledger");

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarGradient = (tier: string) => {
    if (tier === "platinum") return "from-blue-500 to-indigo-600 text-white";
    if (tier === "gold") return "from-amber-400 to-orange-500 text-white";
    return "from-slate-400 to-zinc-600 text-white";
  };

  const getTierProgress = (tier: string, points: number) => {
    if (tier === "platinum") {
      return { nextTier: "Top VIP Tier", target: 5000, progress: 100, remaining: 0 };
    }
    if (tier === "gold") {
      const target = 5000;
      const progress = Math.min(100, Math.round((points / target) * 100));
      return { nextTier: "Platinum", target, progress, remaining: Math.max(0, target - points) };
    }
    const target = 2500;
    const progress = Math.min(100, Math.round((points / target) * 100));
    return { nextTier: "Gold", target, progress, remaining: Math.max(0, target - points) };
  };

  const tierProgress = getTierProgress(customer.vipTier, customer.pointBalance);

  return (
    <div className={`w-full ${isFullPage ? "max-w-[1200px] mx-auto p-6" : "p-6"} space-y-6 text-[#0a0a0a]`}>
      {/* Back button if full page */}
      {isFullPage && (
        <div className="flex items-center gap-2 mb-2">
          <Link
            href="/customers"
            className="flex items-center gap-1.5 text-[14px] text-[#71717a] hover:text-[#0a0a0a] font-medium transition-colors"
          >
            <ChevronLeft className="size-4" />
            <span>Back to customers</span>
          </Link>
        </div>
      )}

      {/* Customer Header Identity Card (Figma 2062:24758) */}
      <div className="bg-white border border-[#ebebeb] rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className={`size-16 rounded-2xl flex items-center justify-center font-bold text-xl shadow-xs bg-gradient-to-br shrink-0 ${getAvatarGradient(
                customer.vipTier
              )}`}
            >
              {getInitials(customer.name)}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-[22px] font-bold text-[#0a0a0a]">
                  {customer.name}
                </h1>
                <CustomerTierBadge tier={customer.vipTier} />
                <CustomerStatusBadge status={customer.status} />
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-[#71717a] mt-1.5">
                <span className="flex items-center gap-1">
                  <Mail className="size-3.5 text-[#a1a1aa]" />
                  {customer.email}
                </span>
                {customer.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="size-3.5 text-[#a1a1aa]" />
                    {customer.phone}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="size-3.5 text-[#a1a1aa]" />
                  Member since {customer.joinedDate}
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={openAccountDetailsSheet}
              className="flex items-center gap-1.5 h-[36px] px-3.5 bg-white border border-[#ebebeb] hover:bg-zinc-50 text-[#0a0a0a] rounded-xl text-[13px] font-medium shadow-xs transition-colors"
            >
              <User className="size-4 text-[#71717a]" />
              <span>View account details</span>
            </button>

            <button
              onClick={() => openRewardPointsModal(customer.id)}
              className="flex items-center gap-1.5 h-[36px] px-3.5 bg-[#5f3ed8] hover:bg-[#5234c2] text-white rounded-xl text-[13px] font-semibold shadow-xs transition-all"
            >
              <PlusCircle className="size-4" />
              <span>Reward points</span>
            </button>

            <button
              onClick={() => openDeductPointsModal(customer.id)}
              className="flex items-center gap-1.5 h-[36px] px-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-[13px] font-medium border border-red-200 transition-colors"
              title="Deduct points"
            >
              <MinusCircle className="size-4" />
              <span>Deduct</span>
            </button>
          </div>
        </div>

        {/* VIP Progression Milestone Tracker */}
        <div className="mt-6 pt-5 border-t border-[#ebebeb]">
          <div className="flex items-center justify-between text-[13px] mb-2">
            <div className="flex items-center gap-1.5 font-semibold text-[#0a0a0a]">
              <Sparkles className="size-4 text-[#ea580c]" />
              <span>VIP Tier Progress: {customer.vipTier.toUpperCase()}</span>
            </div>
            <span className="text-[12px] text-[#71717a]">
              {tierProgress.remaining > 0
                ? `${tierProgress.remaining.toLocaleString()} pts to reach ${tierProgress.nextTier}`
                : "Top VIP tier achieved"}
            </span>
          </div>

          <div className="w-full h-2.5 bg-zinc-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#5f3ed8] to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${tierProgress.progress}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[11px] text-[#71717a] mt-1.5">
            <span>Current: {customer.pointBalance.toLocaleString()} pts</span>
            <span>Target: {tierProgress.target.toLocaleString()} pts</span>
          </div>
        </div>
      </div>

      {/* 5 Metrics Cards Grid as specified by Figma node 2062:24758 */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {/* Point balance */}
        <div className="bg-white p-4 rounded-xl border border-[#ebebeb] shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#71717a] block">
            Point balance
          </span>
          <span className="text-[20px] font-bold text-[#0a0a0a] mt-1 block">
            {customer.pointBalance.toLocaleString()}
          </span>
          <span className="text-[11px] font-medium text-[#5f3ed8]">
            Available pts
          </span>
        </div>

        {/* Lifetime value */}
        <div className="bg-white p-4 rounded-xl border border-[#ebebeb] shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#71717a] block">
            Lifetime value
          </span>
          <span className="text-[20px] font-bold text-[#0a0a0a] mt-1 block">
            ${customer.lifetimeValue.toLocaleString()}
          </span>
          <span className="text-[11px] font-medium text-emerald-600">
            Total spend
          </span>
        </div>

        {/* Lifetime points earned */}
        <div className="bg-white p-4 rounded-xl border border-[#ebebeb] shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#71717a] block">
            Lifetime earned
          </span>
          <span className="text-[20px] font-bold text-[#0a0a0a] mt-1 block">
            {customer.lifetimePoints.toLocaleString()}
          </span>
          <span className="text-[11px] font-medium text-zinc-500">
            Historical points
          </span>
        </div>

        {/* Points redeemed */}
        <div className="bg-white p-4 rounded-xl border border-[#ebebeb] shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#71717a] block">
            Points redeemed
          </span>
          <span className="text-[20px] font-bold text-[#0a0a0a] mt-1 block">
            {customer.pointsRedeemed.toLocaleString()}
          </span>
          <span className="text-[11px] font-medium text-amber-600">
            Used on rewards
          </span>
        </div>

        {/* Rewards redeemed */}
        <div className="bg-white p-4 rounded-xl border border-[#ebebeb] shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#71717a] block">
            Rewards redeemed
          </span>
          <span className="text-[20px] font-bold text-[#0a0a0a] mt-1 block">
            {customer.rewardsRedeemedCount}
          </span>
          <span className="text-[11px] font-medium text-purple-600">
            Discounts claimed
          </span>
        </div>
      </div>

      {/* Tabs: Points Ledger & Orders */}
      <div className="bg-white border border-[#ebebeb] rounded-2xl overflow-hidden shadow-xs">
        <div className="flex border-b border-[#ebebeb] px-6 pt-4">
          <button
            onClick={() => setActiveTab("ledger")}
            className={`pb-3 text-[14px] font-semibold border-b-2 transition-colors mr-6 ${
              activeTab === "ledger"
                ? "border-[#5f3ed8] text-[#5f3ed8]"
                : "border-transparent text-[#71717a] hover:text-[#0a0a0a]"
            }`}
          >
            Point activity ledger ({customer.transactions.length})
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-3 text-[14px] font-semibold border-b-2 transition-colors ${
              activeTab === "orders"
                ? "border-[#5f3ed8] text-[#5f3ed8]"
                : "border-transparent text-[#71717a] hover:text-[#0a0a0a]"
            }`}
          >
            Store orders ({customer.orders.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "ledger" ? (
            <div className="space-y-3">
              <p className="text-[12px] text-[#71717a] mb-2">
                Click any activity row to view complete transaction receipt & audit details.
              </p>
              {customer.transactions.length === 0 ? (
                <div className="text-center py-10 text-[#71717a] text-[13px]">
                  No point transactions on record.
                </div>
              ) : (
                customer.transactions.map((tx) => {
                  const isPositive = tx.points > 0;
                  return (
                    <div
                      key={tx.id}
                      onClick={() => openActivityDetailsSheet(tx)}
                      className="group p-3.5 bg-[#f7f7f8] hover:bg-zinc-100/80 rounded-xl border border-[#ebebeb] flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`size-8 rounded-lg flex items-center justify-center shrink-0 ${
                            isPositive
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {isPositive ? (
                            <ArrowUpRight className="size-4" />
                          ) : (
                            <ArrowDownLeft className="size-4" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[14px] font-semibold text-[#0a0a0a] group-hover:text-[#5f3ed8] transition-colors">
                              {tx.reason}
                            </span>
                            {tx.orderNumber && (
                              <span className="text-[11px] font-mono bg-white px-1.5 py-0.5 rounded border border-[#ebebeb] text-[#5b5a5a]">
                                {tx.orderNumber}
                              </span>
                            )}
                          </div>
                          <div className="text-[12px] text-[#71717a] mt-0.5">
                            {tx.date} • Logged by {tx.performedBy || "System"}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-right">
                        <div>
                          <span
                            className={`text-[15px] font-bold ${
                              isPositive
                                ? "text-emerald-600"
                                : "text-amber-600"
                            }`}
                          >
                            {isPositive ? `+${tx.points}` : tx.points} pts
                          </span>
                          <span className="text-[10px] text-[#71717a] uppercase font-bold block">
                            {tx.type}
                          </span>
                        </div>
                        <ChevronRight className="size-4 text-[#a1a1aa] group-hover:text-[#5f3ed8] group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {customer.orders.length === 0 ? (
                <div className="text-center py-10 text-[#71717a] text-[13px]">
                  No orders recorded for this customer.
                </div>
              ) : (
                customer.orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-3.5 bg-[#f7f7f8] rounded-xl border border-[#ebebeb] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-lg bg-zinc-200/70 flex items-center justify-center text-[#0a0a0a] shrink-0">
                        <ShoppingBag className="size-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[14px] font-bold text-[#0a0a0a] font-mono">
                            {ord.orderNumber}
                          </span>
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                            {ord.status}
                          </span>
                        </div>
                        <div className="text-[12px] text-[#71717a] mt-0.5">
                          {ord.date} • {ord.itemsCount} items
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[14px] font-bold text-[#0a0a0a]">
                        ${ord.total.toFixed(2)}
                      </div>
                      <div className="text-[12px] text-[#5f3ed8] font-medium">
                        +{ord.pointsEarned} pts earned
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
