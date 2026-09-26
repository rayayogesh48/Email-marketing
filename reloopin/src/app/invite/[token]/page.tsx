"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSettingsStore, settingsStore } from "@/lib/settings/settings-store";
import { Button } from "@/components/ui/button";
import {
  Users,
  Store,
  Shield,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Layers,
  Lock,
} from "lucide-react";
import { toast } from "sonner";

export default function InviteAcceptancePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const resolvedParams = use(params);
  const token = resolvedParams.token;
  const router = useRouter();
  const store = useSettingsStore();

  const [state, setState] = useState<"valid" | "accepted" | "expired" | "cancelled">(
    token.includes("expired")
      ? "expired"
      : token.includes("cancel")
      ? "cancelled"
      : "valid",
  );

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Find member matching token or fallback
  const pendingMember =
    store.teamMembers.find((m) => m.invitationToken === token) ||
    store.teamMembers.find((m) => m.status === "invitation_pending") ||
    store.teamMembers[3];

  const inviter = store.teamMembers.find((m) => m.role === "owner") || store.teamMembers[0];
  const activeStoreName = "Northstar Goods";

  const handleAccept = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      if (pendingMember) {
        settingsStore.updateMemberAccess(pendingMember.id, {
          status: "active",
        });
      }
      setState("accepted");
      toast.success(`You have joined ${activeStoreName}!`);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Brand Header */}
      <div className="max-w-md w-full mx-auto pt-6 pb-2 text-center">
        <Link href="/" className="inline-flex items-center gap-2 font-bold text-lg tracking-tight text-[var(--foreground)]">
          <span className="w-8 h-8 rounded-lg bg-[var(--primary)] text-white flex items-center justify-center">
            <Layers size={18} />
          </span>
          reloopin<span>®</span>
        </Link>
      </div>

      {/* Main Card */}
      <div className="max-w-md w-full mx-auto bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-md p-6 sm:p-8 space-y-6">
        {state === "accepted" ? (
          <div className="text-center space-y-4 py-4">
            <div className="w-14 h-14 rounded-full bg-[var(--success,#10b981)]/10 text-[var(--success,#10b981)] flex items-center justify-center mx-auto">
              <CheckCircle2 size={32} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[var(--foreground)]">
                You’ve joined {activeStoreName}
              </h1>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">
                You now have <strong className="capitalize">{pendingMember?.role || "Staff"}</strong> access to Reloopin.
              </p>
            </div>

            <Button
              type="button"
              variant="default"
              size="sm"
              asChild
              className="w-full text-xs h-9 mt-4"
            >
              <Link href="/dashboard">
                Go to dashboard <ArrowRight size={14} className="ml-1.5" />
              </Link>
            </Button>
          </div>
        ) : state === "expired" ? (
          <div className="text-center space-y-4 py-4">
            <div className="w-14 h-14 rounded-full bg-[var(--destructive)]/10 text-[var(--destructive)] flex items-center justify-center mx-auto">
              <Clock size={32} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[var(--foreground)]">
                This invitation has expired
              </h1>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">
                Invitation links are valid for 7 days. Ask the account owner ({inviter.email}) to send you a new invitation.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              asChild
              className="w-full text-xs h-9 mt-2"
            >
              <Link href="/dashboard">
                Back to dashboard
              </Link>
            </Button>
          </div>
        ) : state === "cancelled" ? (
          <div className="text-center space-y-4 py-4">
            <div className="w-14 h-14 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] flex items-center justify-center mx-auto">
              <AlertTriangle size={32} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[var(--foreground)]">
                This invitation is no longer available
              </h1>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">
                It may have been cancelled or replaced with an updated invitation.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              asChild
              className="w-full text-xs h-9 mt-2"
            >
              <Link href="/dashboard">
                Back to dashboard
              </Link>
            </Button>
          </div>
        ) : (
          /* Valid Invitation */
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <h1 className="text-xl font-bold tracking-tight text-[var(--foreground)]">
                Join {activeStoreName}
              </h1>
              <p className="text-xs text-[var(--muted-foreground)]">
                <strong>{inviter.name}</strong> invited you to join the Reloopin team as <strong className="capitalize text-[var(--primary)]">{pendingMember?.role || "Staff"}</strong>.
              </p>
            </div>

            {/* Details Box */}
            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--muted)]/40 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[var(--muted-foreground)] flex items-center gap-1.5">
                  <Shield size={13} /> Role assigned:
                </span>
                <span className="font-semibold text-[var(--foreground)] capitalize">
                  {pendingMember?.role || "Staff"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[var(--muted-foreground)] flex items-center gap-1.5">
                  <Store size={13} /> Store access:
                </span>
                <span className="font-semibold text-[var(--foreground)]">
                  {pendingMember?.storeAccess === "all" ? "All stores" : "Northstar Goods"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[var(--muted-foreground)] flex items-center gap-1.5">
                  <Users size={13} /> Invited by:
                </span>
                <span className="font-semibold text-[var(--foreground)]">
                  {inviter.name} ({inviter.email})
                </span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-[var(--border)]/70">
                <span className="text-[var(--muted-foreground)] flex items-center gap-1.5">
                  <Clock size={13} /> Invitation expiry:
                </span>
                <span className="text-[var(--muted-foreground)]">
                  In 6 days
                </span>
              </div>
            </div>

            {/* Account creation / sign in form */}
            <form onSubmit={handleAccept} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--foreground)] block">
                  Your full name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={pendingMember?.name || "e.g. Maya Patel"}
                  className="w-full px-3 py-2 text-xs bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:border-[var(--ring)]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--foreground)] block">
                  Choose a password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  minLength={8}
                  className="w-full px-3 py-2 text-xs bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:border-[var(--ring)]"
                  required
                />
              </div>

              <Button
                type="submit"
                variant="default"
                size="sm"
                disabled={isSubmitting}
                className="w-full text-xs h-9 font-medium"
              >
                {isSubmitting ? "Accepting invitation..." : "Create account and accept"}
              </Button>
            </form>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="max-w-md w-full mx-auto text-center pb-4 text-[11px] text-[var(--muted-foreground)]">
        Reloopin Customer Loyalty & Marketing Platform
      </div>
    </div>
  );
}
