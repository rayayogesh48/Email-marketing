import React from "react";
import { Star, Crown, Gem, ShieldOff, PauseCircle, Clock } from "lucide-react";
import { VipTier, CustomerStatus } from "@/lib/customers/customer-types";

export function CustomerTierBadge({ tier }: { tier: VipTier }) {
  if (tier === "platinum") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#eff6ff] text-[#2563eb] border border-[#dbeafe]">
        <Gem className="size-3 shrink-0 text-[#2563eb]" />
        PLATINUM
      </span>
    );
  }

  if (tier === "gold") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#fff7ed] text-[#ea580c] border border-[#ffedd5]">
        <Crown className="size-3 shrink-0 text-[#ea580c]" />
        GOLD
      </span>
    );
  }

  if (tier === "silver") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#f4f4f5] text-[#52525b] border border-[#e4e4e7]">
        <Star className="size-3 shrink-0 text-[#71717a]" />
        SILVER
      </span>
    );
  }

  // No tier
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-normal bg-zinc-100 text-[#71717a] border border-[#e4e4e7]">
      <ShieldOff className="size-3 shrink-0 text-[#a1a1aa]" />
      No tier
    </span>
  );
}

export function CustomerStatusBadge({ status }: { status: CustomerStatus }) {
  if (status === "active") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#ecfdf5] text-[#059669] border border-[#d1fae5]">
        <span className="size-1.5 rounded-full bg-[#10b981]" />
        ACTIVE
      </span>
    );
  }

  if (status === "loyalty_paused") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#fffbeb] text-[#b45309] border border-[#fef3c7]">
        <PauseCircle className="size-3 text-[#d97706]" />
        PAUSED
      </span>
    );
  }

  if (status === "import_pending") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#eff6ff] text-[#2563eb] border border-[#dbeafe]">
        <Clock className="size-3 text-[#3b82f6]" />
        PENDING
      </span>
    );
  }

  // Inactive
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#f4f4f5] text-[#71717a] border border-[#e4e4e7]">
      <span className="size-1.5 rounded-full bg-[#a1a1aa]" />
      INACTIVE
    </span>
  );
}
