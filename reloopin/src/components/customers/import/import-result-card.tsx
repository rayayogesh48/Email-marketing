'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, AlertTriangle, FileSpreadsheet, ArrowRight, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MOCK_FILE_INFO, MOCK_IMPORT_RESULTS } from '@/lib/mock-data/customer-import';

interface ImportResultCardProps {
  variant: 'complete' | 'complete_with_skipped' | 'failed';
  onImportAnother: () => void;
  onTryAgain: () => void;
}

export function ImportResultCard({
  variant,
  onImportAnother,
  onTryAgain,
}: ImportResultCardProps) {
  if (variant === 'failed') {
    return (
      <div className="py-12 px-6 flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-6">
        {/* Soft Destructive Circle */}
        <div className="size-16 rounded-full bg-rose-50 border border-rose-200/80 flex items-center justify-center text-rose-600 shadow-xs">
          <AlertTriangle className="size-8 text-rose-600" />
        </div>

        {/* Heading & Copy */}
        <div className="space-y-1.5">
          <h3 className="text-xl font-bold text-[#0a0a0a]">
            We couldn’t complete the import
          </h3>
          <p className="text-xs text-[#71717a] max-w-sm">
            Your customer list was not changed. Try importing the file again.
          </p>
        </div>

        {/* File Reference Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#fafafa] border border-[#ebebeb] text-xs text-[#71717a]">
          <FileSpreadsheet className="size-3.5 text-[#71717a]" />
          <span className="font-medium text-[#0a0a0a]">{MOCK_FILE_INFO.fileName}</span>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 w-full max-w-xs justify-center">
          <Button
            type="button"
            onClick={onTryAgain}
            className="w-full sm:w-auto h-9 px-5 bg-[#5f3ed8] hover:bg-[#5034b8] text-white text-xs font-semibold rounded-lg shadow-xs"
          >
            <RotateCcw className="size-3.5 mr-1.5" />
            Try again
          </Button>

          <Link
            href="/customers"
            className="w-full sm:w-auto inline-flex items-center justify-center h-9 px-4 rounded-lg border border-[#ebebeb] bg-white text-xs font-medium text-[#71717a] hover:text-[#0a0a0a] hover:bg-[#fafafa]"
          >
            Back to customers
          </Link>
        </div>
      </div>
    );
  }

  const isSkipped = variant === 'complete_with_skipped';
  const results = isSkipped
    ? MOCK_IMPORT_RESULTS.completeWithSkipped
    : MOCK_IMPORT_RESULTS.completeSuccess;

  return (
    <div className="py-10 px-6 flex flex-col items-center justify-center text-center max-w-lg mx-auto space-y-6">
      {/* Icon Circle */}
      {isSkipped ? (
        <div className="size-16 rounded-full bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600 shadow-xs">
          <CheckCircle2 className="size-8 text-amber-600" />
        </div>
      ) : (
        <div className="size-16 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600 shadow-xs">
          <CheckCircle2 className="size-8 text-emerald-600" />
        </div>
      )}

      {/* Heading & Copy */}
      <div className="space-y-1.5">
        {isSkipped && (
          <div className="mb-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
              17 records skipped
            </span>
          </div>
        )}
        <h3 className="text-xl font-bold text-[#0a0a0a]">
          Customer import complete
        </h3>
        <p className="text-xs text-[#71717a] max-w-sm">
          {isSkipped
            ? 'Most customers were imported. Some existing records were skipped.'
            : '248 customers are now ready in your customer list.'}
        </p>
      </div>

      {/* 3 Metric Result Boxes */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-md">
        <div className="p-3 bg-white border border-[#ebebeb] rounded-xl text-center shadow-2xs">
          <div className="text-xl font-bold text-emerald-600">
            {results.imported}
          </div>
          <div className="text-[11px] font-medium text-[#71717a] mt-0.5">
            Imported
          </div>
        </div>

        <div className="p-3 bg-white border border-[#ebebeb] rounded-xl text-center shadow-2xs">
          <div className={`text-xl font-bold ${isSkipped ? 'text-amber-600' : 'text-[#71717a]'}`}>
            {results.skipped}
          </div>
          <div className="text-[11px] font-medium text-[#71717a] mt-0.5">
            Skipped
          </div>
        </div>

        <div className="p-3 bg-white border border-[#ebebeb] rounded-xl text-center shadow-2xs">
          <div className="text-xl font-bold text-[#a1a1aa]">
            {results.notImported}
          </div>
          <div className="text-[11px] font-medium text-[#71717a] mt-0.5">
            Not imported
          </div>
        </div>
      </div>

      {/* Optional Note for Skipped */}
      {isSkipped && (
        <p className="text-xs text-[#71717a] bg-amber-50/50 border border-amber-200/60 px-3.5 py-2 rounded-lg">
          Skipped customers already exist in your customer list.
        </p>
      )}

      {/* File Reference */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#fafafa] border border-[#ebebeb] text-xs text-[#71717a]">
        <FileSpreadsheet className="size-3.5 text-[#5f3ed8]" />
        <span className="font-medium text-[#0a0a0a]">{MOCK_FILE_INFO.fileName}</span>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 w-full max-w-sm justify-center">
        <Link
          href="/customers"
          className="w-full sm:w-auto inline-flex items-center justify-center h-9 px-5 bg-[#5f3ed8] hover:bg-[#5034b8] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
        >
          <span>View customers</span>
          <ArrowRight className="size-3.5 ml-1.5" />
        </Link>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onImportAnother}
          className="w-full sm:w-auto h-9 px-4 border-[#ebebeb] bg-white text-[#71717a] hover:text-[#0a0a0a] hover:bg-[#fafafa] text-xs font-medium"
        >
          Import another file
        </Button>
      </div>
    </div>
  );
}
