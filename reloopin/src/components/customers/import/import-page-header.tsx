'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronRight } from 'lucide-react';

export function ImportPageHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
      <div>
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-[#71717a] mb-1.5 font-medium">
          <Link
            href="/customers"
            className="hover:text-[#5f3ed8] transition-colors"
          >
            Customers
          </Link>
          <ChevronRight className="size-3 text-[#a1a1aa]" />
          <span className="text-[#0a0a0a]">Import customers</span>
        </div>

        {/* Title & Description */}
        <h1 className="text-2xl font-bold tracking-tight text-[#0a0a0a]">
          Import customers
        </h1>
        <p className="text-sm text-[#71717a] mt-1">
          Add customers in bulk using a CSV or XLSX file.
        </p>
      </div>

      {/* Quiet text action button */}
      <div>
        <Link
          href="/customers"
          className="inline-flex items-center gap-2 text-xs font-medium text-[#71717a] hover:text-[#0a0a0a] px-3 py-1.5 rounded-lg border border-[#ebebeb] hover:bg-[#fafafa] transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to customers</span>
        </Link>
      </div>
    </div>
  );
}
