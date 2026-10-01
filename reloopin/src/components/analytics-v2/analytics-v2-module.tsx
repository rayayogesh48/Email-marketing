'use client';

import React, { useState } from 'react';
import { StoreData } from '@/lib/model';
import {
  AnalyticsTabId,
  AnalyticsDataState,
} from '@/lib/mock-data/analytics-v2';
import { AnalyticsHeader } from './analytics-header';
import { AnalyticsTabs } from './analytics-tabs';
import { OverviewTab } from './overview-tab';
import { RetentionTab } from './retention-tab';
import { MembersTab } from './members-tab';
import { PointsTab } from './points-tab';
import { RewardsTab } from './rewards-tab';
import { EmptyAnalyticsState } from './empty-analytics-state';
import { CalculationInfoDialog } from './calculation-info-dialog';
import { ProgramRoiDialog } from './program-roi-dialog';
import { PreviewStateSwitcher } from './preview-state-switcher';
import { Clock, RefreshCw, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface AnalyticsV2ModuleProps {
  store?: string | StoreData;
}

export function AnalyticsV2Module({ store }: AnalyticsV2ModuleProps) {
  // Navigation & Filter States
  const [activeTab, setActiveTab] = useState<AnalyticsTabId>('overview');
  const [dateRange, setDateRange] = useState<string>('Last 30 days');
  const [tierFilter, setTierFilter] = useState<string>('All tiers');
  const [storeName, setStoreName] = useState<string>(
    typeof store === 'string' ? store : 'Nomad Goods'
  );

  // Edge state simulation
  const [previewState, setPreviewState] = useState<AnalyticsDataState>('default');

  // Dialog modals
  const [isCalcInfoOpen, setIsCalcInfoOpen] = useState<boolean>(false);
  const [isRoiOpen, setIsRoiOpen] = useState<boolean>(false);

  // Handle preview state changes with realistic feedback
  const handleStateChange = (nextState: AnalyticsDataState) => {
    setPreviewState(nextState);

    if (nextState === 'exporting') {
      toast.loading('Generating loyalty analytics export...', { id: 'analytics-export' });
    } else if (nextState === 'export_successful') {
      toast.dismiss('analytics-export');
      toast.success('Analytics CSV export downloaded successfully');
    } else if (nextState === 'export_failed') {
      toast.dismiss('analytics-export');
      toast.error('Export generation timed out. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#0a0a0a] pb-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Global Header */}
        <AnalyticsHeader
          activeTab={activeTab}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          tierFilter={tierFilter}
          onTierFilterChange={setTierFilter}
          storeName={storeName}
          onStoreChange={setStoreName}
        />

        {/* Status / Edge State Banners */}
        {previewState === 'sync_delayed' && (
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-900 shadow-2xs">
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-amber-600 shrink-0" />
              <span>
                <strong>Data sync is delayed:</strong> Warehouse data sync is currently 4 hours behind schedule. Metrics reflect store activity up to 2:40 AM today.
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleStateChange('default')}
              className="text-amber-800 hover:text-amber-950 font-semibold underline underline-offset-2 shrink-0 ml-4"
            >
              Dismiss
            </button>
          </div>
        )}

        {previewState === 'data_unavailable' && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-xs text-rose-900 shadow-2xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="size-4 text-rose-600 shrink-0" />
              <span>
                <strong>Upstream reporting degraded:</strong> Several data providers are experiencing delays. Certain order correlation figures may temporarily be unavailable.
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleStateChange('default')}
              className="text-rose-800 hover:text-rose-950 font-semibold underline underline-offset-2 shrink-0 ml-4"
            >
              Retry connection
            </button>
          </div>
        )}

        {previewState === 'partial_data' && (
          <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-xs text-blue-900 shadow-2xs">
            <div className="flex items-center gap-2">
              <RefreshCw className="size-4 text-blue-600 animate-spin shrink-0" />
              <span>
                <strong>Historical data backfill in progress:</strong> 65% of historical Shopify customer records have been indexed. Trend metrics prior to June 2026 are still finalizing.
              </span>
            </div>
            <span className="text-[11px] text-blue-700 font-medium">ETA ~12 min</span>
          </div>
        )}

        {/* Tab Navigation */}
        <AnalyticsTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onOpenRoi={() => setIsRoiOpen(true)}
        />

        {/* Main Content Area */}
        {previewState === 'loading' ||
        previewState === 'empty' ||
        previewState === 'no_filter_results' ? (
          <EmptyAnalyticsState
            state={previewState}
            onResetFilters={() => {
              setTierFilter('All tiers');
              setDateRange('Last 30 days');
              setPreviewState('default');
            }}
            onRetry={() => setPreviewState('default')}
          />
        ) : (
          // Active Reporting Tab Views
          <div className="transition-all">
            {activeTab === 'overview' && (
              <OverviewTab
                onOpenCalculationInfo={() => setIsCalcInfoOpen(true)}
                onNavigateToTab={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'retention' && (
              <RetentionTab
                onOpenCalculationInfo={() => setIsCalcInfoOpen(true)}
              />
            )}

            {activeTab === 'members' && (
              <MembersTab
                onOpenCalculationInfo={() => setIsCalcInfoOpen(true)}
              />
            )}

            {activeTab === 'points' && (
              <PointsTab
                onOpenCalculationInfo={() => setIsCalcInfoOpen(true)}
              />
            )}

            {activeTab === 'rewards' && (
              <RewardsTab
                onOpenCalculationInfo={() => setIsCalcInfoOpen(true)}
              />
            )}
          </div>
        )}
      </div>

      {/* Secondary Calculation & ROI Modals */}
      <CalculationInfoDialog
        isOpen={isCalcInfoOpen}
        onClose={() => setIsCalcInfoOpen(false)}
      />

      <ProgramRoiDialog
        isOpen={isRoiOpen}
        onClose={() => setIsRoiOpen(false)}
      />

      {/* Floating Interactive Prototype Switcher */}
      <PreviewStateSwitcher
        currentTab={activeTab}
        currentState={previewState}
        onTabChange={setActiveTab}
        onStateChange={handleStateChange}
      />
    </div>
  );
}

export default AnalyticsV2Module;

