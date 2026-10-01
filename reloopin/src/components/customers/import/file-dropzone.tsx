'use client';

import React, { useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileDropzoneProps {
  onFileSelect: () => void;
}

export function FileDropzone({ onFileSelect }: FileDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    onFileSelect();
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={onFileSelect}
      className={`group relative flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
        isDragOver
          ? 'border-[#5f3ed8] bg-[#f8f7ff]'
          : 'border-[#e4e4e7] hover:border-[#5f3ed8]/50 hover:bg-[#fafafa]'
      }`}
    >
      {/* Upload Icon */}
      <div className="size-12 rounded-full bg-[#f8f7ff] border border-[#e5e1fc] text-[#5f3ed8] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
        <UploadCloud className="size-6 text-[#5f3ed8]" />
      </div>

      {/* Main Text */}
      <p className="text-sm font-semibold text-[#0a0a0a]">
        Drag and drop your file here
      </p>

      {/* Supporting Text */}
      <p className="text-xs text-[#71717a] mt-1 mb-4">
        CSV or XLSX, up to 10 MB
      </p>

      {/* Secondary Button */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          onFileSelect();
        }}
        className="h-8 px-4 text-xs font-medium border-[#ebebeb] bg-white text-[#0a0a0a] hover:bg-[#fafafa] shadow-xs"
      >
        Choose file
      </Button>
    </div>
  );
}
