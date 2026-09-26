"use client";

import { useState } from "react";
import { PLATFORMS_CATALOG } from "@/lib/integrations/integrations-data";
import { PlatformDefinition, PlatformId } from "@/lib/integrations/integrations-types";
import { PlatformIcon } from "./platform-icon";
import { Search, ChevronRight, Check } from "lucide-react";

export function PlatformSelector({
  selectedPlatform,
  onSelectPlatform,
}: {
  selectedPlatform: PlatformId | null;
  onSelectPlatform: (platform: PlatformDefinition) => void;
}) {
  const [search, setSearch] = useState("");

  const filteredPlatforms = PLATFORMS_CATALOG.filter((p) => {
    if (!search.trim()) return true;
    const query = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.categoryLabel.toLowerCase().includes(query)
    );
  });

  const categories = [
    { key: "store", label: "Stores" },
    { key: "pos", label: "Point of sale" },
    { key: "social", label: "Social" },
    { key: "reviews", label: "Reviews" },
    { key: "custom_api", label: "Developer" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-[var(--foreground)]">
          Choose platform
        </h2>
        <p className="text-xs text-[var(--muted-foreground)] mt-1">
          Choose the store or channel you want to connect to Reloopin.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]"
          aria-hidden="true"
        />
        <input
          type="text"
          placeholder="Search platforms"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-xs bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:border-[var(--ring)] focus:ring-1 focus:ring-[var(--ring)]"
          aria-label="Search platforms"
        />
      </div>

      {/* Platform Category Groups */}
      <div className="space-y-8">
        {categories.map((cat) => {
          const platformsInCat = filteredPlatforms.filter(
            (p) => p.category === cat.key,
          );

          if (platformsInCat.length === 0) return null;

          return (
            <div key={cat.key} className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                {cat.label}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {platformsInCat.map((platform) => {
                  const isSelected = selectedPlatform === platform.id;
                  const isAvailable = platform.availability === "available";

                  return (
                    <button
                      key={platform.id}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => onSelectPlatform(platform)}
                      className={`text-left p-4 rounded-xl border transition-all relative flex flex-col justify-between ${
                        isSelected
                          ? "bg-[var(--card)] border-[var(--primary)] ring-1 ring-[var(--primary)] shadow-xs"
                          : isAvailable
                          ? "bg-[var(--card)] border-[var(--border)] hover:border-[var(--ring)] hover:shadow-xs cursor-pointer"
                          : "bg-[var(--muted)]/40 border-[var(--border)] opacity-60 cursor-not-allowed"
                      }`}
                      data-testid={`platform-card-${platform.id}`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-2.5">
                          <PlatformIcon platform={platform.id} size={32} />
                          {isAvailable ? (
                            <span className="text-[10px] font-medium text-[var(--success,#16a34a)] bg-[var(--color-success-bg,rgba(34,197,94,0.1))] px-2 py-0.5 rounded-full">
                              Available
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium text-[var(--muted-foreground)] bg-[var(--muted)] px-2 py-0.5 rounded-full border border-[var(--border)]">
                              Coming soon
                            </span>
                          )}
                        </div>

                        <h4 className="text-sm font-semibold text-[var(--foreground)] mb-1 flex items-center justify-between">
                          <span>{platform.name}</span>
                          {isSelected && (
                            <Check size={14} className="text-[var(--primary)] shrink-0" />
                          )}
                        </h4>
                        <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                          {platform.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-2.5 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--muted-foreground)]">
                        <span className="text-[11px] font-medium text-[var(--foreground)]">
                          {isAvailable ? "Select to connect" : "In development"}
                        </span>
                        {isAvailable && (
                          <ChevronRight size={14} className="text-[var(--muted-foreground)]" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
