'use client';

import React from 'react';
import { FileSpreadsheet, CheckCircle2, RefreshCw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MOCK_FILE_INFO } from '@/lib/mock-data/customer-import';

interface SelectedFileCardProps {
  onReplaceFile: () => void;
  onRemoveFile: () => void;
}

export function SelectedFileCard({ onReplaceFile, onRemoveFile }: SelectedFileCardProps) {
  return (
    <div className="space-y-3">
      {/* File Card Box */}
      <div className="p-4 bg-white border border-[#ebebeb] rounded-xl flex items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3.5 min-w-0">
          {/* File Icon */}
          <div className="size-11 rounded-lg bg-[#f8f7ff] border border-[#e5e1fc] text-[#5f3ed8] flex items-center justify-center shrink-0">
            <FileSpreadsheet className="size-5" />
          </div>

          {/* Details */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-[#0a0a0a] truncate">
                {MOCK_FILE_INFO.fileName}
              </span>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-zinc-100 text-[#71717a]">
                {MOCK_FILE_INFO.fileType}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#71717a] mt-1">
              <span>{MOCK_FILE_INFO.size}</span>
              <span>•</span>
              <span>{MOCK_FILE_INFO.rows}</span>
              <span>•</span>
              <span>{MOCK_FILE_INFO.columns}</span>
            </div>
          </div>
        </div>

        {/* File Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onReplaceFile}
            className="h-8 px-3 text-xs font-medium border-[#ebebeb] text-[#0a0a0a] hover:bg-[#fafafa]"
          >
            <RefreshCw className="size-3.5 mr-1.5 text-[#71717a]" />
            Replace file
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onRemoveFile}
            className="size-8 text-[#71717a] hover:text-rose-600 hover:bg-rose-50"
            title="Remove file"
            aria-label="Remove file"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>

      {/* Small Positive Status Line */}
      <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50/60 border border-emerald-200/80 px-3 py-2 rounded-lg">
        <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
        <span>Your file is ready for column mapping.</span>
      </div>
    </div>
  );
}
