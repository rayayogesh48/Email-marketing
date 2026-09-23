"use client";

import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Clock,
  Info,
  PlugZap,
  RefreshCw,
  RotateCcw,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function LoadingSkeleton() {
  return (
    <div className="analytics-loading-grid" aria-busy="true" aria-live="polite">
      {/* Summary Skeleton */}
      <div className="analytics-summary-skeleton">
        <div className="skeleton-bar h-5 w-48 mb-2" />
        <div className="skeleton-bar h-4 w-96" />
      </div>

      {/* KPI Skeletons */}
      <div className="stats-grid">
        {[1, 2, 3, 4, 5].map((i) => (
          <div className="stat-card stat-skeleton" key={i}>
            <div className="skeleton-bar h-3 w-28 mb-3" />
            <div className="skeleton-bar h-7 w-20 mb-3" />
            <div className="skeleton-bar h-3 w-36" />
          </div>
        ))}
      </div>

      {/* Charts Skeletons */}
      <div className="analytics-charts-grid">
        <div className="chart-card chart-skeleton">
          <div className="skeleton-bar h-4 w-40 mb-2" />
          <div className="skeleton-bar h-3 w-64 mb-6" />
          <div className="skeleton-box h-60 w-full" />
        </div>
        <div className="chart-card chart-skeleton">
          <div className="skeleton-bar h-4 w-40 mb-2" />
          <div className="skeleton-bar h-3 w-64 mb-6" />
          <div className="skeleton-box h-60 w-full" />
        </div>
      </div>
    </div>
  );
}

export function LowDataBanner() {
  return (
    <div className="analytics-banner banner-info" role="status">
      <div className="banner-icon">
        <Sparkles size={16} />
      </div>
      <div className="banner-body">
        <strong>Early insights</strong>
        <p>
          These results are based on limited activity and may change as more
          customer data becomes available.
        </p>
      </div>
    </div>
  );
}

export function StaleDataBanner({
  onRefresh,
  onViewIntegration,
}: {
  onRefresh?: () => void;
  onViewIntegration?: () => void;
}) {
  return (
    <div className="analytics-banner banner-warning" role="status">
      <div className="banner-icon">
        <Clock size={16} />
      </div>
      <div className="banner-body">
        <strong>Analytics may be outdated</strong>
        <p>
          The latest store data has not finished syncing. These results were last
          updated 6 hours ago.
        </p>
      </div>
      <div className="banner-actions">
        {onRefresh && (
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw size={13} className="mr-1" /> Refresh
          </Button>
        )}
        {onViewIntegration && (
          <Button variant="ghost" size="sm" onClick={onViewIntegration}>
            View integration
          </Button>
        )}
      </div>
    </div>
  );
}

export function PartialDataBanner({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="analytics-banner banner-warning" role="status">
      <div className="banner-icon">
        <AlertTriangle size={16} />
      </div>
      <div className="banner-body">
        <strong>Some data is unavailable</strong>
        <p>
          Points and customer activity are available, but recent order data could
          not be loaded.
        </p>
      </div>
      {onRetry && (
        <div className="banner-actions">
          <Button variant="outline" size="sm" onClick={onRetry}>
            <RotateCcw size={13} className="mr-1" /> Try again
          </Button>
        </div>
      )}
    </div>
  );
}

export function SectionErrorCard({
  title = "Couldn’t load this report",
  onRetry,
}: {
  title?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="chart-card section-error-card" role="alert">
      <div className="section-error-content">
        <div className="error-icon-bubble">
          <AlertCircle size={22} />
        </div>
        <h3>{title}</h3>
        <p className="muted text-xs max-w-sm">
          There was an issue processing the data for this section. Your other
          reports are unaffected.
        </p>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry} className="mt-3">
            <RotateCcw size={13} className="mr-1" /> Try again
          </Button>
        )}
      </div>
    </div>
  );
}

