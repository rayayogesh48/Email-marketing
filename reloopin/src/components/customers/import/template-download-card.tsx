'use client';

import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function TemplateDownloadCard() {
  const handleDownload = (format: 'CSV' | 'XLSX') => {
    toast.success(`Sample template download started (${format}).`);
  };

  return (
    <div className="p-4 bg-[#fafafa] border border-[#ebebeb] rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h4 className="text-xs font-semibold text-[#0a0a0a]">
          Start with the sample template
        </h4>
        <p className="text-xs text-[#71717a] mt-0.5">
          Download a prepared file with the correct column names and example customer data.
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleDownload('CSV')}
          className="h-8 px-3 text-xs font-medium border-[#ebebeb] bg-white text-[#0a0a0a] hover:bg-[#f4f4f5] shadow-xs"
        >
          <Download className="size-3.5 mr-1.5 text-[#71717a]" />
          Download CSV
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleDownload('XLSX')}
          className="h-8 px-3 text-xs font-medium border-[#ebebeb] bg-white text-[#0a0a0a] hover:bg-[#f4f4f5] shadow-xs"
        >
          <Download className="size-3.5 mr-1.5 text-[#71717a]" />
          Download XLSX
        </Button>
      </div>
    </div>
  );
}
