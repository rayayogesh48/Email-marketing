'use client';

import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles,
  RotateCcw,
  Sliders,
  Check,
} from 'lucide-react';
import {
  ImportScreenState,
  PREVIEW_STATE_OPTIONS,
} from '@/lib/mock-data/customer-import';
import { toast } from 'sonner';

interface PreviewStateSwitcherProps {
  currentState: ImportScreenState;
  onSelectState: (state: ImportScreenState) => void;
  onReset: () => void;
}

export function PreviewStateSwitcher({
  currentState,
  onSelectState,
  onReset,
}: PreviewStateSwitcherProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (state: ImportScreenState) => {
    onSelectState(state);
    toast.info(`Switched to state: ${state.replace(/_/g, ' ')}`);
  };

  return (
    <>
      {/* Floating button at bottom-right */}
      <div className="fixed bottom-5 right-5 z-40">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpen(true)}
          className="h-8 px-3 rounded-full bg-white/95 backdrop-blur border border-[#ebebeb] shadow-md text-xs font-medium text-[#0a0a0a] hover:bg-[#fafafa] transition-all flex items-center gap-1.5"
        >
          <Sparkles className="size-3.5 text-[#5f3ed8]" />
          <span>Preview states</span>
          <Badge
            variant="secondary"
            className="text-[10px] h-4 px-1.5 bg-[#5f3ed8]/10 text-[#5f3ed8] font-medium"
          >
            Prototype
          </Badge>
        </Button>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="sm:max-w-md w-full overflow-y-auto bg-white p-6">
          <SheetHeader className="text-left pb-4 border-b border-[#ebebeb]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-[#5f3ed8]/10 text-[#5f3ed8] flex items-center justify-center">
                  <Sliders className="size-4" />
                </div>
                <div>
                  <SheetTitle className="text-base font-semibold text-[#0a0a0a]">
                    Import Flow Simulator
                  </SheetTitle>
                  <SheetDescription className="text-xs text-[#71717a]">
                    Quickly jump between all 8 prototype screens
                  </SheetDescription>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onReset();
                  toast.success('Reset import prototype to initial state');
                }}
                className="h-7 text-xs text-[#71717a] hover:text-[#0a0a0a]"
                title="Reset to default prototype"
              >
                <RotateCcw className="size-3.5 mr-1" />
                Reset
              </Button>
            </div>
          </SheetHeader>

          <div className="mt-5 space-y-4">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#71717a]">
              Screen States
            </div>

            <div className="space-y-2">
              {PREVIEW_STATE_OPTIONS.map((item) => {
                const isSelected = currentState === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect(item.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-[#5f3ed8] bg-[#f8f7ff]'
                        : 'border-[#ebebeb] bg-white hover:bg-[#fafafa]'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-[#0a0a0a]">
                          {item.title}
                        </span>
                        {item.badge && (
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${item.badgeColor}`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#71717a] mt-0.5 line-clamp-1">
                        {item.subtitle}
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isSelected ? (
                        <div className="size-5 rounded-full bg-[#5f3ed8] text-white flex items-center justify-center">
                          <Check className="size-3 stroke-[2.5]" />
                        </div>
                      ) : (
                        <div className="size-5 rounded-full border border-[#ebebeb] bg-zinc-50" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
