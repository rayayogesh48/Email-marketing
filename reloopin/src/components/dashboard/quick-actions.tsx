"use client";

import {
  Coins,
  Gift,
  UserPlus,
  Mail,
  ArrowDownToLine,
  ArrowRight,
} from "lucide-react";

export function QuickActions({
  onActionClick,
}: {
  onActionClick: (actionId: string) => void;
}) {
  const actions = [
    {
      id: "create_earning_rule",
      label: "Create earning rule",
      description: "Define how shoppers earn points",
      Icon: Coins,
    },
    {
      id: "create_reward",
      label: "Create reward",
      description: "Discount coupons, free shipping",
      Icon: Gift,
    },
    {
      id: "add_customer",
      label: "Add customer",
      description: "Enroll manual shopper profile",
      Icon: UserPlus,
    },
    {
      id: "create_campaign",
      label: "Create campaign",
      description: "Send broadcast loyalty email",
      Icon: Mail,
    },
    {
      id: "import_customers",
      label: "Import customers",
      description: "Sync historical CSV records",
      Icon: ArrowDownToLine,
    },
  ];

  return (
    <section className="mt-6" aria-label="Quick operational actions">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-[var(--foreground)] tracking-tight">
          Quick actions
        </h3>
        <span className="text-xs text-[var(--muted-foreground)]">
          Operational shortcuts
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {actions.map(({ id, label, description, Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onActionClick(id)}
            className="group flex flex-col justify-between p-3.5 rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-2xs hover:border-[var(--ring)] hover:shadow-xs transition-all text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
          >
            <div>
              <div className="p-2 w-fit rounded-lg bg-[var(--muted)] text-[var(--foreground)] group-hover:bg-[var(--primary)] group-hover:text-[var(--primary-foreground)] transition-colors mb-2.5">
                <Icon size={16} />
              </div>
              <h4 className="text-xs font-semibold text-[var(--foreground)] leading-tight group-hover:text-[var(--primary)] transition-colors">
                {label}
              </h4>
              <p className="text-[11px] text-[var(--muted-foreground)] mt-1 line-clamp-2 leading-snug">
                {description}
              </p>
            </div>

            <div className="mt-3 flex items-center gap-1 text-[11px] font-medium text-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Start</span>
              <ArrowRight size={11} />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
