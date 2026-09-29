"use client";

import { useState } from "react";
import { PaymentMethod } from "@/lib/billing/billing-types";
import { Modal } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreditCard, Lock } from "lucide-react";
import { toast } from "sonner";

export function PaymentMethodDialog({
  open,
  onClose,
  mode = "add",
  existingMethod,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  mode?: "add" | "update";
  existingMethod?: PaymentMethod | null;
  onSave: (card: Omit<PaymentMethod, "id">) => void;
}) {
  const [billingName, setBillingName] = useState(existingMethod?.billingName || "Alex Lawrence");
  const [cardNumber, setCardNumber] = useState(
    existingMethod ? `•••• •••• •••• ${existingMethod.last4}` : "4242 •••• •••• 4242",
  );
  const [expiry, setExpiry] = useState(
    existingMethod ? `${existingMethod.expiryMonth}/${existingMethod.expiryYear}` : "08/28",
  );
  const [cvc, setCvc] = useState("•••");
  const [country, setCountry] = useState(existingMethod?.country || "United States");
  const [postalCode, setPostalCode] = useState(existingMethod?.postalCode || "94103");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      onSave({
        brand: "visa",
        last4: "4242",
        expiryMonth: 8,
        expiryYear: 2028,
        billingName,
        country,
        postalCode,
        isPrimary: true,
        status: "valid",
      });
      setIsSubmitting(false);
      toast.success(
        mode === "add"
          ? "Payment method added successfully."
          : "Payment method updated successfully.",
      );
    }, 600);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === "add" ? "Add payment method" : "Update payment method"}
      description="Add a credit or debit card for subscription billing. Card numbers are securely tokenized."
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2 text-xs">
        <div className="space-y-1">
          <label className="font-semibold text-[var(--foreground)] block">
            Name on card
          </label>
          <input
            type="text"
            required
            value={billingName}
            onChange={(e) => setBillingName(e.target.value)}
            placeholder="Alex Lawrence"
            className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
          />
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-[var(--foreground)] block">
            Card number
          </label>
          <div className="relative">
            <input
              type="text"
              required
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="4242 •••• •••• 4242"
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--foreground)] font-mono focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
            />
            <CreditCard size={15} className="absolute left-3 top-2.5 text-[var(--muted-foreground)]" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="font-semibold text-[var(--foreground)] block">
              Expires (MM/YY)
            </label>
            <input
              type="text"
              required
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              placeholder="08/28"
              className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--foreground)] font-mono focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[var(--foreground)] block">
              Security code
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                placeholder="123"
                className="w-full pl-8 pr-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--foreground)] font-mono focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
              />
              <Lock size={13} className="absolute left-2.5 top-2.5 text-[var(--muted-foreground)]" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="font-semibold text-[var(--foreground)] block">
              Country
            </label>
            <input
              type="text"
              required
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="United States"
              className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[var(--foreground)] block">
              Postal code
            </label>
            <input
              type="text"
              required
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder="94103"
              className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
            />
          </div>
        </div>

        <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--muted)]/40 text-[11px] text-[var(--muted-foreground)]">
          This is a prototype demonstration. Never enter real banking credentials.
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border)]">
          <Button type="button" variant="ghost" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="default" size="sm" disabled={isSubmitting} className="font-medium">
            {isSubmitting ? "Saving..." : "Save payment method"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
