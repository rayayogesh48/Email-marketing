"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  DashboardDateRange,
  DashboardKPICard,
  DashboardPointsDataPoint,
  DashboardPrototypeState,
  DashboardRecentActivityItem,
  DashboardRewardItem,
  DashboardVIPTierItem,
} from "@/lib/dashboard/dashboard-types";
import {
  DASHBOARD_STORES,
  getDashboardFixture,
} from "@/lib/dashboard/dashboard-data";
import { DashboardHeader } from "./dashboard-header";
import { ProgramSummary } from "./program-summary";
import { ActionRequired } from "./action-required";
import { MetricCard } from "./metric-card";
import { PointsActivityCard } from "./points-activity-card";
import { ProgramValueCard } from "./program-value-card";
import { VIPTierOverview } from "./vip-tier-overview";
import { PopularRewards } from "./popular-rewards";
import { RecentActivity } from "./recent-activity";
import { QuickActions } from "./quick-actions";
import { FirstRunDashboard } from "./first-run-dashboard";
import {
  DashboardSkeletons,
  NoLoyaltyActivityBanner,
  OnboardingIncompleteBanner,
  PageErrorState,
  RestrictedAccessState,
  SectionErrorCard,
  StaleDataBanner,
  StoreDisconnectedState,
} from "./dashboard-states";
import {
  ActivityDetailSheet,
  AllActivitySheet,
  AllAlertsSheet,
  MetricDetailSheet,
  PointsDateDetailSheet,
  RewardDetailSheet,
  ROIMethodologySheet,
  VIPTierDetailSheet,
} from "./dashboard-detail-sheets";

import { DashboardTour } from "@/components/onboarding/dashboard-tour";

