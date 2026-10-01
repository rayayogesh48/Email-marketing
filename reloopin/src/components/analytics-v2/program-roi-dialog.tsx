'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TrendingUp, ArrowUpRight } from 'lucide-react';

interface ProgramRoiDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProgramRoiDialog({ isOpen, onClose }: ProgramRoiDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl bg-white border border-[#ebebeb] p-6 text-[#0a0a0a]">
        <DialogHeader className="pb-3 border-b border-[#ebebeb]">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-[#5f3ed8]/10 text-[#5f3ed8] flex items-center justify-center">
              <TrendingUp className="size-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold text-[#0a0a0a]">
                Loyalty Program ROI Deep Dive
              </DialogTitle>
              <DialogDescription className="text-xs text-[#71717a]">
                Net return on reward spend and incremental revenue attribution
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4 space-y-4 text-xs">
          {/* Main Ratio Card */}
          <div className="p-4 bg-[#f8f7ff] border border-[#e5e1fc] rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-[#5f3ed8] uppercase tracking-wider block">
                Net Program Return
              </span>
              <div className="text-3xl font-extrabold text-[#0a0a0a] mt-0.5">
                $23.10
              </div>
              <p className="text-[11px] text-[#71717a] mt-1">
                For every $1 in reward costs issued, members generated $23.10 in store sales.
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ArrowUpRight className="size-3.5" />
                +11.6% QoQ
              </span>
            </div>
          </div>

          {/* Breakdown Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-[#fafafa] border border-[#ebebeb] rounded-xl">
              <span className="text-[11px] text-[#71717a] font-medium block">Total Member Revenue</span>
              <span className="text-lg font-bold text-[#0a0a0a] block mt-1">$519,430</span>
              <span className="text-[11px] text-emerald-600 font-medium">+14% vs last period</span>
            </div>

            <div className="p-3.5 bg-[#fafafa] border border-[#ebebeb] rounded-xl">
              <span className="text-[11px] text-[#71717a] font-medium block">Total Reward Cost</span>
              <span className="text-lg font-bold text-[#0a0a0a] block mt-1">$22,540</span>
              <span className="text-[11px] text-[#71717a]">Discounts & free products</span>
            </div>

            <div className="p-3.5 bg-[#fafafa] border border-[#ebebeb] rounded-xl">
              <span className="text-[11px] text-[#71717a] font-medium block">Estimated Net Profit</span>
              <span className="text-lg font-bold text-[#0a0a0a] block mt-1">$496,890</span>
              <span className="text-[11px] text-[#71717a]">After reward redemption costs</span>
            </div>

            <div className="p-3.5 bg-[#fafafa] border border-[#ebebeb] rounded-xl">
              <span className="text-[11px] text-[#71717a] font-medium block">Incremental Lift</span>
              <span className="text-lg font-bold text-emerald-600 block mt-1">+$142,800</span>
              <span className="text-[11px] text-[#71717a]">Over non-member control baseline</span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-[#ebebeb] flex justify-end">
          <Button
            type="button"
            onClick={onClose}
            className="h-8 px-4 text-xs font-semibold bg-[#5f3ed8] hover:bg-[#5034b8] text-white"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
