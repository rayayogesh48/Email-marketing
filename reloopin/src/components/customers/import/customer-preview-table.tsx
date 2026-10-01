'use client';

import React, { useState } from 'react';
import { Users, CheckCircle2, FileText, Info } from 'lucide-react';
import { PREVIEW_CUSTOMERS } from '@/lib/mock-data/customer-import';

export function CustomerPreviewTable() {
  const [duplicateHandling, setDuplicateHandling] = useState<'skip' | 'update'>('skip');
  const [preservePoints, setPreservePoints] = useState(true);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-base font-semibold text-[#0a0a0a]">
          Preview your import
        </h3>
        <p className="text-xs text-[#71717a] mt-0.5">
          Review a sample of the customer data before importing.
        </p>
      </div>

      {/* 3 Compact Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 bg-[#fafafa] border border-[#ebebeb] rounded-xl flex items-center gap-3">
          <div className="size-9 rounded-lg bg-white border border-[#ebebeb] text-[#5f3ed8] flex items-center justify-center shrink-0">
            <Users className="size-4" />
          </div>
          <div>
            <div className="text-lg font-bold text-[#0a0a0a] leading-none">248</div>
            <div className="text-xs text-[#71717a] mt-1 font-medium">Customer rows</div>
          </div>
        </div>

        <div className="p-3.5 bg-[#fafafa] border border-[#ebebeb] rounded-xl flex items-center gap-3">
          <div className="size-9 rounded-lg bg-white border border-[#ebebeb] text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="size-4" />
          </div>
          <div>
            <div className="text-lg font-bold text-[#0a0a0a] leading-none">18</div>
            <div className="text-xs text-[#71717a] mt-1 font-medium">Mapped columns</div>
          </div>
        </div>

        <div className="p-3.5 bg-[#fafafa] border border-[#ebebeb] rounded-xl flex items-center gap-3">
          <div className="size-9 rounded-lg bg-white border border-[#ebebeb] text-[#71717a] flex items-center justify-center shrink-0">
            <FileText className="size-4" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-bold text-[#0a0a0a] truncate">reloopin-customers-september.csv</div>
            <div className="text-xs text-[#71717a] mt-0.5 font-medium">1 Source file</div>
          </div>
        </div>
      </div>

      {/* Customer Preview Table */}
      <div className="border border-[#ebebeb] rounded-xl overflow-hidden bg-white shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse whitespace-nowrap">
            <thead className="bg-[#fafafa] border-b border-[#ebebeb] text-[#71717a] font-semibold">
              <tr>
                <th className="py-3 px-4 sticky left-0 bg-[#fafafa] z-10">Customer</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Platform</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Loyalty member</th>
                <th className="py-3 px-4 text-right">Points balance</th>
                <th className="py-3 px-4 text-right">Lifetime points</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ebebeb]">
              {PREVIEW_CUSTOMERS.map((cust) => {
                const initials = cust.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2);

                return (
                  <tr key={cust.id} className="hover:bg-[#fafafa]/80 transition-colors">
                    {/* Customer Name + Avatar (Sticky on scroll) */}
                    <td className="py-3 px-4 sticky left-0 bg-white group-hover:bg-[#fafafa] z-10">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`size-7 rounded-full ${cust.avatarColor} font-semibold flex items-center justify-center text-[10px] shrink-0`}
                        >
                          {initials}
                        </div>
                        <span className="font-semibold text-[#0a0a0a]">{cust.name}</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-3 px-4 text-[#52525b] font-mono text-[11px]">
                      {cust.email}
                    </td>

                    {/* Platform */}
                    <td className="py-3 px-4 text-[#52525b]">
                      {cust.platform}
                    </td>

                    {/* Phone */}
                    <td className="py-3 px-4 text-[#52525b] font-mono text-[11px]">
                      {cust.phone}
                    </td>

                    {/* Loyalty member */}
                    <td className="py-3 px-4">
                      {cust.loyaltyMember ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Yes
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-100 text-[#71717a]">
                          No
                        </span>
                      )}
                    </td>

                    {/* Points balance */}
                    <td className="py-3 px-4 text-right font-medium text-[#0a0a0a]">
                      {cust.pointsBalance.toLocaleString()} pts
                    </td>

                    {/* Lifetime points */}
                    <td className="py-3 px-4 text-right font-medium text-[#52525b]">
                      {cust.lifetimePoints.toLocaleString()} pts
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                        {cust.status}
                      </span>
                    </td>

                    {/* Location */}
                    <td className="py-3 px-4 text-[#52525b]">
                      {cust.location}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Import Preferences Section */}
      <div className="p-4 bg-[#fafafa] border border-[#ebebeb] rounded-xl space-y-3">
        <h4 className="text-xs font-semibold text-[#0a0a0a]">
          Import preferences
        </h4>

        <div className="space-y-2">
          {/* Radio 1: Skip */}
          <label className="flex items-center gap-2.5 text-xs text-[#0a0a0a] cursor-pointer">
            <input
              type="radio"
              name="duplicateHandling"
              value="skip"
              checked={duplicateHandling === 'skip'}
              onChange={() => setDuplicateHandling('skip')}
              className="size-4 text-[#5f3ed8] accent-[#5f3ed8] cursor-pointer"
            />
            <span className="font-medium">Skip customers that already exist</span>
            <span className="text-[11px] text-[#71717a]">(Preserve current store customer records)</span>
          </label>

          {/* Radio 2: Update */}
          <label className="flex items-center gap-2.5 text-xs text-[#0a0a0a] cursor-pointer">
            <input
              type="radio"
              name="duplicateHandling"
              value="update"
              checked={duplicateHandling === 'update'}
              onChange={() => setDuplicateHandling('update')}
              className="size-4 text-[#5f3ed8] accent-[#5f3ed8] cursor-pointer"
            />
            <span className="font-medium">Update existing customer details</span>
            <span className="text-[11px] text-[#71717a]">(Overwrite matching email records with new file data)</span>
          </label>
        </div>

        {/* Checkbox: preserve point balances */}
        <div className="pt-2 border-t border-[#ebebeb]">
          <label className="flex items-center gap-2.5 text-xs text-[#0a0a0a] cursor-pointer">
            <input
              type="checkbox"
              checked={preservePoints}
              onChange={(e) => setPreservePoints(e.target.checked)}
              className="size-4 rounded text-[#5f3ed8] accent-[#5f3ed8] cursor-pointer"
            />
            <span>Keep existing point balances when a customer already exists</span>
          </label>
        </div>
      </div>

      {/* Information Callout */}
      <div className="p-3 bg-zinc-50 border border-[#ebebeb] rounded-xl flex items-center gap-2.5 text-xs text-[#71717a]">
        <Info className="size-4 text-[#71717a] shrink-0" />
        <span>This prototype uses sample data. No customer records will be created.</span>
      </div>
    </div>
  );
}
