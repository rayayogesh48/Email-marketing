'use client';

import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { CUSTOMER_IMPORT_FIELDS, CustomerFieldDefinition } from '@/lib/mock-data/customer-import';

export function ColumnMappingTable() {
  // Store mapped field keys per row, defaults to matching field
  const [mappings, setMappings] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    CUSTOMER_IMPORT_FIELDS.forEach((f) => {
      initial[f.field] = f.field;
    });
    return initial;
  });

  const handleSelectChange = (sourceField: string, targetField: string) => {
    setMappings((prev) => ({
      ...prev,
      [sourceField]: targetField,
    }));
  };

  const mappedCount = Object.values(mappings).filter((val) => val !== 'ignore').length;

  return (
    <div className="space-y-4">
      {/* Table Header Description & Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-[#0a0a0a]">
            Map your columns
          </h3>
          <p className="text-xs text-[#71717a] mt-0.5">
            Match each column in your file to a Reloopin customer field.
          </p>
        </div>

        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#f8f7ff] text-[#5f3ed8] border border-[#e5e1fc]">
            <Check className="size-3.5 stroke-[2.5]" />
            {mappedCount} of {CUSTOMER_IMPORT_FIELDS.length} mapped
          </span>
        </div>
      </div>

      {/* Mapping Table with Sticky Header and Internal Scroll */}
      <div className="border border-[#ebebeb] rounded-xl overflow-hidden bg-white shadow-2xs">
        <div className="max-h-[460px] overflow-y-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 z-10 bg-[#fafafa] border-b border-[#ebebeb] text-[#71717a] font-semibold">
              <tr>
                <th className="py-3 px-4 w-[28%]">File column</th>
                <th className="py-3 px-4 w-[34%]">Example value</th>
                <th className="py-3 px-4 w-[38%]">Reloopin field</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ebebeb]">
              {CUSTOMER_IMPORT_FIELDS.map((row) => {
                const currentVal = mappings[row.field] || row.field;
                const isIgnored = currentVal === 'ignore';

                return (
                  <tr
                    key={row.field}
                    className="hover:bg-[#fafafa]/80 transition-colors"
                  >
                    {/* File Column Header Name */}
                    <td className="py-2.5 px-4 font-mono text-[11px] text-[#0a0a0a]">
                      <code className="bg-[#f4f4f5] border border-[#ebebeb] px-2 py-0.5 rounded text-[#0a0a0a] font-medium">
                        {row.field}
                      </code>
                    </td>

                    {/* Example Value */}
                    <td className="py-2.5 px-4 text-[#52525b] truncate max-w-[220px]">
                      {row.exampleValue}
                    </td>

                    {/* Reloopin Field Select */}
                    <td className="py-2.5 px-4">
                      <div className="relative">
                        <select
                          value={currentVal}
                          onChange={(e) => handleSelectChange(row.field, e.target.value)}
                          className={`w-full h-8 pl-3 pr-8 rounded-lg text-xs font-medium border outline-none transition-colors appearance-none cursor-pointer ${
                            isIgnored
                              ? 'bg-zinc-100 text-[#71717a] border-[#ebebeb]'
                              : 'bg-white text-[#0a0a0a] border-[#ebebeb] focus:border-[#5f3ed8] hover:border-zinc-300'
                          }`}
                        >
                          <optgroup label="Standard Customer Fields">
                            {CUSTOMER_IMPORT_FIELDS.map((opt) => (
                              <option key={opt.field} value={opt.field}>
                                {opt.label} ({opt.group})
                              </option>
                            ))}
                          </optgroup>
                          <optgroup label="Actions">
                            <option value="ignore">Don&apos;t import (Ignore column)</option>
                          </optgroup>
                        </select>
                        <ChevronDown className="size-3.5 text-[#71717a] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quiet helper note */}
      <p className="text-[11px] text-[#71717a]">
        You can change any match before continuing.
      </p>
    </div>
  );
}
