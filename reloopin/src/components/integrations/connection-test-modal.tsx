"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  ConnectionOutcome,
  ConnectionTestResult,
} from "@/lib/integrations/integrations-types";
import {
  CheckCircle2,
  RefreshCw,
  XCircle,
  ArrowRight,
} from "lucide-react";

function ConnectionTestInner({
  onClose,
  outcome = "success",
  onProceedToReview,
}: {
  onClose: () => void;
  outcome?: ConnectionOutcome;
  onProceedToReview: (result: ConnectionTestResult) => void;
}) {
  const [stage, setStage] = useState<"running" | "completed">("running");
  const [currentCheckIndex, setCurrentCheckIndex] = useState(0);

  const checks = [
    { id: "platform", label: "Platform available" },
    { id: "credentials", label: "Credentials valid" },
    { id: "customers", label: "Customer access" },
    { id: "products", label: "Product access" },
    { id: "orders", label: "Order access" },
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentCheckIndex(1), 300);
    const timer2 = setTimeout(() => setCurrentCheckIndex(2), 650);
    const timer3 = setTimeout(() => setCurrentCheckIndex(3), 1000);
    const timer4 = setTimeout(() => setCurrentCheckIndex(4), 1350);
    const timer5 = setTimeout(() => {
      setCurrentCheckIndex(5);
      setStage("completed");
    }, 1700);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, []);

  const getOutcomeDetails = (): ConnectionTestResult => {
    switch (outcome) {
      case "partial_access":
        return {
          outcome: "partial_access",
          title: "Connection needs attention",
          message:
            "Customer and order data are available, but product data could not be accessed.",
          customerAccess: "available",
          productAccess: "limited",
          orderAccess: "available",
        };
      case "auth_failed":
        return {
          outcome: "auth_failed",
          title: "Credentials were not accepted",
          message:
            "Check the client key and secret, then test the connection again.",
          customerAccess: "unavailable",
          productAccess: "unavailable",
          orderAccess: "unavailable",
        };
      case "url_unavailable":
        return {
          outcome: "url_unavailable",
          title: "Platform URL could not be reached",
          message:
            "Check the URL and make sure the platform is available.",
          customerAccess: "unavailable",
          productAccess: "unavailable",
          orderAccess: "unavailable",
        };
      case "permission_missing":
        return {
          outcome: "permission_missing",
          title: "Additional permission required",
          message:
            "Allow customer and order access before connecting this platform.",
          customerAccess: "limited",
          productAccess: "unavailable",
          orderAccess: "unavailable",
        };
      case "timeout":
        return {
          outcome: "timeout",
          title: "Connection test timed out",
          message: "The platform took too long to respond.",
          customerAccess: "unavailable",
          productAccess: "unavailable",
          orderAccess: "unavailable",
        };
      case "rate_limit":
        return {
          outcome: "rate_limit",
          title: "Too many connection attempts",
          message: "Wait a few minutes before testing again.",
          customerAccess: "unavailable",
          productAccess: "unavailable",
          orderAccess: "unavailable",
        };
      case "success":
      default:
        return {
          outcome: "success",
          title: "Connection successful",
          message:
            "Reloopin can access the data required for this integration.",
          customerAccess: "available",
          productAccess: "available",
          orderAccess: "available",
        };
    }
  };

  const details = getOutcomeDetails();

  return (
    <>
      <div className="py-4 space-y-5">
        {/* Animated Checks List */}
        <div className="space-y-2.5 bg-[var(--muted)]/50 p-4 rounded-xl border border-[var(--border)]">
          {checks.map((check, index) => {
            const isCompleted = stage === "completed" || currentCheckIndex > index;
            const isCurrent = stage === "running" && currentCheckIndex === index;
            const isFailed =
              stage === "completed" &&
              ((outcome === "partial_access" && check.id === "products") ||
                (outcome === "auth_failed" && check.id === "credentials") ||
                (outcome === "url_unavailable" && check.id === "platform") ||
                (outcome === "permission_missing" && check.id === "customers") ||
                outcome === "timeout" ||
                outcome === "rate_limit");

            return (
              <div
                key={check.id}
                className="flex items-center justify-between text-xs py-1"
              >
                <span className="text-[var(--foreground)] font-medium">
                  {check.label}
                </span>

                <div className="flex items-center gap-1.5">
                  {isFailed ? (
                    <span className="inline-flex items-center gap-1 text-[var(--destructive)] font-medium">
                      <XCircle size={14} />
                      Failed
                    </span>
                  ) : isCompleted ? (
                    <span className="inline-flex items-center gap-1 text-[var(--success,#16a34a)] font-medium">
                      <CheckCircle2 size={14} />
                      Verified
                    </span>
                  ) : isCurrent ? (
                    <span className="inline-flex items-center gap-1 text-[var(--primary)] font-medium">
                      <RefreshCw size={13} className="animate-spin" />
                      Checking...
                    </span>
                  ) : (
                    <span className="text-[var(--muted-foreground)]">Waiting</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Results Capability Access Summary (when completed) */}
        {stage === "completed" && (
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
              Data capability results
            </h4>
            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="p-2.5 rounded-lg bg-[var(--card)] border border-[var(--border)]">
                <span className="text-[11px] text-[var(--muted-foreground)] block mb-1">
                  Customers
                </span>
                <span
                  className={`text-xs font-semibold capitalize ${
                    details.customerAccess === "available"
                      ? "text-[var(--success,#16a34a)]"
                      : details.customerAccess === "limited"
                      ? "text-[var(--warning,#d97706)]"
                      : "text-[var(--destructive)]"
                  }`}
                >
                  {details.customerAccess}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[var(--card)] border border-[var(--border)]">
                <span className="text-[11px] text-[var(--muted-foreground)] block mb-1">
                  Products
                </span>
                <span
                  className={`text-xs font-semibold capitalize ${
                    details.productAccess === "available"
                      ? "text-[var(--success,#16a34a)]"
                      : details.productAccess === "limited"
                      ? "text-[var(--warning,#d97706)]"
                      : "text-[var(--destructive)]"
                  }`}
                >
                  {details.productAccess}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[var(--card)] border border-[var(--border)]">
                <span className="text-[11px] text-[var(--muted-foreground)] block mb-1">
                  Orders
                </span>
                <span
                  className={`text-xs font-semibold capitalize ${
                    details.orderAccess === "available"
                      ? "text-[var(--success,#16a34a)]"
                      : details.orderAccess === "limited"
                      ? "text-[var(--warning,#d97706)]"
                      : "text-[var(--destructive)]"
                  }`}
                >
                  {details.orderAccess}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="dialog-actions flex items-center justify-end gap-2.5 pt-4 border-t border-[var(--border)]">
        {stage === "running" ? (
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel test
          </Button>
        ) : details.outcome === "success" ? (
          <Button
            size="sm"
            onClick={() => {
              onProceedToReview(details);
            }}
            className="flex items-center gap-1.5"
            data-testid="continue-to-review-button"
          >
            Continue to review
            <ArrowRight size={14} />
          </Button>
        ) : details.outcome === "partial_access" ? (
          <>
            <Button variant="outline" size="sm" onClick={onClose}>
              Review permissions
            </Button>
            <Button
              size="sm"
              onClick={() => {
                onProceedToReview(details);
              }}
              data-testid="continue-limited-access-button"
            >
              Continue with limited access
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" onClick={onClose}>
              {details.outcome === "auth_failed"
                ? "Review credentials"
                : details.outcome === "permission_missing"
                ? "Review permissions"
                : "Try again"}
            </Button>
          </>
        )}
      </div>
    </>
  );
}

export function ConnectionTestModal({
  open,
  onClose,
  outcome = "success",
  onProceedToReview,
}: {
  open: boolean;
  onClose: () => void;
  outcome?: ConnectionOutcome;
  onProceedToReview: (result: ConnectionTestResult) => void;
}) {
  const getHeader = () => {
    switch (outcome) {
      case "partial_access":
        return {
          title: "Connection needs attention",
          description: "Customer and order data are available, but product data could not be accessed.",
        };
      case "auth_failed":
        return {
          title: "Credentials were not accepted",
          description: "Check the client key and secret, then test the connection again.",
        };
      case "url_unavailable":
        return {
          title: "Platform URL could not be reached",
          description: "Check the URL and make sure the platform is available.",
        };
      case "permission_missing":
        return {
          title: "Additional permission required",
          description: "Allow customer and order access before connecting this platform.",
        };
      case "timeout":
        return {
          title: "Connection test timed out",
          description: "The platform took too long to respond.",
        };
      case "rate_limit":
        return {
          title: "Too many connection attempts",
          description: "Wait a few minutes before testing again.",
        };
      case "success":
      default:
        return {
          title: "Connection successful",
          description: "Reloopin can access the data required for this integration.",
        };
    }
  };

  const header = getHeader();

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={header.title}
      description={header.description}
    >
      {open && (
        <ConnectionTestInner
          key={outcome}
          onClose={onClose}
          outcome={outcome}
          onProceedToReview={onProceedToReview}
        />
      )}
    </Modal>
  );
}
