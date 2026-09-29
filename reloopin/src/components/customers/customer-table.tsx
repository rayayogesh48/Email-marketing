"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  ChevronLeft,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Customer, CustomerSortField } from "@/lib/customers/customer-types";
import { CustomerTierBadge, CustomerStatusBadge } from "./customer-badges";
import { useCustomerStore, getFilteredCustomers } from "@/lib/customers/customer-store";

export function CustomerTable({ customers }: { customers?: Customer[] }) {
  const router = useRouter();
  const store = useCustomerStore();
  const {
    selectedCustomerId,
    setSelectedCustomerId,
    sortBy,
    sortDirection,
    setSort,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
  } = store;

  const { paginated, totalCount, totalPages } = getFilteredCustomers(store);
  const displayList = customers || paginated;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarGradient = (tier: string) => {
    if (tier === "platinum") return "from-blue-500 to-indigo-600 text-white";
    if (tier === "gold") return "from-amber-400 to-orange-500 text-white";
    return "from-slate-400 to-zinc-600 text-white";
  };

  const renderSortIndicator = (field: CustomerSortField) => {
    if (sortBy !== field) {
      return (
        <ArrowUpDown className="size-3 text-[#a1a1aa] opacity-40 group-hover/th:opacity-100 transition-opacity" />
      );
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="size-3 text-[#5f3ed8]" />
    ) : (
      <ArrowDown className="size-3 text-[#5f3ed8]" />
    );
  };

  const startRecord = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="w-full bg-white border border-[#ebebeb] rounded-[12px] overflow-hidden shadow-xs flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[840px]">
          {/* Table Header */}
          <thead>
            <tr className="bg-[#f7f7f8] border-b border-[#ebebeb] h-[40px]">
              <th
                onClick={() => setSort("name")}
                className="group/th px-4 text-[12px] font-bold text-[#5b5a5a] uppercase tracking-[-0.1px] cursor-pointer select-none hover:text-[#0a0a0a] transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>CUSTOMER</span>
                  {renderSortIndicator("name")}
                </div>
              </th>
              <th className="px-3 w-[130px] text-[12px] font-bold text-[#5b5a5a] uppercase tracking-[-0.1px]">
                VIP Tiers
              </th>
              <th
                onClick={() => setSort("points")}
                className="group/th px-3 w-[150px] text-[12px] font-bold text-[#5b5a5a] uppercase tracking-[-0.1px] cursor-pointer select-none hover:text-[#0a0a0a] transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>POINT BALANCE</span>
                  {renderSortIndicator("points")}
                </div>
              </th>
              <th
                onClick={() => setSort("ltv")}
                className="group/th px-3 w-[150px] text-[12px] font-bold text-[#5b5a5a] uppercase tracking-[-0.1px] cursor-pointer select-none hover:text-[#0a0a0a] transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>LIFETIME VALUE</span>
                  {renderSortIndicator("ltv")}
                </div>
              </th>
              <th className="px-3 w-[120px] text-[12px] font-bold text-[#5b5a5a] uppercase tracking-[-0.1px]">
                STATUS
              </th>
              <th
                onClick={() => setSort("lastActivity")}
                className="group/th px-4 w-[200px] text-[12px] font-bold text-[#5b5a5a] uppercase tracking-[-0.1px] cursor-pointer select-none hover:text-[#0a0a0a] transition-colors"
              >
                <div className="flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <span>LAST ACTIVITY</span>
                    {renderSortIndicator("lastActivity")}
                  </div>
                </div>
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-[#ebebeb]">
            {displayList.map((customer) => {
              const isSelected = selectedCustomerId === customer.id;
              return (
                <tr
                  key={customer.id}
                  onClick={() => {
                    setSelectedCustomerId(customer.id);
                    router.push(`/customers/${customer.id}`);
                  }}
                  className={`group h-[76px] cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-[#5f3ed8]/5"
                      : "hover:bg-zinc-50/80"
                  }`}
                >
                  {/* Customer Avatar & Name & Email */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`size-[38px] rounded-full flex items-center justify-center font-bold text-[13px] bg-gradient-to-br shadow-xs shrink-0 ${getAvatarGradient(
                          customer.vipTier
                        )}`}
                      >
                        {getInitials(customer.name)}
                      </div>
                      <div className="min-w-0 flex flex-col">
                        <span className="text-[14px] font-semibold text-[#0a0a0a] truncate group-hover:text-[#5f3ed8] transition-colors">
                          {customer.name}
                        </span>
                        <span className="text-[12px] text-[#71717a] truncate">
                          {customer.email}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* VIP Tier */}
                  <td className="px-3 py-3">
                    <CustomerTierBadge tier={customer.vipTier} />
                  </td>

                  {/* Point Balance */}
                  <td className="px-3 py-3">
                    <span className="text-[13px] font-semibold text-[#0a0a0a]">
                      {customer.pointBalance.toLocaleString()} pts
                    </span>
                  </td>

                  {/* Lifetime Value */}
                  <td className="px-3 py-3">
                    <span className="text-[13px] font-semibold text-[#0a0a0a]">
                      ${customer.lifetimeValue.toLocaleString()}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-3 py-3">
                    <CustomerStatusBadge status={customer.status} />
                  </td>

                  {/* Last Activity & Chevron */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[13px] text-[#71717a] whitespace-nowrap">
                        {customer.lastActivity}
                      </span>
                      <ChevronRight className="size-4 text-[#a1a1aa] group-hover:text-[#5f3ed8] group-hover:translate-x-0.5 transition-all shrink-0" />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-[#ebebeb] bg-[#fbfbfb] text-[13px]">
        <div className="flex items-center gap-4 text-[#71717a]">
          <span>
            Showing <strong className="text-[#0a0a0a] font-semibold">{startRecord}</strong> to{" "}
            <strong className="text-[#0a0a0a] font-semibold">{endRecord}</strong> of{" "}
            <strong className="text-[#0a0a0a] font-semibold">{totalCount}</strong> customers
          </span>

          <div className="flex items-center gap-1.5">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              aria-label="Rows per page"
              className="bg-white border border-[#ebebeb] rounded-md px-2 py-0.5 text-[12px] font-medium text-[#0a0a0a] outline-none focus:border-[#5f3ed8]"
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            className="flex items-center justify-center size-8 rounded-lg border border-[#ebebeb] bg-white text-[#0a0a0a] hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Previous page"
          >
            <ChevronLeft className="size-4" />
          </button>

          <span className="px-2 font-medium text-[#0a0a0a]">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
            className="flex items-center justify-center size-8 rounded-lg border border-[#ebebeb] bg-white text-[#0a0a0a] hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Next page"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
