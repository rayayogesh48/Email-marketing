"use client";

import { useState } from "react";
import {
  TeamMember,
  TeamRole,
  MemberStatus,
  StoreOption,
} from "@/lib/settings/settings-types";
import {
  roleCapabilityMatrix,
  availableStores,
} from "@/lib/settings/settings-data";
import { validateEmail } from "@/lib/settings/settings-validation";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/dialog";
import { Menu } from "@/components/ui/menu";
import {
  Users,
  UserPlus,
  Search,
  MoreHorizontal,
  Shield,
  ShieldAlert,
  CheckCircle2,
  Clock,
  AlertCircle,
  Copy,
  Mail,
  Store,
  ChevronRight,
  ExternalLink,
  Crown,
  KeyRound,
  Trash2,
  LogOut,
  AlertTriangle,
  Lock,
} from "lucide-react";
import { toast } from "sonner";

export function TeamSection({
  members,
  currentStoreName,
  seatLimit,
  isReadOnly,
  previewState,
  onInviteMember,
  onResendInvitation,
  onCancelInvitation,
  onUpdateMemberAccess,
  onRemoveMember,
  onLeaveTeam,
  onTransferOwnership,
}: {
  members: TeamMember[];
  currentStoreName: string;
  seatLimit: number;
  isReadOnly?: boolean;
  previewState?: string;
  onInviteMember: (data: {
    email: string;
    role: TeamRole;
    storeAccess: "all" | string[];
    name?: string;
    message?: string;
  }) => TeamMember;
  onResendInvitation: (id: string) => void;
  onCancelInvitation: (id: string) => void;
  onUpdateMemberAccess: (
    id: string,
    updates: {
      role?: TeamRole;
      storeAccess?: "all" | string[];
      status?: MemberStatus;
    },
  ) => void;
  onRemoveMember: (id: string) => void;
  onLeaveTeam: (id: string) => void;
  onTransferOwnership: (newOwnerId: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  // Dialog & Sheet States
  const [inviteModalOpen, setInviteModalOpen] = useState(
    previewState === "team_invite_member" ||
      previewState === "team_seat_limit_reached" ||
      previewState === "team_invitation_sent",
  );
  const [permissionsSheetOpen, setPermissionsSheetOpen] = useState(false);
  const [editMemberSheetOpen, setEditMemberSheetOpen] = useState(
    previewState === "team_edit_member",
  );
  const [changeRoleDialogOpen, setChangeRoleDialogOpen] = useState(
    previewState === "team_change_role",
  );
  const [removeMemberDialogOpen, setRemoveMemberDialogOpen] = useState(
    previewState === "team_remove_member",
  );
  const [transferModalOpen, setTransferModalOpen] = useState(
    previewState === "team_transfer_ownership",
  );
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);

  // Selected member for editing/action
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(
    members.find((m) => m.role === "admin") || members[0] || null,
  );
  const [pendingTargetRole, setPendingTargetRole] = useState<TeamRole>("viewer");

  // Invite Form State
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<TeamRole>("staff");
  const [inviteStoreAccessType, setInviteStoreAccessType] = useState<"all" | "selected">("all");
  const [inviteSelectedStores, setInviteSelectedStores] = useState<string[]>(["northstar"]);
  const [inviteMessage, setInviteMessage] = useState("");
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteSuccessMember, setInviteSuccessMember] = useState<TeamMember | null>(
    previewState === "team_invitation_sent"
      ? {
          id: "preview-sent",
          name: "team",
          email: "team@northstargoods.com",
          role: "staff",
          status: "invitation_pending",
          storeAccess: "all",
          lastActive: "Never signed in",
          invitationToken: "tok_preview_123",
        }
      : null,
  );
  const [isSendingInvite, setIsSendingInvite] = useState(
    previewState === "team_sending_invitation",
  );

  // Transfer Ownership Form State
  const [transferTargetAdminId, setTransferTargetAdminId] = useState("");
  const [transferConfirmText, setTransferConfirmText] = useState("");

  // Edit Member Sheet Form State
  const [editRole, setEditRole] = useState<TeamRole>(selectedMember?.role || "staff");
  const [editStoreAccessType, setEditStoreAccessType] = useState<"all" | "selected">(
    selectedMember?.storeAccess === "all" ? "all" : "selected",
  );
  const [editSelectedStores, setEditSelectedStores] = useState<string[]>(
    Array.isArray(selectedMember?.storeAccess) ? selectedMember!.storeAccess : ["northstar"],
  );

  const currentUser = members.find((m) => m.isCurrentUser) || members[0];
  const isCurrentUserOwner = currentUser.role === "owner";

  // Filter members
  const filteredMembers = members.filter((m) => {
    if (previewState === "team_search_no_results") return false;
    if (previewState === "team_owner_only" && m.role !== "owner") return false;

    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || m.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const usedSeats = members.filter((m) => m.status !== "invitation_expired").length;
  const isSeatLimitReached = usedSeats >= seatLimit || previewState === "team_seat_limit_reached";

  // Handle Invite Submission
  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSeatLimitReached) {
      setInviteError("Team member limit reached. Your current plan supports up to 5 team members.");
      return;
    }

    const emailErr = validateEmail(inviteEmail);
    if (emailErr) {
      setInviteError(emailErr);
      return;
    }

    // Check duplicate
    const existing = members.find((m) => m.email.toLowerCase() === inviteEmail.trim().toLowerCase());
    if (existing) {
      if (existing.status === "invitation_pending") {
        setInviteError("Invitation already sent: An invitation is waiting for this email address.");
      } else {
        setInviteError("This person is already on your team: They already have access to your stores.");
      }
      return;
    }

    setInviteError(null);
    setIsSendingInvite(true);

    setTimeout(() => {
      setIsSendingInvite(false);
      const newMem = onInviteMember({
        email: inviteEmail.trim(),
        role: inviteRole,
        storeAccess: inviteStoreAccessType === "all" ? "all" : inviteSelectedStores,
        message: inviteMessage.trim() || undefined,
      });
      setInviteSuccessMember(newMem);
      toast.success(`Invitation sent to ${inviteEmail}`);
    }, 600);
  };

  // Open Edit Sheet
  const handleOpenEdit = (member: TeamMember) => {
    setSelectedMember(member);
    setEditRole(member.role);
    setEditStoreAccessType(member.storeAccess === "all" ? "all" : "selected");
    setEditSelectedStores(Array.isArray(member.storeAccess) ? member.storeAccess : ["northstar"]);
    setEditMemberSheetOpen(true);
  };

  // Save Edit Access
  const handleSaveEditAccess = () => {
    if (!selectedMember) return;
    onUpdateMemberAccess(selectedMember.id, {
      role: editRole,
      storeAccess: editStoreAccessType === "all" ? "all" : editSelectedStores,
    });
    setEditMemberSheetOpen(false);
    toast.success("Member access updated");
  };

  // Role Change Confirmation
  const handlePromptChangeRole = (member: TeamMember, newRole: TeamRole) => {
    setSelectedMember(member);
    setPendingTargetRole(newRole);
    setChangeRoleDialogOpen(true);
  };

  const handleConfirmRoleChange = () => {
    if (!selectedMember) return;
    onUpdateMemberAccess(selectedMember.id, { role: pendingTargetRole });
    setChangeRoleDialogOpen(false);
    toast.success(`${selectedMember.name}'s role changed to ${pendingTargetRole}`);
  };

  // Remove Member Confirmation
  const handlePromptRemove = (member: TeamMember) => {
    setSelectedMember(member);
    setRemoveMemberDialogOpen(true);
  };

  const handleConfirmRemove = () => {
    if (!selectedMember) return;
    onRemoveMember(selectedMember.id);
    setRemoveMemberDialogOpen(false);
    toast.success(`${selectedMember.name} removed from the team`);
  };

  // Transfer Ownership
  const handleConfirmTransfer = () => {
    if (!transferTargetAdminId || transferConfirmText.trim() !== "TRANSFER") {
      toast.error("Please select an Admin and type TRANSFER to confirm.");
      return;
    }
    const targetAdmin = members.find((m) => m.id === transferTargetAdminId);
    onTransferOwnership(transferTargetAdminId);
    setTransferModalOpen(false);
    setTransferConfirmText("");
    toast.success(
      `Ownership transferred: You are now an Admin. ${targetAdmin?.name || "The selected member"} is the account owner.`,
    );
  };

  // Helper for Member row actions
  const getMemberRowActions = (item: TeamMember) => {
    const items = [];

    if (item.status === "active") {
      if (item.isCurrentUser) {
        if (item.role !== "owner") {
          items.push({
            label: "Leave team",
            icon: <LogOut size={13} className="mr-2 text-[var(--destructive)]" />,
            danger: true,
            action: () => {
              setSelectedMember(item);
              setLeaveModalOpen(true);
            },
          });
        }
      } else {
        // Can edit access if current user is owner or admin
        items.push({
          label: "Edit access",
          action: () => handleOpenEdit(item),
        });

        if (isCurrentUserOwner) {
          items.push({
            label: item.role === "admin" ? "Change to Staff" : "Make Admin",
            action: () =>
              handlePromptChangeRole(item, item.role === "admin" ? "staff" : "admin"),
          });
        }

        // Cannot remove owner
        if (item.role !== "owner") {
          items.push({
            label: "Remove member",
            danger: true,
            icon: <Trash2 size={13} className="mr-2 text-[var(--destructive)]" />,
            action: () => handlePromptRemove(item),
          });
        }
      }
    } else if (item.status === "invitation_pending") {
      items.push({
        label: "Copy invitation link",
        icon: <Copy size={13} className="mr-2" />,
        action: () => {
          const inviteUrl = `${window.location.origin}/invite/${item.invitationToken || "preview"}`;
          navigator.clipboard.writeText(inviteUrl);
          toast.success("Invitation link copied to clipboard");
        },
      });
      items.push({
        label: "Resend invitation",
        icon: <Mail size={13} className="mr-2" />,
        action: () => {
          onResendInvitation(item.id);
          toast.success(`Invitation resent to ${item.email}`);
        },
      });
      items.push({
        label: "Cancel invitation",
        danger: true,
        action: () => {
          onCancelInvitation(item.id);
          toast.info("Invitation cancelled");
        },
      });
    } else if (item.status === "invitation_expired") {
      items.push({
        label: "Resend invitation",
        icon: <Mail size={13} className="mr-2" />,
        action: () => {
          onResendInvitation(item.id);
          toast.success(`Invitation resent to ${item.email}`);
        },
      });
      items.push({
        label: "Cancel invitation",
        danger: true,
        action: () => {
          onCancelInvitation(item.id);
          toast.info("Invitation cancelled");
        },
      });
    }

    if (item.role === "owner" && item.isCurrentUser) {
      items.unshift({
        label: "Transfer ownership",
        icon: <Crown size={13} className="mr-2 text-[var(--warning,#f59e0b)]" />,
        action: () => setTransferModalOpen(true),
      });
    }

    return items;
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-[var(--foreground)]">
            Team
          </h2>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
            Invite staff and control what they can access across your stores.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPermissionsSheetOpen(true)}
            className="text-xs"
          >
            <Shield size={13} className="mr-1.5" />
            Role permissions
          </Button>

          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={() => {
              setInviteEmail("");
              setInviteRole("staff");
              setInviteSuccessMember(null);
              setInviteError(null);
              setInviteModalOpen(true);
            }}
            disabled={isReadOnly}
            className="text-xs"
            data-testid="invite-member-button"
          >
            <UserPlus size={13} className="mr-1.5" />
            Invite member
          </Button>
        </div>
      </div>

      {/* Seat Usage Banner */}
      <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--foreground)]">
            <Users size={14} className="text-[var(--primary)]" />
            <span>
              {usedSeats} of {seatLimit} team seats used
            </span>
          </div>
          <p className="text-[11px] text-[var(--muted-foreground)]">
            {seatLimit - usedSeats > 0
              ? `You have ${seatLimit - usedSeats} seats available on your current plan.`
              : "You have reached your team seat limit. Upgrade to add more members."}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full sm:w-48 space-y-1">
          <div className="h-2 w-full bg-[var(--muted)] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                usedSeats >= seatLimit
                  ? "bg-[var(--warning,#f59e0b)]"
                  : "bg-[var(--primary)]"
              }`}
              style={{ width: `${Math.min(100, (usedSeats / seatLimit) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Toolbar: Search & Role Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search
            size={14}
            className="absolute left-3 top-2.5 text-[var(--muted-foreground)]"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search team members"
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:border-[var(--ring)]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--ring)]"
          >
            <option value="all">All roles</option>
            <option value="owner">Owner</option>
            <option value="admin">Admin</option>
            <option value="staff">Staff</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>
      </div>

      {/* Team Table (Desktop / Tablet) */}
      <div className="table-container border border-[var(--border)] rounded-xl bg-[var(--card)] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--muted)]">
                <th className="py-3 px-4 font-medium text-[var(--muted-foreground)]">Member</th>
                <th className="py-3 px-4 font-medium text-[var(--muted-foreground)]">Role</th>
                <th className="py-3 px-4 font-medium text-[var(--muted-foreground)]">Store access</th>
                <th className="py-3 px-4 font-medium text-[var(--muted-foreground)]">Status</th>
                <th className="py-3 px-4 font-medium text-[var(--muted-foreground)]">Last active</th>
                <th className="py-3 px-4 text-right font-medium text-[var(--muted-foreground)]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-[var(--muted-foreground)]">
                    No team members found matching your search.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => {
                  const initials = member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase();

                  const rowActions = getMemberRowActions(member);

                  return (
                    <tr
                      key={member.id}
                      className="hover:bg-[var(--muted)]/50 transition-colors"
                      data-testid={`team-row-${member.id}`}
                    >
                      {/* Member Cell */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full border border-[var(--border)] bg-[var(--muted)] flex items-center justify-center font-bold text-xs text-[var(--foreground)] shrink-0 overflow-hidden">
                            {member.avatarUrl ? (
                              <img
                                src={member.avatarUrl}
                                alt={member.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              initials
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 font-medium text-[var(--foreground)]">
                              <span>{member.name}</span>
                              {member.isCurrentUser && (
                                <span className="px-1.5 py-0.2 rounded-md bg-[var(--primary)]/10 text-[var(--primary)] text-[10px] font-semibold">
                                  You
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-[var(--muted-foreground)] block">
                              {member.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Role Cell */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border ${
                            member.role === "owner"
                              ? "bg-[var(--warning,#f59e0b)]/10 text-[var(--warning,#f59e0b)] border-[var(--warning,#f59e0b)]/20"
                              : member.role === "admin"
                              ? "bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/20"
                              : member.role === "staff"
                              ? "bg-[var(--accent)] text-[var(--accent-foreground)] border-[var(--border)]"
                              : "bg-[var(--muted)] text-[var(--muted-foreground)] border-[var(--border)]"
                          }`}
                        >
                          {member.role === "owner" && <Crown size={11} />}
                          <span className="capitalize">{member.role}</span>
                        </span>
                      </td>

                      {/* Store Access Cell */}
                      <td className="py-3.5 px-4 text-[var(--muted-foreground)] text-[11px]">
                        {member.storeAccess === "all" ? (
                          <span className="font-medium text-[var(--foreground)] flex items-center gap-1">
                            <Store size={12} className="text-[var(--primary)]" /> All stores
                          </span>
                        ) : (
                          <span>
                            {member.storeAccess.length} store
                            {member.storeAccess.length > 1 ? "s" : ""}
                          </span>
                        )}
                      </td>

                      {/* Status Cell */}
                      <td className="py-3.5 px-4">
                        {member.status === "active" ? (
                          <span className="inline-flex items-center gap-1.5 text-[11px] text-[var(--success,#10b981)] font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--success,#10b981)]" />
                            Active
                          </span>
                        ) : member.status === "invitation_pending" ? (
                          <span className="inline-flex items-center gap-1.5 text-[11px] text-[var(--warning,#f59e0b)] font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--warning,#f59e0b)]" />
                            Invitation pending
                          </span>
                        ) : member.status === "invitation_expired" ? (
                          <span className="inline-flex items-center gap-1.5 text-[11px] text-[var(--destructive)] font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--destructive)]" />
                            Invitation expired
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[11px] text-[var(--muted-foreground)] font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--muted-foreground)]" />
                            Suspended
                          </span>
                        )}
                      </td>

                      {/* Last Active */}
                      <td className="py-3.5 px-4 text-[var(--muted-foreground)] text-[11px]">
                        {member.lastActive}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        {rowActions.length > 0 && (
                          <Menu
                            label={`More actions for ${member.name}`}
                            trigger={<MoreHorizontal size={15} />}
                            items={rowActions}
                          />
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DIALOG 1: INVITE TEAM MEMBER */}
      {/* ========================================================================= */}
      <Modal
        open={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        title="Invite team member"
        description="Give someone access to your Reloopin dashboard and store loyalty programs."
      >
        <div className="pt-2">
          {inviteSuccessMember ? (
            <div className="py-4 space-y-4">
              <div className="text-center space-y-1">
                <CheckCircle2 size={36} className="text-[var(--success,#10b981)] mx-auto" />
                <h4 className="text-sm font-semibold text-[var(--foreground)]">Invitation sent</h4>
                <p className="text-xs text-[var(--muted-foreground)]">
                  We sent an invitation link to <strong className="text-[var(--foreground)]">{inviteSuccessMember.email}</strong>.
                </p>
              </div>

              {/* Copyable link */}
              <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--muted)]/50 flex items-center justify-between gap-2 text-xs">
                <span className="font-mono text-[11px] truncate text-[var(--muted-foreground)]">
                  {typeof window !== "undefined"
                    ? `${window.location.origin}/invite/${inviteSuccessMember.invitationToken || "sample"}`
                    : `/invite/${inviteSuccessMember.invitationToken || "sample"}`}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const inviteUrl = `${window.location.origin}/invite/${inviteSuccessMember.invitationToken || "sample"}`;
                    navigator.clipboard.writeText(inviteUrl);
                    toast.success("Invitation link copied!");
                  }}
                  className="text-xs h-7 shrink-0"
                >
                  <Copy size={12} className="mr-1" /> Copy link
                </Button>
              </div>

              <div className="flex items-center justify-end gap-2 mt-4 pt-2 border-t border-[var(--border)]">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setInviteEmail("");
                    setInviteSuccessMember(null);
                    setInviteError(null);
                  }}
                  className="text-xs"
                >
                  Invite another
                </Button>
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={() => setInviteModalOpen(false)}
                  className="text-xs"
                >
                  Done
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSendInvite} className="space-y-4 pt-2">
              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--foreground)] block">
                  Email address <span className="text-[var(--destructive)]">*</span>
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:border-[var(--ring)]"
                  placeholder="team@northstargoods.com"
                  required
                />
              </div>

              {/* Role Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--foreground)] block">
                  Role <span className="text-[var(--destructive)]">*</span>
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as TeamRole)}
                  className="w-full px-3 py-2 text-xs bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--ring)]"
                >
                  <option value="admin">Admin · High permissions</option>
                  <option value="staff">Staff · Operations & rewards</option>
                  <option value="viewer">Viewer · Read-only access</option>
                </select>

                {/* Role Summary */}
                <div className="p-3 rounded-lg bg-[var(--muted)]/50 border border-[var(--border)] text-[11px] text-[var(--muted-foreground)] space-y-1">
                  <div className="font-semibold text-[var(--foreground)] capitalize">
                    {inviteRole} access
                  </div>
                  <div>
                    {inviteRole === "admin" &&
                      "Can manage loyalty settings, customers, rewards, email marketing, and integrations for assigned stores. Cannot manage billing or API keys."}
                    {inviteRole === "staff" &&
                      "Can manage customers and rewards for assigned stores. Cannot manage billing, integrations, or team members."}
                    {inviteRole === "viewer" &&
                      "Read-only access to view dashboards, analytics, customers, and rewards. Cannot create, edit, or adjust points."}
                  </div>
                  <button
                    type="button"
                    onClick={() => setPermissionsSheetOpen(true)}
                    className="text-[var(--primary)] hover:underline font-medium inline-flex items-center gap-1 pt-1"
                  >
                    View full permissions <ChevronRight size={11} />
                  </button>
                </div>
              </div>

              {/* Store Access Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--foreground)] block">
                  Store access
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs text-[var(--foreground)] cursor-pointer">
                    <input
                      type="radio"
                      name="invite-store-access"
                      checked={inviteStoreAccessType === "all"}
                      onChange={() => setInviteStoreAccessType("all")}
                    />
                    <span>All current and future stores</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-[var(--foreground)] cursor-pointer">
                    <input
                      type="radio"
                      name="invite-store-access"
                      checked={inviteStoreAccessType === "selected"}
                      onChange={() => setInviteStoreAccessType("selected")}
                    />
                    <span>Selected stores only</span>
                  </label>

                  {inviteStoreAccessType === "selected" && (
                    <div className="pl-6 space-y-1.5 pt-1">
                      {availableStores.map((st) => (
                        <label
                          key={st.id}
                          className="flex items-center gap-2 text-xs text-[var(--foreground)] cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={inviteSelectedStores.includes(st.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setInviteSelectedStores([...inviteSelectedStores, st.id]);
                              } else {
                                setInviteSelectedStores(
                                  inviteSelectedStores.filter((id) => id !== st.id),
                                );
                              }
                            }}
                          />
                          <span>
                            {st.name} ({st.platform})
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Personal Message */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--foreground)] block">
                  Personal message <span className="text-[var(--muted-foreground)] font-normal">(optional)</span>
                </label>
                <textarea
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 text-xs bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:border-[var(--ring)] resize-none"
                  placeholder="You’ll use Reloopin to help manage our customer loyalty program."
                />
              </div>

              {inviteError && (
                <div className="p-3 rounded-lg border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 text-xs text-[var(--destructive)] flex items-start gap-2">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <span>{inviteError}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 mt-5 pt-3 border-t border-[var(--border)]">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setInviteModalOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  size="sm"
                  disabled={isSendingInvite}
                  className="text-xs min-w-[110px]"
                  data-testid="send-invitation-button"
                >
                  {isSendingInvite ? "Sending invitation..." : "Send invitation"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </Modal>

      {/* ========================================================================= */}
      {/* SHEET 1: ROLE PERMISSIONS MATRIX */}
      {/* ========================================================================= */}
      <Modal
        open={permissionsSheetOpen}
        onClose={() => setPermissionsSheetOpen(false)}
        title="Role permissions"
        description="Compare capabilities and administrative access granted to each role."
        side={true}
        wide={true}
      >
        <div className="pt-2">
          <div className="table-container border border-[var(--border)] rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--muted)] border-b border-[var(--border)]">
                  <th className="py-2.5 px-3 font-semibold text-[var(--foreground)]">Capability</th>
                  <th className="py-2.5 px-2 text-center font-semibold text-[var(--foreground)]">Owner</th>
                  <th className="py-2.5 px-2 text-center font-semibold text-[var(--foreground)]">Admin</th>
                  <th className="py-2.5 px-2 text-center font-semibold text-[var(--foreground)]">Staff</th>
                  <th className="py-2.5 px-2 text-center font-semibold text-[var(--foreground)]">Viewer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {roleCapabilityMatrix.map((cap) => (
                  <tr key={cap.id} className="hover:bg-[var(--muted)]/40">
                    <td className="py-2.5 px-3 text-[11px] font-medium text-[var(--foreground)]">
                      {cap.label}
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <PermissionBadge status={cap.owner} />
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <PermissionBadge status={cap.admin} />
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <PermissionBadge status={cap.staff} />
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <PermissionBadge status={cap.viewer} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>

      {/* ========================================================================= */}
      {/* SHEET 2: EDIT MEMBER ACCESS */}
      {/* ========================================================================= */}
      <Modal
        open={editMemberSheetOpen}
        onClose={() => setEditMemberSheetOpen(false)}
        title="Edit member access"
        description={`Modify role and store access for ${selectedMember?.name}.`}
        side={true}
      >

          {selectedMember && (
            <div className="p-5 space-y-6">
              {/* Member Summary */}
              <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--muted)]/40 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-[var(--border)] bg-[var(--muted)] flex items-center justify-center font-bold text-xs">
                  {selectedMember.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-xs text-[var(--foreground)]">
                    {selectedMember.name}
                  </div>
                  <div className="text-[11px] text-[var(--muted-foreground)]">
                    {selectedMember.email}
                  </div>
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--foreground)] block">Role</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as TeamRole)}
                  disabled={selectedMember.role === "owner"}
                  className="w-full px-3 py-2 text-xs bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--ring)]"
                >
                  {selectedMember.role === "owner" ? (
                    <option value="owner">Owner · Full account access</option>
                  ) : (
                    <>
                      <option value="admin">Admin</option>
                      <option value="staff">Staff</option>
                      <option value="viewer">Viewer</option>
                    </>
                  )}
                </select>
                {selectedMember.role === "owner" && (
                  <p className="text-[11px] text-[var(--muted-foreground)]">
                    To change the owner’s role, transfer ownership first.
                  </p>
                )}
              </div>

              {/* Store Access Selection */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-[var(--foreground)] block">
                  Store access
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs text-[var(--foreground)] cursor-pointer">
                    <input
                      type="radio"
                      name="edit-store-access"
                      checked={editStoreAccessType === "all"}
                      onChange={() => setEditStoreAccessType("all")}
                    />
                    <span>All current and future stores</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-[var(--foreground)] cursor-pointer">
                    <input
                      type="radio"
                      name="edit-store-access"
                      checked={editStoreAccessType === "selected"}
                      onChange={() => setEditStoreAccessType("selected")}
                    />
                    <span>Selected stores only</span>
                  </label>

                  {editStoreAccessType === "selected" && (
                    <div className="pl-6 space-y-1.5 pt-1">
                      {availableStores.map((st) => (
                        <label
                          key={st.id}
                          className="flex items-center gap-2 text-xs text-[var(--foreground)] cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={editSelectedStores.includes(st.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setEditSelectedStores([...editSelectedStores, st.id]);
                              } else {
                                setEditSelectedStores(
                                  editSelectedStores.filter((id) => id !== st.id),
                                );
                              }
                            }}
                          />
                          <span>
                            {st.name} ({st.platform})
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Suspend Account Option */}
              {selectedMember.role !== "owner" && (
                <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-medium text-[var(--foreground)]">
                      Account status
                    </div>
                    <div className="text-[11px] text-[var(--muted-foreground)]">
                      Temporarily revoke access to all stores.
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant={selectedMember.status === "suspended" ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      const newStatus: MemberStatus =
                        selectedMember.status === "suspended" ? "active" : "suspended";
                      onUpdateMemberAccess(selectedMember.id, { status: newStatus });
                      setSelectedMember({ ...selectedMember, status: newStatus });
                      toast.info(`Member status set to ${newStatus}`);
                    }}
                    className="text-xs h-7"
                  >
                    {selectedMember.status === "suspended" ? "Reactivate" : "Suspend"}
                  </Button>
                </div>
              )}

              <div className="pt-4 border-t border-[var(--border)] flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditMemberSheetOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={handleSaveEditAccess}
                  className="text-xs"
                >
                  Save changes
                </Button>
              </div>
            </div>
          )}
      </Modal>

      {/* ========================================================================= */}
      {/* DIALOG 2: ROLE CHANGE CONFIRMATION */}
      {/* ========================================================================= */}
      <Modal
        open={changeRoleDialogOpen}
        onClose={() => setChangeRoleDialogOpen(false)}
        title={
          pendingTargetRole === "admin"
            ? `Give ${selectedMember?.name} Admin access?`
            : `Change ${selectedMember?.name} to ${pendingTargetRole}?`
        }
        description={
          pendingTargetRole === "admin"
            ? `${selectedMember?.name} will be able to manage loyalty settings, email marketing, integrations, and other team members for assigned stores.`
            : `${selectedMember?.name} will lose permission to create or edit customer and loyalty data.`
        }
      >
        <div className="pt-4 flex items-center justify-end gap-2 border-t border-[var(--border)]">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setChangeRoleDialogOpen(false)}
            className="text-xs"
          >
            Keep current role
          </Button>
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={handleConfirmRoleChange}
            className="text-xs"
          >
            Change role
          </Button>
        </div>
      </Modal>

      {/* ========================================================================= */}
      {/* DIALOG 3: REMOVE TEAM MEMBER */}
      {/* ========================================================================= */}
      <Modal
        open={removeMemberDialogOpen}
        onClose={() => setRemoveMemberDialogOpen(false)}
        title={`Remove ${selectedMember?.name} from the team?`}
        description={`${selectedMember?.name} will immediately lose access to Northstar Goods and Urban Goods. Their previous activity will remain in the account audit history.`}
      >
        <div className="pt-4 flex items-center justify-end gap-2 border-t border-[var(--border)]">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setRemoveMemberDialogOpen(false)}
            className="text-xs"
          >
            Keep member
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleConfirmRemove}
            className="text-xs"
            data-testid="confirm-remove-member-button"
          >
            Remove member
          </Button>
        </div>
      </Modal>

      {/* ========================================================================= */}
      {/* DIALOG 4: LEAVE TEAM */}
      {/* ========================================================================= */}
      <Modal
        open={leaveModalOpen}
        onClose={() => setLeaveModalOpen(false)}
        title={`Leave ${currentStoreName}?`}
        description="You will lose access to its customers, rewards, analytics, and settings. An administrator will need to invite you back."
      >
        <div className="pt-4 flex items-center justify-end gap-2 border-t border-[var(--border)]">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setLeaveModalOpen(false)}
            className="text-xs"
          >
            Stay on team
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => {
              if (selectedMember) onLeaveTeam(selectedMember.id);
              setLeaveModalOpen(false);
              toast.info(`You have left ${currentStoreName}`);
            }}
            className="text-xs"
          >
            Leave team
          </Button>
        </div>
      </Modal>

      {/* ========================================================================= */}
      {/* DIALOG 5: TRANSFER ACCOUNT OWNERSHIP */}
      {/* ========================================================================= */}
      <Modal
        open={transferModalOpen}
        onClose={() => setTransferModalOpen(false)}
        title="Transfer account ownership"
        description="Choose the team member who will become the new account owner."
      >
        <div className="space-y-4 pt-2">
          {/* Step 1: Select Admin */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--foreground)] block">
              Select new owner (Active Admins only)
            </label>
            <select
              value={transferTargetAdminId}
              onChange={(e) => setTransferTargetAdminId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--ring)]"
            >
              <option value="">Choose an active admin...</option>
              {members
                .filter((m) => m.role === "admin" && m.status === "active")
                .map((adm) => (
                  <option key={adm.id} value={adm.id}>
                    {adm.name} ({adm.email})
                  </option>
                ))}
            </select>
          </div>

          {/* Consequences Checklist */}
          <div className="p-3.5 rounded-xl bg-[var(--muted)]/50 border border-[var(--border)] space-y-2 text-xs text-[var(--muted-foreground)]">
            <div className="font-semibold text-[var(--foreground)] text-[11px] uppercase tracking-wider">
              What happens during ownership transfer:
            </div>
            <ul className="space-y-1 text-[11px]">
              <li className="flex items-start gap-1.5">
                <span className="text-[var(--warning,#f59e0b)]">•</span>
                New owner receives full, unconstrained account access.
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[var(--warning,#f59e0b)]">•</span>
                Your account role becomes Admin.
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[var(--warning,#f59e0b)]">•</span>
                Billing and API credential authority move to the new owner.
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[var(--warning,#f59e0b)]">•</span>
                The ownership change takes effect across all stores immediately.
              </li>
            </ul>
          </div>

          {/* Confirmation input */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--foreground)] block">
              Type <strong className="text-[var(--foreground)] font-mono">TRANSFER</strong> to confirm:
            </label>
            <input
              type="text"
              value={transferConfirmText}
              onChange={(e) => setTransferConfirmText(e.target.value)}
              placeholder="TRANSFER"
              className="w-full px-3 py-2 text-xs font-mono bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--ring)]"
            />
          </div>

          <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-[var(--border)]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setTransferModalOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={
                !transferTargetAdminId || transferConfirmText.trim() !== "TRANSFER"
              }
              onClick={handleConfirmTransfer}
              className="text-xs"
            >
              Transfer ownership
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function PermissionBadge({ status }: { status: "allowed" | "read_only" | "not_allowed" }) {
  if (status === "allowed") {
    return (
      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[var(--success,#10b981)]/10 text-[var(--success,#10b981)]">
        Allowed
      </span>
    );
  }
  if (status === "read_only") {
    return (
      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[var(--warning,#f59e0b)]/10 text-[var(--warning,#f59e0b)]">
        Read only
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[var(--muted)] text-[var(--muted-foreground)]">
      Not allowed
    </span>
  );
}
