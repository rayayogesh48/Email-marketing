'use client';

import React, { useState } from 'react';
import { Table, BarChart2 } from 'lucide-react';
import { generateDailyUsagePoints, FREE_ORDER_THRESHOLD } from '@/lib/billing/billing-data';
import { DailyUsagePoint } from '@/lib/billing/billing-types';

interface UsageTrendChartProps {
  countedOrdersCount: number;
}

export function UsageTrendChart({ countedOrdersCount }: UsageTrendChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<DailyUsagePoint | null>(null);
  const [showTableView, setShowTableView] = useState(false);

  const data = generateDailyUsagePoints(countedOrdersCount);
  const maxCumulative = Math.max(60, countedOrdersCount * 1.1);

  // SVG dimensions
  const width = 800;
  const height = 220;
  const padLeft = 40;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 30;
  const chartWidth = width - padLeft - padRight;
  const chartHeight = height - padTop - padBottom;

  const thresholdY = padTop + chartHeight - (FREE_ORDER_THRESHOLD / maxCumulative) * chartHeight;

  return (
    <div className="bg-white border border-[#ebebeb] rounded-2xl p-6 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-[16px] font-bold text-[#0a0a0a]">
            Daily counted order activity
          </h3>
          <p className="text-[12px] text-[#71717a] mt-0.5">
            Cumulative monthly counted orders with reference to the 50-order free threshold.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowTableView(!showTableView)}
          className="flex items-center gap-1.5 text-[12px] font-medium text-[#71717a] hover:text-[#0a0a0a] bg-zinc-50 border border-[#ebebeb] px-3 py-1.5 rounded-lg transition-colors self-start sm:self-auto cursor-pointer"
        >
          {showTableView ? (
            <>
              <BarChart2 className="size-3.5" />
              <span>Show chart</span>
            </>
          ) : (
            <>
              <Table className="size-3.5" />
              <span>Accessible data table</span>
            </>
          )}
        </button>
      </div>

      {!showTableView ? (
        <div className="relative">
          {/* Tooltip */}
          {hoveredPoint && (
            <div className="absolute top-2 right-4 z-20 bg-[#0a0a0a] text-white p-3 rounded-xl shadow-lg text-[12px] pointer-events-none min-w-[200px] border border-zinc-700 animate-in fade-in duration-100">
              <span className="font-bold block border-b border-zinc-800 pb-1 mb-1">
                {hoveredPoint.dateStr}, 2026
              </span>
              <div className="space-y-0.5 text-zinc-300">
                <div className="flex justify-between">
                  <span>Daily counted:</span>
                  <strong className="text-white">{hoveredPoint.dailyCounted} orders</strong>
                </div>
                <div className="flex justify-between">
                  <span>Running monthly total:</span>
                  <strong className="text-white">{hoveredPoint.runningTotal} orders</strong>
                </div>
                <div className="flex justify-between pt-1 border-t border-zinc-800 text-[#a78bfa]">
                  <span>Estimated charge:</span>
                  <strong>${hoveredPoint.estimatedCharge.toFixed(2)}</strong>
                </div>
              </div>
            </div>
          )}

          {/* SVG Chart */}
          <div className="w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-[220px] select-none text-[10px] font-medium text-[#71717a]"
            >
              {/* Y Grid lines & Labels */}
              {[0, 25, 50, Math.round(maxCumulative)].map((val) => {
                const y = padTop + chartHeight - (val / maxCumulative) * chartHeight;
                return (
                  <g key={val}>
                    <line
                      x1={padLeft}
                      y1={y}
                      x2={width - padRight}
                      y2={y}
                      stroke="currentColor"
                      className="text-zinc-200"
                      strokeDasharray="3 3"
                    />
                    <text x={padLeft - 8} y={y + 3} textAnchor="end" fill="currentColor">
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* Threshold 50 Reference Line */}
              <line
                x1={padLeft}
                y1={thresholdY}
                x2={width - padRight}
                y2={thresholdY}
                stroke="#eab308"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <text
                x={width - padRight}
                y={thresholdY - 5}
                textAnchor="end"
                fill="#ca8a04"
                className="font-bold text-[10px]"
              >
                Free threshold (50 orders)
              </text>

              {/* Daily bars */}
              {data.map((pt, idx) => {
                const barWidth = chartWidth / data.length - 3;
                const x = padLeft + idx * (chartWidth / data.length) + 1.5;
                const barHeight = Math.max(3, (pt.runningTotal / maxCumulative) * chartHeight);
                const y = padTop + chartHeight - barHeight;
                const isOverThreshold = pt.runningTotal > FREE_ORDER_THRESHOLD;

                return (
                  <g
                    key={pt.day}
                    className="cursor-pointer group"
                    onMouseEnter={() => setHoveredPoint(pt)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  >
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      rx="3"
                      className={`transition-colors ${
                        isOverThreshold
                          ? 'fill-[#5f3ed8] group-hover:fill-[#4c2fb5]'
                          : 'fill-emerald-500/80 group-hover:fill-emerald-600'
                      }`}
                    />

                    {/* X Axis Labels (every 5 days) */}
                    {pt.day % 5 === 0 && (
                      <text
                        x={x + barWidth / 2}
                        y={height - 10}
                        textAnchor="middle"
                        fill="currentColor"
                      >
                        Sep {pt.day}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#71717a] pt-1">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-sm bg-emerald-500" />
                <span>Free zone (1–50 orders)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-sm bg-[#5f3ed8]" />
                <span>Billable zone ($0.05 / order)</span>
              </span>
            </div>
            <span>Hover bars for daily breakdown</span>
          </div>
        </div>
      ) : (
        /* Accessible Table Alternative */
        <div className="border border-[#ebebeb] rounded-xl overflow-hidden max-h-[260px] overflow-y-auto text-[13px]">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-[#f7f7f8] text-[11px] font-bold uppercase tracking-wider text-[#71717a] border-b border-[#ebebeb]">
              <tr>
                <th className="p-2.5">Date</th>
                <th className="p-2.5 text-right">Daily Counted</th>
                <th className="p-2.5 text-right">Running Total</th>
                <th className="p-2.5 text-right">Estimated Charge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ebebeb]">
              {data.map((d) => (
                <tr key={d.day} className="hover:bg-zinc-50">
                  <td className="p-2.5 font-medium">{d.dateStr}, 2026</td>
                  <td className="p-2.5 text-right">{d.dailyCounted}</td>
                  <td className="p-2.5 text-right font-semibold">{d.runningTotal}</td>
                  <td className="p-2.5 text-right font-mono">${d.estimatedCharge.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
