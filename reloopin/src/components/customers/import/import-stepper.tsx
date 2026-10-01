'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface ImportStepperProps {
  currentStep: number; // 1, 2, 3, or 4
  allCompleted?: boolean;
}

const STEPS = [
  { step: 1, label: 'Upload file' },
  { step: 2, label: 'Map columns' },
  { step: 3, label: 'Preview' },
  { step: 4, label: 'Complete' },
];

export function ImportStepper({ currentStep, allCompleted = false }: ImportStepperProps) {
  return (
    <div className="w-full bg-white border border-[#ebebeb] rounded-xl p-3 shadow-xs">
      <div className="grid grid-cols-4 gap-2">
        {STEPS.map((item) => {
          const isCompleted = allCompleted || item.step < currentStep;
          const isCurrent = !allCompleted && item.step === currentStep;
          const isUpcoming = !allCompleted && item.step > currentStep;

          return (
            <div
              key={item.step}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isCurrent
                  ? 'bg-[#f8f7ff] border border-[#e5e1fc]'
                  : isCompleted
                  ? 'bg-zinc-50/60 border border-transparent'
                  : 'border border-transparent'
              }`}
            >
              {/* Step indicator circle */}
              <div
                className={`size-6 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-colors ${
                  isCompleted
                    ? 'bg-[#5f3ed8]/10 text-[#5f3ed8]'
                    : isCurrent
                    ? 'bg-[#5f3ed8] text-white shadow-xs'
                    : 'bg-zinc-100 text-[#a1a1aa]'
                }`}
              >
                {isCompleted ? (
                  <Check className="size-3.5 stroke-[2.5]" />
                ) : (
                  <span>{item.step}</span>
                )}
              </div>

              {/* Label */}
              <div className="min-w-0">
                <span
                  className={`text-xs font-medium truncate block ${
                    isCurrent
                      ? 'text-[#0a0a0a] font-semibold'
                      : isCompleted
                      ? 'text-[#0a0a0a]'
                      : 'text-[#a1a1aa]'
                  }`}
                >
                  {item.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
