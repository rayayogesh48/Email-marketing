"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  BillingTab,
  BillingPlanId,
  PaymentMethod,
} from "@/lib/billing/billing-types";
import { useBillingStore, billingStore } from "@/lib/billing/billing-store";
import { BillingPageHeader } from "./billing-page-header";
import { CurrentPlanCard } from "./current-plan-card";
import { UsageSection } from "./usage-section";
import { PlansTab } from "./plans-tab";
import { PaymentMethodsTab } from "./payment-methods-tab";
import { InvoicesTab } from "./invoices-tab";
import { FailedPaymentBanner } from "./failed-payment-banner";
import { DangerZone } from "./danger-zone";
import { UpgradeDialog } from "./upgrade-dialog";
import { DowngradeDialog } from "./downgrade-dialog";
import { CancelSubscriptionDialog } from "./cancel-subscription-dialog";
import { ReactivateSubscriptionDialog } from "./reactivate-subscription-dialog";
import { PaymentMethodDialog } from "./payment-method-dialog";
import { InvoiceDetailDrawer } from "./invoice-detail-drawer";
import { PreviewStatesDrawer } from "./preview-states-drawer";
import { BillingSkeleton, BillingErrorState } from "./billing-states";
import { toast } from "sonner";

export function BillingModule({
  initialTab = "overview",
}: {
  initialTab?: BillingTab;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const store = useBillingStore();

  const tabQuery = searchParams.get("tab") as BillingTab | null;
  const stateQuery = searchParams.get("state");

  // Keep tab in sync with URL
  useEffect(() => {
    if (
      tabQuery &&
      ["overview", "plans", "payment-methods", "invoices"].includes(tabQuery)
    ) {
      if (tabQuery !== store.activeTab) {
        billingStore.setActiveTab(tabQuery);
      }
    }
  }, [tabQuery, store.activeTab]);

  // Keep state in sync if provided via query param
  useEffect(() => {
    if (stateQuery && stateQuery !== store.previewState) {
      billingStore.setPreviewState(stateQuery as any);
    }
  }, [stateQuery, store.previewState]);

  const handleTabChange = (tab: BillingTab) => {
    billingStore.setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`/settings/billing?${params.toString()}`, { scroll: false });
  };

  const currentPlan =
    store.plans.find((p) => p.id === store.subscription.planId) ||
    store.plans[1];

  const targetUpgradePlan =
    store.plans.find((p) => p.id === store.upgradeTargetPlanId) ||
    store.plans[2];

  const targetDowngradePlan =
    store.plans.find((p) => p.id === store.downgradeTargetPlanId) ||
    store.plans[0];

  const [selectedMethodToUpdate, setSelectedMethodToUpdate] =
    useState<PaymentMethod | null>(null);

  if (store.dataState === "loading") {
    return <BillingSkeleton />;
  }

  if (store.dataState === "error") {
    return (
      <BillingErrorState
        onRetry={() => {
          billingStore.setDataState("default");
          toast.success("Billing details reloaded.");
        }}
      />
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto py-4 px-4 sm:px-6">
      {/* Page Header */}
      <BillingPageHeader
        activeTab={store.activeTab}
        onTabChange={handleTabChange}
        onViewPlans={() => handleTabChange("plans")}
        permission={store.permission}
      />

      {/* Failed Payment & Grace Period Banner */}
      <FailedPaymentBanner
        subscription={store.subscription}
        permission={store.permission}
        gracePeriodEndsAt={store.gracePeriodEndsAt}
        isRetrying={store.isRetryingPayment}
        onRetryPayment={async () => {
          const success = await billingStore.retryPayment();
          if (success) {
            toast.success("Payment completed. Your Growth plan is active.");
          }
        }}
        onUpdatePaymentMethod={() => {
          billingStore.openPaymentMethodModal("update");
        }}
      />

      {/* TAB CONTENT */}
      {store.activeTab === "overview" && (
        <div className="space-y-8">
          <CurrentPlanCard
            plan={currentPlan}
            subscription={store.subscription}
            permission={store.permission}
            onChangePlan={() => handleTabChange("plans")}
            onReactivate={() => billingStore.openReactivateModal()}
            onCancelScheduledDowngrade={() => {
              billingStore.cancelScheduledDowngrade();
              toast.success("Scheduled downgrade cancelled. Growth plan maintained.");
            }}
            onManageSubscription={() => {
              const el = document.getElementById("danger-zone");
              if (el) el.scrollIntoView({ behavior: "smooth" });
              else handleTabChange("plans");
            }}
          />

          <UsageSection
            metrics={store.usageMetrics}
            permission={store.permission}
            onComparePlans={() => handleTabChange("plans")}
            onUpgradePlan={() => {
              handleTabChange("plans");
            }}
          />

          <div id="danger-zone">
            <DangerZone
              plan={currentPlan}
              subscription={store.subscription}
              permission={store.permission}
              onOpenCancelModal={() => billingStore.openCancelModal()}
              onOpenReactivateModal={() => billingStore.openReactivateModal()}
            />
          </div>
        </div>
      )}

      {store.activeTab === "plans" && (
        <PlansTab
          plans={store.plans}
          subscription={store.subscription}
          permission={store.permission}
          onSelectUpgrade={(planId) => billingStore.openUpgradeModal(planId)}
          onSelectDowngrade={(planId) => billingStore.openDowngradeModal(planId)}
        />
      )}

      {store.activeTab === "payment-methods" && (
        <PaymentMethodsTab
          paymentMethods={store.paymentMethods}
          subscription={store.subscription}
          permission={store.permission}
          onOpenAddCard={() => {
            setSelectedMethodToUpdate(null);
            billingStore.openPaymentMethodModal("add");
          }}
          onOpenUpdateCard={(pm) => {
            setSelectedMethodToUpdate(pm);
            billingStore.openPaymentMethodModal("update");
          }}
          onRemoveCard={(id) => {
            billingStore.removePaymentMethod(id);
          }}
          blockedRemovalOpen={store.blockedRemovalModalOpen}
          onCloseBlockedRemoval={() => billingStore.closeBlockedRemovalModal()}
        />
      )}

      {store.activeTab === "invoices" && (
        <InvoicesTab
          invoices={store.invoices}
          permission={store.permission}
          onViewInvoice={(inv) => billingStore.openInvoiceDrawer(inv)}
        />
      )}

      {/* MODALS & DRAWERS */}
      {store.upgradeModalOpen && (
        <UpgradeDialog
          open={store.upgradeModalOpen}
          onClose={() => billingStore.closeUpgradeModal()}
          currentPlan={currentPlan}
          targetPlan={targetUpgradePlan}
          subscription={store.subscription}
          paymentMethods={store.paymentMethods}
          onConfirmUpgrade={(planId) => billingStore.performUpgrade(planId)}
          onOpenAddPaymentMethod={() => {
            billingStore.closeUpgradeModal();
            billingStore.openPaymentMethodModal("add");
          }}
          onViewOverview={() => handleTabChange("overview")}
        />
      )}

      {store.downgradeModalOpen && (
        <DowngradeDialog
          open={store.downgradeModalOpen}
          onClose={() => billingStore.closeDowngradeModal()}
          currentPlan={currentPlan}
          targetPlan={targetDowngradePlan}
          subscription={store.subscription}
          metrics={store.usageMetrics}
          onScheduleDowngrade={(planId) => billingStore.scheduleDowngrade(planId)}
        />
      )}

      {store.cancelModalOpen && (
        <CancelSubscriptionDialog
          open={store.cancelModalOpen}
          onClose={() => billingStore.closeCancelModal()}
          plan={currentPlan}
          subscription={store.subscription}
          metrics={store.usageMetrics}
          onConfirmCancel={(reason) => billingStore.confirmCancellation(reason)}
        />
      )}

      {store.reactivateModalOpen && (
        <ReactivateSubscriptionDialog
          open={store.reactivateModalOpen}
          onClose={() => billingStore.closeReactivateModal()}
          plan={currentPlan}
          subscription={store.subscription}
          onConfirmReactivate={() => billingStore.confirmReactivation()}
        />
      )}

      {store.paymentMethodModalOpen && (
        <PaymentMethodDialog
          open={store.paymentMethodModalOpen}
          onClose={() => billingStore.closePaymentMethodModal()}
          mode={store.paymentMethodModalMode}
          existingMethod={selectedMethodToUpdate}
          onSave={(card) => billingStore.savePaymentMethod(card)}
        />
      )}

      {store.invoiceDrawerOpen && (
        <InvoiceDetailDrawer
          open={store.invoiceDrawerOpen}
          onClose={() => billingStore.closeInvoiceDrawer()}
          invoice={store.selectedInvoiceForDetail}
        />
      )}

      {/* Floating Developer Preview States Controller */}
      <PreviewStatesDrawer
        store={store}
        onOpenUpgrade={(pid) => billingStore.openUpgradeModal(pid)}
        onOpenDowngrade={(pid) => billingStore.openDowngradeModal(pid)}
        onOpenCancel={() => billingStore.openCancelModal()}
        onOpenReactivate={() => billingStore.openReactivateModal()}
        onOpenAddPayment={() => billingStore.openPaymentMethodModal("add")}
      />
    </div>
  );
}
