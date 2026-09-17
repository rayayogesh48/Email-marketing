"use client";
import * as D from "@radix-ui/react-dropdown-menu";
import { ReactNode } from "react";
export function Menu({
  trigger,
  items,
  label = "More actions",
}: {
  trigger: ReactNode;
  items: {
    label: string;
    action: () => void;
    danger?: boolean;
    icon?: ReactNode;
  }[];
  label?: string;
}) {
  return (
    <D.Root>
      <D.Trigger className="menu-trigger" aria-label={label}>
        {trigger}
      </D.Trigger>
      <D.Portal>
        <D.Content className="menu-content" sideOffset={6} align="end">
          {items.map((item, i) => (
            <D.Item
              key={i}
              className={`menu-item ${item.danger ? "danger-text" : ""}`}
              onSelect={item.action}
            >
              {item.icon}
              {item.label}
            </D.Item>
          ))}
        </D.Content>
      </D.Portal>
    </D.Root>
  );
}
