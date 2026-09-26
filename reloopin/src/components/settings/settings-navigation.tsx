"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { SettingsSection } from "@/lib/settings/settings-types";
import { User, Store, Palette, Users, Bell } from "lucide-react";

interface NavItem {
  id: SettingsSection;
  label: string;
  href: string;
  icon: typeof User;
  isStoreSpecific?: boolean;
}

export const settingsNavItems: NavItem[] = [
  {
    id: "account",
    label: "My account",
    href: "/settings?section=account",
    icon: User,
  },
  {
    id: "store",
    label: "Store profile",
    href: "/settings?section=store",
    icon: Store,
    isStoreSpecific: true,
  },
  {
    id: "branding",
    label: "Branding",
    href: "/settings?section=branding",
    icon: Palette,
    isStoreSpecific: true,
  },
  {
    id: "team",
    label: "Team",
    href: "/settings?section=team",
    icon: Users,
    isStoreSpecific: true,
  },
  {
    id: "notifications",
    label: "Notifications",
    href: "/settings?section=notifications",
    icon: Bell,
    isStoreSpecific: true,
  },
];

export function SettingsNavigation({
  currentSection,
  onNavigate,
}: {
  currentSection: SettingsSection;
  onNavigate?: (section: SettingsSection) => boolean; // return false to cancel navigation (e.g. dirty form)
}) {
  const router = useRouter();

  const handleItemClick = (e: React.MouseEvent, item: NavItem) => {
    if (onNavigate) {
      const allowed = onNavigate(item.id);
      if (!allowed) {
        e.preventDefault();
        return;
      }
    }
  };

  return (
    <>
      {/* Mobile Select dropdown */}
      <div className="block md:hidden mb-5">
        <label htmlFor="settings-nav-select" className="sr-only">
          Select settings section
        </label>
        <select
          id="settings-nav-select"
          value={currentSection}
          onChange={(e) => {
            const targetSection = e.target.value as SettingsSection;
            if (onNavigate && !onNavigate(targetSection)) {
              return;
            }
            router.push(`/settings?section=${targetSection}`);
          }}
          className="w-full px-3 py-2 text-sm bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--ring)]"
        >
          {settingsNavItems.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label} {item.isStoreSpecific ? "· Store" : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Tablet Horizontal Scrollable Tabs */}
      <div className="hidden md:flex lg:hidden overflow-x-auto border-b border-[var(--border)] mb-6 gap-1 pb-1">
        {settingsNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentSection === item.id;
          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={(e) => handleItemClick(e, item)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-[var(--accent)] text-[var(--accent-foreground)] shadow-xs"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]"
              }`}
            >
              <Icon size={14} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Desktop Left-Side Vertical Navigation */}
      <nav
        className="hidden lg:flex flex-col w-52 shrink-0 space-y-1"
        aria-label="Settings navigation"
      >
        {settingsNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentSection === item.id;
          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={(e) => handleItemClick(e, item)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? "bg-[var(--accent)] text-[var(--accent-foreground)] font-semibold shadow-xs"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]/70"
              }`}
            >
              <Icon
                size={16}
                className={isActive ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]"}
              />
              <span className="flex-1">{item.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] shrink-0" />
              )}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
