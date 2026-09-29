"use client";

import React from "react";
import { Check } from "lucide-react";
import { ImportStep } from "@/lib/customers/customer-types";

export function ImportStepper({
  currentStep,
  onStepClick,
}: {
  currentStep: ImportStep;
  onStepClick?: (step: ImportStep) => void;
}) {
  const steps: { step: ImportStep; title: string }[] = [
    { step: 1, title: "Upload file" },
    { step: 2, title: "Map columns" },
    { step: 3, title: "Review data" },
    { step: 4, title: "Import customers" },
  ];

  return (
    <div className="w-full bg-white border border-[#ebebeb] rounded-xl p-3 shadow-sm">
      <div className="flex items-center justify-between max-w-[800px] mx-auto">
        {steps.map((item, idx) => {
          const isCompleted = item.step < currentStep;
          const isActive = item.step === currentStep;
          const isClickable = isCompleted && onStepClick;

          return (
            <React.Fragment key={item.step}>
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick(item.step)}
                className={`flex items-center gap-2.5 transition-colors ${
                  isClickable ? "cursor-pointer group" : "cursor-default"
                }`}
              >
                {/* Step Circle */}
                <div
                  className={`size-7 rounded-full flex items-center justify-center text-[12px] font-bold transition-all ${
                    isCompleted
                      ? "bg-emerald-500 text-white"
                      : isActive
                      ? "bg-[#5f3ed8] text-white shadow-sm ring-4 ring-[#5f3ed8]/15"
                      : "bg-zinc-100 text-[#71717a] border border-zinc-200"
                  }`}
                >
                  {isCompleted ? <Check className="size-4 stroke-[3]" /> : item.step}
                </div>

                {/* Step Label */}
                <span
                  className={`text-[13px] font-medium hidden sm:inline ${
                    isActive
                      ? "text-[#0a0a0a] font-semibold"
                      : isCompleted
                      ? "text-[#5b5a5a] group-hover:text-[#5f3ed8]"
                      : "text-[#a1a1aa]"
                  }`}
                >
                  {item.title}
                </span>
              </button>

              {/* Connecting line */}
              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-3 transition-colors ${
                    item.step < currentStep
                      ? "bg-emerald-500"
                      : "bg-zinc-200"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
