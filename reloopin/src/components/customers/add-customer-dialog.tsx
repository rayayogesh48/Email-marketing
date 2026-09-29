"use client";

import React, { useState } from "react";
import { X, UserPlus } from "lucide-react";
import { useCustomerStore } from "@/lib/customers/customer-store";
import { toast } from "sonner";

export function AddCustomerDialog() {
  const {
    addCustomerModalOpen,
    closeAddCustomerModal,
    addCustomer,
    customers,
  } = useCustomerStore();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [enrollLoyalty, setEnrollLoyalty] = useState(true);
  const [addStartingPoints, setAddStartingPoints] = useState(false);
  const [startingPoints, setStartingPoints] = useState<number>(100);
  const [startingReason, setStartingReason] = useState("Opening balance bonus");

  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    startingPoints?: string;
    startingReason?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!addCustomerModalOpen) return null;

  const validate = () => {
    const errs: typeof errors = {};
    if (!firstName.trim()) errs.firstName = "First name is required.";
    if (!lastName.trim()) errs.lastName = "Last name is required.";

    const emailTrim = email.trim().toLowerCase();
    if (!emailTrim) {
      errs.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)) {
      errs.email = "Please enter a valid email address.";
    } else if (customers.some((c) => c.email.toLowerCase() === emailTrim)) {
      errs.email = "A customer with this email address already exists in your store.";
    }

    if (addStartingPoints) {
      if (!startingPoints || startingPoints <= 0) {
        errs.startingPoints = "Starting points must be greater than 0.";
      }
      if (!startingReason.trim()) {
        errs.startingReason = "Please provide a reason for the starting balance.";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const created = addCustomer({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        dateOfBirth: dateOfBirth.trim() || undefined,
        loyaltyMember: enrollLoyalty,
        startingPoints: addStartingPoints ? startingPoints : 0,
        startingReason: addStartingPoints ? startingReason.trim() : undefined,
      });

      setIsSubmitting(false);
      toast.success(`Customer ${created.name} added successfully.`);
      // Reset form
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setDateOfBirth("");
      setEnrollLoyalty(true);
      setAddStartingPoints(false);
      setStartingPoints(100);
      setStartingReason("Opening balance bonus");
      setErrors({});
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity animate-in fade-in"
        onClick={closeAddCustomerModal}
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-[540px] bg-white border border-[#ebebeb] rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-150 text-[#0a0a0a]">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#ebebeb]">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-[#5f3ed8]/10 text-[#5f3ed8] flex items-center justify-center">
              <UserPlus className="size-5" />
            </div>
            <div>
              <h3 className="text-[17px] font-bold text-[#0a0a0a]">
                Add new customer
              </h3>
              <p className="text-[13px] text-[#71717a]">
                Create a customer profile and enroll them into your store
              </p>
            </div>
          </div>
          <button
            onClick={closeAddCustomerModal}
            className="size-8 rounded-lg flex items-center justify-center text-[#71717a] hover:text-[#0a0a0a] hover:bg-zinc-100 transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="py-4 space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          {/* Section: Personal Details */}
          <div>
            <h4 className="text-[12px] font-bold text-[#71717a] uppercase tracking-wider mb-2.5">
              Personal details
            </h4>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-[13px] font-semibold text-[#0a0a0a] mb-1">
                  First name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Maya"
                  className={`w-full h-[38px] px-3 bg-white border rounded-xl text-[14px] text-[#0a0a0a] outline-none focus:ring-2 focus:ring-[#5f3ed8]/10 ${
                    errors.firstName
                      ? "border-red-500 focus:border-red-500"
                      : "border-[#ebebeb] focus:border-[#5f3ed8]"
                  }`}
                />
                {errors.firstName && (
                  <p className="text-[11px] text-red-500 mt-1">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#0a0a0a] mb-1">
                  Last name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Chen"
                  className={`w-full h-[38px] px-3 bg-white border rounded-xl text-[14px] text-[#0a0a0a] outline-none focus:ring-2 focus:ring-[#5f3ed8]/10 ${
                    errors.lastName
                      ? "border-red-500 focus:border-red-500"
                      : "border-[#ebebeb] focus:border-[#5f3ed8]"
                  }`}
                />
                {errors.lastName && (
                  <p className="text-[11px] text-red-500 mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email with copy from spec */}
            <div className="mb-3">
              <label className="block text-[13px] font-semibold text-[#0a0a0a] mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. maya@example.com"
                className={`w-full h-[38px] px-3 bg-white border rounded-xl text-[14px] text-[#0a0a0a] outline-none focus:ring-2 focus:ring-[#5f3ed8]/10 ${
                  errors.email
                    ? "border-red-500 focus:border-red-500"
                    : "border-[#ebebeb] focus:border-[#5f3ed8]"
                }`}
              />
              <p className="text-[12px] text-[#71717a] mt-1">
                We will use this email to identify the customer across orders and loyalty activity.
              </p>
              {errors.email && (
                <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Phone & Date of Birth */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[13px] font-semibold text-[#0a0a0a] mb-1">
                  Phone number (optional)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 415 555 0142"
                  className="w-full h-[38px] px-3 bg-white border border-[#ebebeb] rounded-xl text-[14px] text-[#0a0a0a] outline-none focus:border-[#5f3ed8] focus:ring-2 focus:ring-[#5f3ed8]/10"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#0a0a0a] mb-1">
                  Date of birth (optional)
                </label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full h-[38px] px-3 bg-white border border-[#ebebeb] rounded-xl text-[14px] text-[#0a0a0a] outline-none focus:border-[#5f3ed8] focus:ring-2 focus:ring-[#5f3ed8]/10"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-[#ebebeb] pt-3" />

          {/* Section: Loyalty Membership Toggle */}
          <div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[13px] font-semibold text-[#0a0a0a] block">
                  Enroll in loyalty program
                </span>
                <span className="text-[12px] text-[#71717a]">
                  The customer can earn points and move through VIP tiers.
                </span>
              </div>
              <input
                type="checkbox"
                checked={enrollLoyalty}
                onChange={(e) => setEnrollLoyalty(e.target.checked)}
                className="size-4 accent-[#5f3ed8] rounded cursor-pointer"
              />
            </div>
          </div>

          <div className="border-t border-[#ebebeb] pt-3" />

          {/* Section: Starting Points Toggle */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-[13px] font-semibold text-[#0a0a0a] block">
                  Add starting points
                </span>
                <span className="text-[12px] text-[#71717a]">
                  Give the customer an opening points balance.
                </span>
              </div>
              <input
                type="checkbox"
                checked={addStartingPoints}
                onChange={(e) => setAddStartingPoints(e.target.checked)}
                className="size-4 accent-[#5f3ed8] rounded cursor-pointer"
              />
            </div>

            {/* Revealed when enabled */}
            {addStartingPoints && (
              <div className="mt-3 p-3.5 bg-[#f7f7f8] rounded-xl border border-[#ebebeb] space-y-3 animate-in fade-in duration-100">
                <div>
                  <label className="block text-[13px] font-semibold text-[#0a0a0a] mb-1">
                    Starting points <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={startingPoints || ""}
                    onChange={(e) => setStartingPoints(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full h-[38px] px-3 bg-white border border-[#ebebeb] rounded-xl text-[14px] text-[#0a0a0a] outline-none focus:border-[#5f3ed8]"
                  />
                  {errors.startingPoints && (
                    <p className="text-[11px] text-red-500 mt-1">{errors.startingPoints}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-[#0a0a0a] mb-1">
                    Reason <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={startingReason}
                    onChange={(e) => setStartingReason(e.target.value)}
                    placeholder="e.g. Welcome signup bonus"
                    className="w-full h-[38px] px-3 bg-white border border-[#ebebeb] rounded-xl text-[14px] text-[#0a0a0a] outline-none focus:border-[#5f3ed8]"
                  />
                  <p className="text-[11px] text-[#71717a] mt-1">
                    This note will appear in the customer&apos;s points history.
                  </p>
                  {errors.startingReason && (
                    <p className="text-[11px] text-red-500 mt-1">{errors.startingReason}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#ebebeb]">
            <button
              type="button"
              onClick={closeAddCustomerModal}
              className="h-[38px] px-4 rounded-xl text-[14px] font-medium text-[#71717a] hover:text-[#0a0a0a] hover:bg-zinc-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 h-[38px] px-5 bg-[#5f3ed8] hover:bg-[#5234c2] disabled:opacity-50 text-white rounded-xl text-[14px] font-semibold shadow-xs transition-all"
            >
              {isSubmitting ? (
                <span>Adding...</span>
              ) : (
                <>
                  <UserPlus className="size-4" />
                  <span>Add customer</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
