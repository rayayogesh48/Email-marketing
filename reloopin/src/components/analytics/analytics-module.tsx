"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ComparisonOption,
  DateRangeOption,
  getCentralizedAnalyticsFixture,
  PrototypeState,
} from "@/lib/analytics-data";
import { AnalyticsHeader } from "./analytics-header";
import { AnalyticsTabId } from "./analytics-tabs";
import { LoyaltyTab } from "./loyalty-tab";
import { VIPTab } from "./vip-tab";
import { ROITab } from "./roi-tab";
import {
  AnalyticsDetailSheet,
  DetailSheetData,
} from "./analytics-detail-sheet";
import { ExportAnalyticsDialog } from "./export-dialog";
import {
  FirstDayEmptyState,
  LoadingSkeleton,
  LowDataBanner,
  NoActivityEmptyState,
  NoFilterResultsEmptyState,
  PageErrorState,
  PartialDataBanner,
  RestrictedAccessState,
  StaleDataBanner,
  StoreDisconnectedState,
} from "./analytics-states";
import { toast } from "sonner";

export function AnalyticsModule({ store = "northstar" }: { store?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL state synchronization
  const initialTab = (searchParams.get("tab") as AnalyticsTabId) || "loyalty";
  const initialState = (searchParams.get("state") as PrototypeState) || "default";
  const initialRange = (searchParams.get("range") as DateRangeOption) || "30d";
  const initialCompare =
    (searchParams.get("compare") as ComparisonOption) || "previous_period";

  const [activeTab, setActiveTab] = useState<AnalyticsTabId>(initialTab);
  const [prototypeState, setPrototypeState] =
    useState<PrototypeState>(initialState);
  const [dateRange, setDateRange] = useState<DateRangeOption>(initialRange);
  const [comparison, setComparison] = useState<ComparisonOption>(initialCompare);

  const [exportOpen, setExportOpen] = useState(
    initialState === "exporting" || initialState === "export_failed"
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeSheet, setActiveSheet] = useState<DetailSheetData | null>(null);

  // Synchronize state changes with URL query parameters
  const updateQueryParams = (params: {
    tab?: AnalyticsTabId;
    state?: PrototypeState;
    range?: DateRangeOption;
    compare?: ComparisonOption;
  }) => {
    const nextTab = params.tab !== undefined ? params.tab : activeTab;
    const nextState = params.state !== undefined ? params.state : prototypeState;
    const nextRange = params.range !== undefined ? params.range : dateRange;
    const nextCompare = params.compare !== undefined ? params.compare : comparison;

    const urlParams = new URLSearchParams();
    if (nextTab) urlParams.set("tab", nextTab);
    if (nextState && nextState !== "default") urlParams.set("state", nextState);
    if (nextRange && nextRange !== "30d") urlParams.set("range", nextRange);
    if (nextCompare && nextCompare !== "previous_period")
      urlParams.set("compare", nextCompare);

    router.replace(`/analytics?${urlParams.toString()}`);
  };

  const handleTabChange = (tab: AnalyticsTabId) => {
    setActiveTab(tab);
    updateQueryParams({ tab });
  };

  const handleStateChange = (state: PrototypeState) => {
    setPrototypeState(state);
    if (state === "exporting" || state === "export_failed") {
      setExportOpen(true);
    }
    updateQueryParams({ state });
  };

  const handleDateRangeChange = (range: DateRangeOption) => {
    setDateRange(range);
    updateQueryParams({ range });
  };

  const handleComparisonChange = (comp: ComparisonOption) => {
    setComparison(comp);
    updateQueryParams({ compare: comp });
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Analytics refreshed with latest store events.");
    }, 750);
  };

  // Get centralized mock data fixture
  const fixture = getCentralizedAnalyticsFixture(store);

  // Full-page states
  if (prototypeState === "disconnected") {
    return (
      <div className="w-full">
        <AnalyticsHeader
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
          comparison={comparison}
          onComparisonChange={handleComparisonChange}
          comparisonRangeLabel={fixture.comparisonRangeLabel}
          freshnessLabel={fixture.freshnessLabel}
          prototypeState={prototypeState}
          onPrototypeStateChange={handleStateChange}
          onOpenExport={() => setExportOpen(true)}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />
        <StoreDisconnectedState
          storeName={fixture.storeName}
          onReconnect={() => {
            handleStateChange("default");
            toast.success("Store successfully reconnected.");
          }}
        />
      </div>
    );
  }

  if (prototypeState === "page_error") {
    return (
      <div className="w-full">
        <AnalyticsHeader
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
          comparison={comparison}
          onComparisonChange={handleComparisonChange}
          comparisonRangeLabel={fixture.comparisonRangeLabel}
          freshnessLabel={fixture.freshnessLabel}
          prototypeState={prototypeState}
          onPrototypeStateChange={handleStateChange}
          onOpenExport={() => setExportOpen(true)}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />
        <PageErrorState
          onRetry={() => {
            handleStateChange("default");
            toast.success("Analytics loaded successfully.");
          }}
        />
      </div>
    );
  }

  if (prototypeState === "restricted") {
    return (
      <div className="w-full">
        <AnalyticsHeader
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
          comparison={comparison}
          onComparisonChange={handleComparisonChange}
          comparisonRangeLabel={fixture.comparisonRangeLabel}
          freshnessLabel={fixture.freshnessLabel}
          prototypeState={prototypeState}
          onPrototypeStateChange={handleStateChange}
          onOpenExport={() => setExportOpen(true)}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />
        <RestrictedAccessState onBackToDashboard={() => router.push("/")} />
      </div>
    );
  }

  return (
    <div className="w-full pb-16" id={`analytics-panel-${activeTab}`}>
      {/* Header: Tabs on LEFT, Filters on RIGHT */}
      <AnalyticsHeader
        activeTab={activeTab}
        onTabChange={handleTabChange}
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
        comparison={comparison}
        onComparisonChange={handleComparisonChange}
        comparisonRangeLabel={fixture.comparisonRangeLabel}
        freshnessLabel={
          prototypeState === "stale_data"
            ? "Last updated 6 hours ago"
            : fixture.freshnessLabel
        }
        prototypeState={prototypeState}
        onPrototypeStateChange={handleStateChange}
        onOpenExport={() => setExportOpen(true)}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* Global State Banners */}
      {prototypeState === "low_data" && (
        <div className="mb-6">
          <LowDataBanner />
        </div>
      )}

      {prototypeState === "stale_data" && (
        <div className="mb-6">
          <StaleDataBanner
            onRefresh={handleRefresh}
            onViewIntegration={() => router.push("/#settings")}
          />
        </div>
      )}

      {prototypeState === "partial_data" && (
        <div className="mb-6">
          <PartialDataBanner
            onRetry={() => {
              handleStateChange("default");
              toast.success("All store data retrieved.");
            }}
          />
        </div>
      )}

      {/* Body Content according to State & Active Tab */}
      {prototypeState === "loading" ? (
        <LoadingSkeleton />
      ) : prototypeState === "first_day" ? (
        <FirstDayEmptyState
          onViewCustomers={() => router.push("/#customers")}
          onCreateEarningRule={() => router.push("/?tab=Automations")}
        />
      ) : prototypeState === "no_activity" ? (
        <NoActivityEmptyState
          onSelect90Days={() => {
            handleDateRangeChange("90d");
            handleStateChange("default");
          }}
          onChangeRange={() => handleDateRangeChange("90d")}
        />
      ) : prototypeState === "no_filter_results" ? (
        <NoFilterResultsEmptyState
          onClearFilters={() => {
            handleStateChange("default");
            setDateRange("30d");
            setComparison("previous_period");
          }}
        />
      ) : (
        <>
          {activeTab === "loyalty" && (
            <LoyaltyTab
              fixture={fixture}
              onOpenSheet={(data) => setActiveSheet(data)}
              isPartialData={prototypeState === "partial_data"}
              isSectionError={prototypeState === "section_error"}
              onRetrySection={() => {
                handleStateChange("default");
                toast.success("Section reloaded.");
              }}
            />
          )}

          {activeTab === "vip" && (
            <VIPTab
              fixture={fixture}
              onOpenSheet={(data) => setActiveSheet(data)}
              isPartialData={prototypeState === "partial_data"}
              isSectionError={prototypeState === "section_error"}
              onRetrySection={() => {
                handleStateChange("default");
                toast.success("Section reloaded.");
              }}
            />
          )}

          {activeTab === "roi" && (
            <ROITab
              fixture={fixture}
              isRoiUnavailable={prototypeState === "roi_unavailable"}
              onReviewSettings={() => router.push("/#settings")}
              isPartialData={prototypeState === "partial_data"}
              isSectionError={prototypeState === "section_error"}
              onRetrySection={() => {
                handleStateChange("default");
                toast.success("Section reloaded.");
              }}
            />
          )}
        </>
      )}

      {/* Detail Drilldown Sheet */}
      <AnalyticsDetailSheet
        open={activeSheet !== null}
        onClose={() => setActiveSheet(null)}
        data={activeSheet}
      />

      {/* Export Dialog */}
      <ExportAnalyticsDialog
        open={exportOpen}
        onClose={() => {
          setExportOpen(false);
          if (
            prototypeState === "exporting" ||
            prototypeState === "export_failed"
          ) {
            handleStateChange("default");
          }
        }}
        fixture={fixture}
        prototypeState={prototypeState}
      />
    </div>
  );
}
