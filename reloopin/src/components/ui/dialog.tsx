"use client";
import * as D from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ReactNode, useRef } from "react";
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  wide = false,
  side = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  wide?: boolean;
  side?: boolean;
}) {
  const returnFocus = useRef<HTMLElement | null>(null);
  return (
    <D.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <D.Portal>
        <D.Overlay className="dialog-overlay" />
        <D.Content
          onOpenAutoFocus={() => {
            returnFocus.current =
              document.activeElement instanceof HTMLElement
                ? document.activeElement
                : null;
          }}
          onCloseAutoFocus={(event) => {
            if (returnFocus.current?.isConnected) {
              event.preventDefault();
              returnFocus.current.focus();
            }
          }}
          className={`dialog-content ${wide ? "dialog-wide" : ""} ${side ? "dialog-side" : ""}`}
        >
          <D.Title className="dialog-title">{title}</D.Title>
          <D.Description className="dialog-description">
            {description || "Review the details below."}
          </D.Description>
          <D.Close className="dialog-close" aria-label="Close dialog">
            <X size={18} />
          </D.Close>
          {children}
        </D.Content>
      </D.Portal>
    </D.Root>
  );
}