export function FirstDayEmptyState({
  onViewCustomers,
  onCreateEarningRule,
}: {
  onViewCustomers?: () => void;
  onCreateEarningRule?: () => void;
}) {
  return (
    <div className="analytics-empty-card" role="region" aria-label="First day analytics">
      <div className="empty-icon-bubble">
        <Sparkles size={28} />
      </div>
      <h2>Analytics are being prepared</h2>
      <p>
        We’ll start showing insights after your store receives loyalty and order
        activity.
      </p>
      <div className="empty-actions">
        {onViewCustomers && (
          <Button variant="outline" size="sm" onClick={onViewCustomers}>
            View customers
          </Button>
        )}
        {onCreateEarningRule && (
          <Button size="sm" onClick={onCreateEarningRule}>
            Create earning rule <ArrowRight size={14} className="ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
}

export function NoActivityEmptyState({
  onSelect90Days,
  onChangeRange,
}: {
  onSelect90Days?: () => void;
  onChangeRange?: () => void;
}) {
  return (
    <div className="analytics-empty-card" role="region" aria-label="No activity">
      <div className="empty-icon-bubble">
        <Clock size={28} />
      </div>
      <h2>No activity during this period</h2>
      <p>Try a wider date range to see loyalty activity.</p>
      <div className="empty-actions">
        {onSelect90Days && (
          <Button size="sm" onClick={onSelect90Days}>
            Last 90 days
          </Button>
        )}
        {onChangeRange && (
          <Button variant="outline" size="sm" onClick={onChangeRange}>
            Change date range
          </Button>
        )}
      </div>
    </div>
  );
}

export function NoFilterResultsEmptyState({
  onClearFilters,
}: {
  onClearFilters?: () => void;
}) {
  return (
    <div className="analytics-empty-card" role="region" aria-label="No matching analytics">
      <div className="empty-icon-bubble">
        <Info size={28} />
      </div>
      <h2>No matching analytics</h2>
      <p>No data matches the selected filters.</p>
      {onClearFilters && (
        <div className="empty-actions">
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}

export function StoreDisconnectedState({
  storeName,
  onReconnect,
}: {
  storeName: string;
  onReconnect?: () => void;
}) {
  return (
    <div className="analytics-full-state" role="alert">
      <div className="state-icon-bubble warning">
        <PlugZap size={32} />
      </div>
      <h2>Reconnect your store to view analytics</h2>
      <p>
        Reloopin cannot update customer, order, or loyalty performance while{" "}
        <strong>{storeName}</strong> is disconnected.
      </p>
      {onReconnect && (
        <div className="state-action">
          <Button onClick={onReconnect}>Reconnect store</Button>
        </div>
      )}
    </div>
  );
}

export function PageErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="analytics-full-state" role="alert">
      <div className="state-icon-bubble danger">
        <AlertCircle size={32} />
      </div>
      <h2>Analytics could not be loaded</h2>
      <p>We couldn’t retrieve your analytics. Try refreshing the page.</p>
      {onRetry && (
        <div className="state-action">
          <Button onClick={onRetry}>
            <RotateCcw size={14} className="mr-1" /> Try again
          </Button>
        </div>
      )}
    </div>
  );
}

export function RestrictedAccessState({
  onBackToDashboard,
}: {
  onBackToDashboard?: () => void;
}) {
  return (
    <div className="analytics-full-state" role="alert">
      <div className="state-icon-bubble">
        <ShieldAlert size={32} />
      </div>
      <h2>You don’t have access to Analytics</h2>
      <p>Ask the account owner or administrator for Analytics permission.</p>
      {onBackToDashboard && (
        <div className="state-action">
          <Button variant="outline" onClick={onBackToDashboard}>
            Back to dashboard
          </Button>
        </div>
      )}
    </div>
  );
}

export function ROIUnavailableCard({
  onReviewSettings,
}: {
  onReviewSettings?: () => void;
}) {
  return (
    <div className="chart-card roi-unavailable-card" role="region" aria-label="ROI unavailable">
      <div className="roi-unavailable-header">
        <div className="empty-icon-bubble">
          <Info size={24} />
        </div>
        <div>
          <h3>Program ROI is not available yet</h3>
          <p className="muted text-xs mt-1">
            We need more order and loyalty activity before estimating the
            program’s financial impact.
          </p>
        </div>
      </div>

      <div className="roi-checklist">
        <h4>Requirements</h4>
        <ul>
          <li className="met">
            <span className="check-dot met" /> Connected store
          </li>
          <li className="unmet">
            <span className="check-dot unmet" /> At least 30 days of order data
          </li>
          <li className="unmet">
            <span className="check-dot unmet" /> Loyalty member orders
          </li>
          <li className="unmet">
            <span className="check-dot unmet" /> Non-member comparison data
          </li>
          <li className="met">
            <span className="check-dot met" /> Point value configured
          </li>
        </ul>
      </div>

      {onReviewSettings && (
        <div className="mt-4">
          <Button variant="outline" size="sm" onClick={onReviewSettings}>
            Review loyalty settings
          </Button>
        </div>
      )}
    </div>
  );
}
