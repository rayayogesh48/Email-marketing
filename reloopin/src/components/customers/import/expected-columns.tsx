'use client';

import React, { useState } from 'react';
import { ChevronDown, ListFilter } from 'lucide-react';
import { CUSTOMER_IMPORT_FIELDS } from '@/lib/mock-data/customer-import';

export function ExpectedColumns() {
  const [isOpen, setIsOpen] = useState(false);

  // Group fields
  const groups: Record<string, typeof CUSTOMER_IMPORT_FIELDS> = {
    Identity: CUSTOMER_IMPORT_FIELDS.filter((f) => f.group === 'Identity'),
    Contact: CUSTOMER_IMPORT_FIELDS.filter((f) => f.group === 'Contact'),
    Platform: CUSTOMER_IMPORT_FIELDS.filter((f) => f.group === 'Platform'),
    Loyalty: CUSTOMER_IMPORT_FIELDS.filter((f) => f.group === 'Loyalty'),
    Account: CUSTOMER_IMPORT_FIELDS.filter((f) => f.group === 'Account'),
    Dates: CUSTOMER_IMPORT_FIELDS.filter((f) => f.group === 'Dates'),
    Location: CUSTOMER_IMPORT_FIELDS.filter((f) => f.group === 'Location'),
  };

  return (
    <div className="border border-[#ebebeb] rounded-xl overflow-hidden bg-white">
      {/* Header Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-white hover:bg-[#fafafa] flex items-center justify-between transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          <ListFilter className="size-4 text-[#5f3ed8]" />
          <span className="text-xs font-semibold text-[#0a0a0a]">
            View expected columns
          </span>
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-zinc-100 text-[#71717a]">
            18 fields
          </span>
        </div>

        <ChevronDown
          className={`size-4 text-[#71717a] transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Expandable Grouped Content */}
      {isOpen && (
        <div className="p-4 border-t border-[#ebebeb] bg-[#fafafa]/50">
          <p className="text-xs text-[#71717a] mb-3">
            Your file can contain any or all of these 18 supported fields. Missing columns will be left empty.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(groups).map(([groupName, fields]) => (
              <div
                key={groupName}
                className="p-3 bg-white border border-[#ebebeb] rounded-lg shadow-2xs"
              >
                <div className="text-[11px] font-semibold text-[#71717a] uppercase tracking-wider mb-2">
                  {groupName}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {fields.map((f) => (
                    <span
                      key={f.field}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#f4f4f5] text-[11px] font-mono text-[#0a0a0a] border border-[#ebebeb]"
                      title={`${f.label} (${f.field})`}
                    >
                      <span className="font-semibold">{f.label}</span>
                      <span className="text-[#a1a1aa] font-mono text-[10px]">({f.field})</span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
