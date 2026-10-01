'use client';

import React, { useState } from 'react';
import {
  Layers,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sparkles,
  Sliders,
} from 'lucide-react';
import { AnalyticsTabId, AnalyticsDataState } from '@/lib/mock-data/analytics-v2';

interface PreviewStateSwitcherProps {
  currentTab: AnalyticsTabId;
  currentState: AnalyticsDataState;
  onTabChange: (tab: AnalyticsTabId) => void;
  onStateChange: (state: AnalyticsDataState) => void;
}

export function PreviewStateSwitcher({
  currentTab,
  currentState,
  onTabChange,
  onStateChange,
}: PreviewStateSwitcherProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const states: { id: AnalyticsDataState; label: string; desc: string }[] = [
    { id: 'default', label: 'Default (Active data)', desc: 'Standard production state with complete metrics' },
    { id: 'loading', label: 'Loading Skeleton', desc: 'Simulated initial data fetch skeleton' },
    { id: 'empty', label: 'Empty (First-time user)', desc: 'Store has 0 loyalty members or orders' },
    { id: 'no_filter_results', label: 'No Filter Results', desc: 'Strict filters returned 0 matching records' },
    { id: 'partial_data', label: 'Partial Ingestion', desc: 'Syncing in progress (65% records indexed)' },
    { id: 'sync_delayed', label: 'Sync Delayed Warning', desc: 'Data warehouse 4 hours behind schedule' },
    { id: 'data_unavailable', label: 'Data Unavailable Error', desc: 'Temporary upstream reporting failure' },
    { id: 'exporting', label: 'Exporting Modal/Toast', desc: 'Generating CSV/PDF background payload' },
    { id: 'export_successful', label: 'Export Successful', desc: 'Ready for download notification' },
    { id: 'export_failed', label: 'Export Failed', desc: 'Simulated network timeout during export' },
  ];

  const tabs: { id: AnalyticsTabId; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'retention', label: 'Retention' },
    { id: 'members', label: 'Members' },
    { id: 'points', label: 'Points' },
    { id: 'rewards', label: 'Rewards' },
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isExpanded ? (
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-2 px-3 py-2 bg-white border border-[#ebebeb] hover:border-zinc-300 text-[#0a0a0a] rounded-full shadow-lg text-xs font-semibold hover:shadow-xl transition-all group"
        >
          <span className="size-2 rounded-full bg-[#5f3ed8] animate-pulse" />
          <Sliders className="size-3.5 text-[#5f3ed8]" />
          <span>Prototype state:</span>
          <span className="text-[#5f3ed8] font-mono capitalize">
            {currentState.replace(/_/g, ' ')}
          </span>
          <ChevronUp className="size-3.5 text-zinc-400 group-hover:text-zinc-600 ml-0.5" />
        </button>
      ) : (
        <div className="bg-white border border-[#ebebeb] rounded-2xl shadow-2xl p-4 w-80 sm:w-96 text-xs space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-[#f4f4f5]">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-[#f8f7ff] text-[#5f3ed8]">
                <Layers className="size-4" />
              </span>
              <div>
                <h4 className="font-semibold text-sm text-[#0a0a0a]">Prototype Controls</h4>
                <p className="text-[11px] text-[#71717a]">Preview edge cases & reporting flows</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="p-1 text-zinc-400 hover:text-zinc-700 rounded-md hover:bg-zinc-100"
            >
              <ChevronDown className="size-4" />
            </button>
          </div>

          {/* Quick Tab Switcher */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-[#71717a] uppercase tracking-wider">
              Active Section
            </span>
            <div className="grid grid-cols-5 gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onTabChange(tab.id)}
                  className={`py-1.5 text-center rounded-lg text-xs font-medium transition-all ${
                    currentTab === tab.id
                      ? 'bg-[#5f3ed8] text-white shadow-xs'
                      : 'bg-zinc-100 hover:bg-zinc-200 text-[#0a0a0a]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Data State Switcher */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-[#71717a] uppercase tracking-wider">
              Simulation States ({states.length})
            </span>
            <div className="max-h-56 overflow-y-auto space-y-1 pr-1 border border-[#f4f4f5] rounded-xl p-1 bg-zinc-50/50">
              {states.map((s) => {
                const isActive = currentState === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => onStateChange(s.id)}
                    className={`w-full text-left p-2 rounded-lg text-xs transition-all flex flex-col gap-0.5 ${
                      isActive
                        ? 'bg-white text-[#5f3ed8] font-semibold shadow-xs border border-[#e5e1fc]'
                        : 'text-[#0a0a0a] hover:bg-white hover:text-black'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{s.label}</span>
                      {isActive && <Sparkles className="size-3 text-[#5f3ed8]" />}
                    </div>
                    <span className="text-[10px] text-[#71717a] font-normal leading-tight">
                      {s.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reset / Footer */}
          <div className="pt-2 border-t border-[#f4f4f5] flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                onStateChange('default');
                onTabChange('overview');
              }}
              className="inline-flex items-center gap-1.5 text-xs text-[#71717a] hover:text-[#0a0a0a] transition-colors"
            >
              <RotateCcw className="size-3" />
              Reset to default
            </button>
            <span className="text-[10px] text-[#a1a1aa] font-mono">Analytics V2 Mock Engine</span>
          </div>
        </div>
      )}
    </div>
  );
}