export function MerchantDashboard({
  initialStore = "northstar",
}: {
  initialStore?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  // Read URL params or fallback as single source of truth
  const currentStoreSlug = searchParams.get("store") || initialStore;
  const dateRange = (searchParams.get("range") as DashboardDateRange) || "30d";
  const prototypeState =
    (searchParams.get("state") as DashboardPrototypeState) || "default";
  const tourParam = searchParams.get("tour") === "true";
  const [showTour, setShowTour] = useState(tourParam);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSwitchingStore, setIsSwitchingStore] = useState(false);
  const [switchingTargetName, setSwitchingTargetName] = useState("");

  // Sheet Modal states
  const [selectedMetric, setSelectedMetric] = useState<DashboardKPICard | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<DashboardPointsDataPoint | null>(null);
  const [showMethodology, setShowMethodology] = useState(false);
  const [selectedTier, setSelectedTier] = useState<DashboardVIPTierItem | null>(null);
  const [selectedReward, setSelectedReward] = useState<DashboardRewardItem | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<DashboardRecentActivityItem | null>(null);
  const [showAllAlerts, setShowAllAlerts] = useState(false);
  const [showAllActivity, setShowAllActivity] = useState(false);

  const updateUrl = (
    newStore: string,
    newRange: DashboardDateRange,
    newState: DashboardPrototypeState,
  ) => {
    const params = new URLSearchParams();
    if (newStore && newStore !== "northstar" && newStore !== "northstar-goods") {
      params.set("store", newStore);
    }
    if (newRange && newRange !== "30d") {
      params.set("range", newRange);
    }
    if (newState && newState !== "default") {
      params.set("state", newState);
    }
    const query = params.toString();
    startTransition(() => {
      router.replace(query ? `/dashboard?${query}` : "/dashboard");
    });
  };

  const handleDateRangeChange = (range: DashboardDateRange) => {
    updateUrl(currentStoreSlug, range, prototypeState);
    toast.success(`Date range updated to ${range}`);
  };

  const handlePrototypeStateChange = (state: DashboardPrototypeState) => {
    updateUrl(currentStoreSlug, dateRange, state);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Dashboard metrics synchronized.");
    }, 600);
  };

  // Switch store with loading overlay
  const handleSwitchStore = (newStoreSlug: string) => {
    const targetStore =
      DASHBOARD_STORES.find(
        (s) => s.slug === newStoreSlug || s.id === newStoreSlug,
      ) || DASHBOARD_STORES[0];

    setSwitchingTargetName(targetStore.name);
    setIsSwitchingStore(true);

    setTimeout(() => {
      setIsSwitchingStore(false);
      updateUrl(targetStore.slug, dateRange, prototypeState);
      toast.success(`Switched store to ${targetStore.name}`);
    }, 450);
  };

  // Retrieve current fixture
  const fixture = getDashboardFixture(
    currentStoreSlug,
    dateRange,
    prototypeState,
  );

  // Full-page states
  if (prototypeState === "loading") {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        <DashboardHeader
          currentStoreSlug={currentStoreSlug}
          onSwitchStore={handleSwitchStore}
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
          freshnessLabel="Syncing data..."
          prototypeState={prototypeState}
          onPrototypeStateChange={handlePrototypeStateChange}
          onRefresh={handleRefresh}
          isRefreshing={true}
        />
        <DashboardSkeletons />
      </div>
    );
  }

  if (prototypeState === "disconnected") {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <DashboardHeader
          currentStoreSlug={currentStoreSlug}
          onSwitchStore={handleSwitchStore}
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
          freshnessLabel="Disconnected"
          prototypeState={prototypeState}
          onPrototypeStateChange={handlePrototypeStateChange}
          onRefresh={handleRefresh}
          isRefreshing={false}
        />
        <StoreDisconnectedState
          storeName={fixture.store.name}
          onReconnect={() => handlePrototypeStateChange("default")}
        />
      </div>
    );
  }

  if (prototypeState === "page_error") {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <DashboardHeader
          currentStoreSlug={currentStoreSlug}
          onSwitchStore={handleSwitchStore}
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
          freshnessLabel="Error loading"
          prototypeState={prototypeState}
          onPrototypeStateChange={handlePrototypeStateChange}
          onRefresh={handleRefresh}
          isRefreshing={false}
        />
        <PageErrorState
          onRetry={() => handlePrototypeStateChange("default")}
        />
      </div>
    );
  }

  if (prototypeState === "restricted") {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <DashboardHeader
          currentStoreSlug={currentStoreSlug}
          onSwitchStore={handleSwitchStore}
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
          freshnessLabel="Restricted"
          prototypeState={prototypeState}
          onPrototypeStateChange={handlePrototypeStateChange}
          onRefresh={handleRefresh}
          isRefreshing={false}
        />
        <RestrictedAccessState />
      </div>
    );
  }

  return (
    <div className="relative p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Store switching subtle overlay */}
      {(isSwitchingStore || prototypeState === "store_switching") && (
        <div className="fixed inset-0 z-50 bg-[var(--overlay)] backdrop-blur-xs flex items-center justify-center animate-in fade-in duration-150">
          <div className="p-5 rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-xl flex items-center gap-3 text-sm font-semibold text-[var(--foreground)]">
            <span className="w-4 h-4 rounded-full border-2 border-[var(--primary)] border-t-transparent animate-spin" />
            <span>Switching to {switchingTargetName || "Urban Goods"}...</span>
          </div>
        </div>
      )}

      {/* 1. Header & Controls */}
      <DashboardHeader
        currentStoreSlug={currentStoreSlug}
        onSwitchStore={handleSwitchStore}
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
        freshnessLabel={fixture.freshnessLabel}
        prototypeState={prototypeState}
        onPrototypeStateChange={handlePrototypeStateChange}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* State-specific Banners */}
      {prototypeState === "onboarding_incomplete" && (
        <OnboardingIncompleteBanner
          onContinueSetup={() => router.push("/onboarding")}
        />
      )}

      {prototypeState === "stale_data" && (
        <StaleDataBanner onRefresh={handleRefresh} />
      )}

      {prototypeState === "no_activity" && (
        <NoLoyaltyActivityBanner
          onExpandRange={() => handleDateRangeChange("90d")}
        />
      )}

      {/* First-Run Dashboard View */}
      {prototypeState === "first_run" ? (
        <FirstRunDashboard
          checklist={fixture.setupChecklist}
          onStepAction={(stepId) => {
            toast.info(`Configuring step ${stepId}`);
          }}
          onExploreDashboard={() => handlePrototypeStateChange("default")}
        />
      ) : (
        /* Standard Operational Dashboard Content */
        <div className="space-y-6">
          {/* 2. Program Summary */}
          <ProgramSummary
            summary={fixture.summary}
            onOpenMethodology={() => setShowMethodology(true)}
          />

          {/* 3. Action Required (only when alerts exist) */}
          <ActionRequired
            alerts={fixture.alerts}
            onOpenAllAlerts={() => setShowAllAlerts(true)}
            onActionClick={(alert) => {
              if (alert.actionHref) {
                router.push(alert.actionHref);
              } else {
                toast.info(`Action triggered: ${alert.actionLabel}`);
              }
            }}
          />

          {/* 4. Main KPI Cards (4 cards) */}
          <section aria-label="Key Performance Indicators">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                card={fixture.kpis.activeMembers}
                onOpenSheet={setSelectedMetric}
              />
              <MetricCard
                card={fixture.kpis.pointsOutstanding}
                onOpenSheet={setSelectedMetric}
              />
              <MetricCard
                card={fixture.kpis.redemptionRate}
                onOpenSheet={setSelectedMetric}
              />
              <MetricCard
                card={fixture.kpis.repeatLift}
                onOpenSheet={setSelectedMetric}
              />
            </div>
          </section>

          {/* 5. Points activity and Program value (2-column layout) */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6" aria-label="Points and program value">
            {prototypeState === "partial_error" ? (
              <SectionErrorCard
                onRetry={() => handlePrototypeStateChange("default")}
              />
            ) : (
              <PointsActivityCard
                activity={fixture.pointsActivity}
                onOpenDateSheet={setSelectedPoint}
                onViewAllActivity={() => setShowAllActivity(true)}
              />
            )}

            <ProgramValueCard
              programValue={fixture.programValue}
              onOpenMethodology={() => setShowMethodology(true)}
            />
          </section>

          {/* 6. VIP tier overview and Popular rewards (2-column layout) */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6" aria-label="Tiers and rewards">
            <VIPTierOverview
              overview={fixture.vipTiers}
              onOpenTierSheet={setSelectedTier}
            />

            <PopularRewards
              rewards={fixture.popularRewards.rewards}
              hasRewards={fixture.popularRewards.hasRewards}
              onOpenRewardSheet={setSelectedReward}
              onViewAllRewards={() => router.push("/rewards")}
            />
          </section>

          {/* 7. Recent loyalty activity */}
          <RecentActivity
            events={fixture.recentActivity}
            onOpenActivitySheet={setSelectedActivity}
            onViewAllActivity={() => setShowAllActivity(true)}
          />

          {/* 8. Quick actions */}
          <QuickActions
            onActionClick={(actionId) => {
              switch (actionId) {
                case "create_earning_rule":
                  toast.success("Opening earning rule configuration");
                  break;
                case "create_reward":
                  toast.success("Opening reward creator");
                  break;
                case "add_customer":
                  toast.success("Opening manual customer enrollment");
                  break;
                case "create_campaign":
                  router.push("/?tab=Campaigns");
                  break;
                case "import_customers":
                  toast.success("Opening customer CSV importer");
                  break;
                default:
                  break;
              }
            }}
          />
        </div>
      )}

      {/* Slide-over Detail Sheets */}
      <MetricDetailSheet
        card={selectedMetric}
        open={!!selectedMetric}
        onClose={() => setSelectedMetric(null)}
      />

      <PointsDateDetailSheet
        point={selectedPoint}
        open={!!selectedPoint}
        onClose={() => setSelectedPoint(null)}
      />

      <ROIMethodologySheet
        open={showMethodology}
        onClose={() => setShowMethodology(false)}
      />

      <VIPTierDetailSheet
        tier={selectedTier}
        open={!!selectedTier}
        onClose={() => setSelectedTier(null)}
      />

      <RewardDetailSheet
        reward={selectedReward}
        open={!!selectedReward}
        onClose={() => setSelectedReward(null)}
      />

      <ActivityDetailSheet
        event={selectedActivity}
        open={!!selectedActivity}
        onClose={() => setSelectedActivity(null)}
      />

      <AllAlertsSheet
        alerts={fixture.alerts}
        open={showAllAlerts}
        onClose={() => setShowAllAlerts(false)}
        onDismissAlert={(id) => {
          toast.info(`Alert ${id} dismissed.`);
        }}
      />

      <AllActivitySheet
        events={fixture.recentActivity}
        open={showAllActivity}
        onClose={() => setShowAllActivity(false)}
        onSelectEvent={(evt) => setSelectedActivity(evt)}
      />

      <DashboardTour
        open={showTour}
        onClose={() => {
          setShowTour(false);
          const params = new URLSearchParams(searchParams.toString());
          params.delete("tour");
          const q = params.toString();
          router.replace(q ? `/dashboard?${q}` : "/dashboard");
        }}
      />
    </div>
  );
}
