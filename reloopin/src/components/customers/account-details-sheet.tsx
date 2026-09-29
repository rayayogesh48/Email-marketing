"use client";

import React from "react";
import { X, MapPin } from "lucide-react";
import { useCustomerStore } from "@/lib/customers/customer-store";
import { CustomerStatusBadge, CustomerTierBadge } from "./customer-badges";

export function AccountDetailsSheet() {
  const {
    accountDetailsSheetOpen,
    closeAccountDetailsSheet,
    selectedCustomerId,
    customers,
  } = useCustomerStore();

  if (!accountDetailsSheetOpen || !selectedCustomerId) return null;

  const customer = customers.find((c) => c.id === selectedCustomerId);
  if (!customer) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity animate-in fade-in"
        onClick={closeAccountDetailsSheet}
      />

      {/* Sheet */}
      <div className="relative z-10 w-full max-w-[500px] bg-white border-l border-[#ebebeb] shadow-2xl h-full flex flex-col animate-in slide-in-from-right duration-200 text-[#0a0a0a]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#ebebeb]">
          <div>
            <h3 className="text-[16px] font-bold text-[#0a0a0a]">
              Account details
            </h3>
            <p className="text-[12px] text-[#71717a] mt-0.5">
              Profile metadata and synchronized address data
            </p>
          </div>
          <button
            onClick={closeAccountDetailsSheet}
            className="size-8 rounded-lg flex items-center justify-center text-[#71717a] hover:text-[#0a0a0a] hover:bg-zinc-100 transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Identity overview */}
          <div className="flex items-center justify-between p-4 bg-[#f7f7f8] rounded-xl border border-[#ebebeb]">
            <div>
              <span className="text-[15px] font-bold text-[#0a0a0a] block">
                {customer.name}
              </span>
              <span className="text-[13px] text-[#71717a]">{customer.email}</span>
            </div>
            <div className="flex flex-col items-end gap-1">
              <CustomerTierBadge tier={customer.vipTier} />
              <CustomerStatusBadge status={customer.status} />
            </div>
          </div>

          {/* Primary Metadata Table */}
          <div className="space-y-3">
            <h4 className="text-[12px] font-bold uppercase tracking-wider text-[#71717a]">
              Customer information
            </h4>
            <div className="divide-y divide-zinc-200/70 bg-white border border-[#ebebeb] rounded-xl px-4 text-[13px]">
              <div className="py-2.5 flex justify-between">
                <span className="text-[#71717a]">Reloopin ID</span>
                <span className="font-mono text-[#0a0a0a]">{customer.id}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-[#71717a]">External Store ID</span>
                <span className="font-mono text-[#0a0a0a]">
                  {customer.externalCustomerId || "None"}
                </span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-[#71717a]">Date of birth</span>
                <span className="text-[#0a0a0a]">
                  {customer.dateOfBirth || "Not provided"}
                </span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-[#71717a]">Loyalty enrolled</span>
                <span className={customer.loyaltyMember ? "text-emerald-600 font-semibold" : "text-zinc-500"}>
                  {customer.loyaltyMember ? "Yes (Enrolled)" : "No (Guest)"}
                </span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-[#71717a]">Member since</span>
                <span className="text-[#0a0a0a]">{customer.joinedDate}</span>
              </div>
            </div>
          </div>

          {/* Location & Address */}
          <div className="space-y-3">
            <h4 className="text-[12px] font-bold uppercase tracking-wider text-[#71717a] flex items-center gap-1.5">
              <MapPin className="size-3.5" />
              Address details
            </h4>
            <div className="p-4 bg-white border border-[#ebebeb] rounded-xl text-[13px] space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#71717a]">City</span>
                <span className="text-[#0a0a0a]">{customer.city || "San Francisco"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#71717a]">Region / State</span>
                <span className="text-[#0a0a0a]">{customer.region || "California"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#71717a]">Country</span>
                <span className="text-[#0a0a0a]">{customer.country || "United States"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#71717a]">Postal code</span>
                <span className="font-mono text-[#0a0a0a]">{customer.postalCode || "94107"}</span>
              </div>
            </div>
          </div>

          {/* Store connection source */}
          <div className="p-4 bg-[#f7f7f8] rounded-xl border border-[#ebebeb] text-[12px] text-[#71717a] space-y-1">
            <span className="font-semibold text-[#0a0a0a] block">
              Store Sync Information
            </span>
            <p>
              Synchronized from active merchant store (Shopify / WooCommerce). VIP tier is automatically calculated by Reloopin from merchant tier rules.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
