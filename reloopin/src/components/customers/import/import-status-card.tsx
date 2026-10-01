'use client';

import React from 'react';
import { Loader2, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MOCK_FILE_INFO, MOCK_IMPORT_RESULTS } from '@/lib/mock-data/customer-import';

interface ImportStatusCardProps {
  onShowResult: () => void;
}

export function ImportStatusCard({ onShowResult }: ImportStatusCardProps) {
  return (
    <div className="py-12 px-6 flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-6">
      {/* Animated Spinner in Soft Brand Container */}
      <div className="size-16 rounded-full bg-[#f8f7ff] border border-[#e5e1fc] flex items-center justify-center text-[#5f3ed8] shadow-xs">
        <Loader2 className="size-8 animate-spin text-[#5f3ed8]" />
      </div>

      {/* Heading & Copy */}
      <div className="space-y-1.5">
        <h3 className="text-xl font-bold text-[#0a0a0a]">
          Importing customers
        </h3>
        <p className="text-xs text-[#71717a] max-w-sm">
          Please keep this page open while we prepare your customer list.
        </p>
      </div>

      {/* Progress Bar Container */}
      <div className="w-full space-y-2">
        <div className="w-full h-2.5 bg-zinc-100 rounded-full overflow-hidden border border-zinc-200/60">
          <div
            className="h-full bg-[#5f3ed8] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${MOCK_IMPORT_RESULTS.inProgress.percentage}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-[#71717a] font-medium">
          <span>{MOCK_IMPORT_RESULTS.inProgress.label}</span>
          <span className="font-semibold text-[#0a0a0a]">
            {MOCK_IMPORT_RESULTS.inProgress.percentage}%
          </span>
        </div>
      </div>

      {/* File Reference Pill */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#fafafa] border border-[#ebebeb] text-xs text-[#71717a]">
        <FileSpreadsheet className="size-3.5 text-[#5f3ed8]" />
        <span className="font-medium text-[#0a0a0a]">{MOCK_FILE_INFO.fileName}</span>
      </div>

      {/* Prototype Helper Action */}
      <div className="pt-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onShowResult}
          className="h-8 px-4 text-xs font-medium border-[#ebebeb] text-[#5f3ed8] hover:bg-[#f8f7ff] hover:border-[#5f3ed8]"
        >
          Show result
        </Button>
      </div>
    </div>
  );
}
