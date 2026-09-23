"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bell,
  CheckCircle2,
  ChevronRight,
  ChevronsUpDown,
  Coins,
  Copy,
  CreditCard,
  Crown,
  Eye,
  Gift,
  Home,
  Info,
  Layers,
  LifeBuoy,
  Mail,
  MessageCircle,
  Menu as MenuIcon,
  MoreHorizontal,
  Palette,
  Pause,
  Play,
  Plug,
  Plus,
  Search,
  Send,
  Settings as SettingsIcon,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  Users,
  X,
  Zap,
  Clock,
  Sun,
  Moon,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import {
  Flow,
  StoreData,
  Template,
  defaults,
  events,
  initialStore,
  newFlow,
  validateEmail,
} from "@/lib/model";
import { Button } from "./ui/button";
import { Menu } from "./ui/menu";
import { Modal } from "./ui/dialog";
import { EmailCanvas, EventIcons, Preview } from "./email-preview";
import { EmailEditor, Field } from "./editor";
import { FlowBuilder, RecipientSummary } from "./flow-builder";
import { Branding, Settings } from "./settings";
import { CampaignDetails } from "./campaign-details";
import { ConversationPage } from "./conversation/conversation-page";
import { AnalyticsModule } from "./analytics/analytics-module";
import { MerchantDashboard } from "./dashboard/merchant-dashboard";
const tabs = [
  "Templates",
  "Campaigns",
  "Automations",
  "Unsubscribers",
  "Settings",
];
const nav = [
  { name: "Dashboard", Icon: Home },
  { name: "Points", Icon: Coins },
  { name: "VIP tiers", Icon: Crown },
  { name: "Rewards", Icon: Gift },
  { name: "Customers", Icon: Users },
  { name: "Analytics", Icon: BarChart3 },
  { name: "Email marketing", Icon: Mail },
  { name: "Conversation", Icon: MessageCircle },
];
type Confirm = {
  title: string;
  description: string;
  action: () => void;
  label?: string;
};
const suppression = [
  {
    name: "Olivia Wilson",
    email: "olivia@example.com",
    reason: "Unsubscribed",
    source: "Email footer",
    date: "Sep 15, 2026",
  },
  {
    name: "Liam Chen",
    email: "liam@example.com",
    reason: "Unsubscribed",
    source: "Preferences page",
    date: "Sep 14, 2026",
  },
  {
    name: "Emma Davis",
    email: "emma@example.com",
    reason: "Missing consent",
    source: "Store import",
    date: "Sep 14, 2026",
  },
  {
    name: "Noah Patel",
    email: "noah@example.com",
    reason: "Unsubscribed",
    source: "Email footer",
    date: "Sep 12, 2026",
  },
  {
    name: "Ava Thompson",
    email: "ava@example.com",
    reason: "Missing consent",
    source: "Store import",
    date: "Sep 10, 2026",
  },
  {
    name: "James Miller",
    email: "james@example.com",
    reason: "Unsubscribed",
    source: "Preferences page",
    date: "Sep 9, 2026",
  },
];
export default function Dashboard({
  campaignEditorId,
  automationEditorId,
  workspace = "emails",
}: {
  campaignEditorId?: string;
  automationEditorId?: string;
  workspace?: "dashboard" | "emails" | "conversation" | "analytics";
}) {
  const flowEditorId = campaignEditorId || automationEditorId;
  const router = useRouter();
  const [store, setStore] = useState("northstar");
  const [data, setData] = useState<StoreData | null>(null);
  const [tab, setTab] = useState("Templates");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [library, setLibrary] = useState("Ready-made");
  const [edit, setEdit] = useState<Template | null>(null);
  const [flow, setFlow] = useState<Flow | null>(null);
  const [branding, setBranding] = useState(false);
  const [returnFlow, setReturnFlow] = useState<Flow | null>(null);
  const [dirty, setDirty] = useState(false);
  const [preview, setPreview] = useState<Template | null>(null);
  const [test, setTest] = useState<Template | null>(null);
  const [testAddress, setTestAddress] = useState("alex@northstargoods.example");
  const [testState, setTestState] = useState("idle");
  const [testVerified, setTestVerified] = useState(false);
  const [confirm, setConfirm] = useState<Confirm | null>(null);
  const [create, setCreate] = useState(false);
  const [name, setName] = useState("");
  const [detail, setDetail] = useState<Flow | null>(null);
  const [detailPreview, setDetailPreview] = useState(false);
  const [info, setInfo] = useState("");
  const [mobileNav, setMobileNav] = useState(false);
  const [dark, setDark] = useState(false);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
    return () => {
      document.documentElement.classList.remove("dark");
      document.documentElement.style.colorScheme = "";
    };
  }, [dark]);
  const testVersion = useRef(0);
  const ready = useRef(false);
  useEffect(() => {
    queueMicrotask(() => {
      try {
        const raw = localStorage.getItem("reloopin:store");
        const s = raw === "willow" ? "willow" : "northstar";
        setStore(s);
        const saved = localStorage.getItem(`reloopin:v1:${s}`);
        const loaded: StoreData = saved ? JSON.parse(saved) : initialStore(s);
        setData(loaded);
        const query = new URLSearchParams(window.location.search);
        const requestedTab = query.get("tab");
        if (requestedTab && tabs.includes(requestedTab)) setTab(requestedTab);
        const kind =
          automationEditorId || (!campaignEditorId && query.has("automation"))
            ? "automation"
            : "campaign";
        const requestedFlowId = flowEditorId || query.get(kind);
        if (requestedFlowId) {
          const draft = loaded.flows.find(
            (item) =>
              item.id === requestedFlowId &&
              item.kind === kind &&
              item.status === "Draft",
          );
          if (draft) {
            setFlow(structuredClone(draft));
            setTab(kind === "automation" ? "Automations" : "Campaigns");
          } else if (flowEditorId) {
            toast.error(
              `This ${kind} draft is unavailable in the selected store.`,
            );
            router.replace(
              `/?tab=${kind === "automation" ? "Automations" : "Campaigns"}`,
            );
          }
        }
      } catch {
        setData(initialStore("northstar"));
        toast.error(
          "Saved data could not be loaded. Demo defaults are available.",
        );
      }
      ready.current = true;
    });
  }, [campaignEditorId, automationEditorId, flowEditorId, router]);
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  function persist(next: StoreData) {
    try {
      localStorage.setItem(`reloopin:v1:${store}`, JSON.stringify(next));
      setData(next);
      return true;
    } catch {
      toast.error(
        "Couldn’t save locally. Your changes are still here. Browser storage may be full.",
      );
      return false;
    }
  }
  function navigate(action: () => void) {
    if (dirty)
      setConfirm({
        title: "Leave with unsaved changes?",
        description:
          "Changes since your last save will be discarded. Your saved templates and drafts are safe.",
        label: "Discard changes",
        action: () => {
          setDirty(false);
          action();
        },
      });
    else action();
  }
  function goTab(next: string) {
    navigate(() => {
      if (flowEditorId) {
        router.push(`/?tab=${encodeURIComponent(next)}`);
        return;
      }
      setTab(next);
      setEdit(null);
      setFlow(null);
      setBranding(false);
      setSearch("");
      setFilter("all");
      setMobileNav(false);
    });
  }
  function switchStore(s: string) {
    navigate(() => {
      try {
        const saved = localStorage.getItem(`reloopin:v1:${s}`);
        setData(saved ? JSON.parse(saved) : initialStore(s));
        localStorage.setItem("reloopin:store", s);
        setStore(s);
        setEdit(null);
        setFlow(null);
        setReturnFlow(null);
        setBranding(false);
        setDetail(null);
        setTest(null);
        setPreview(null);
        setTab("Templates");
        setSearch("");
        setFilter("all");
        if (workspace === "dashboard") {
          router.replace(`/dashboard?store=${s === "urban" ? "urban-goods" : "northstar-goods"}`);
        } else if (flowEditorId) {
          router.replace("/");
        }
      } catch {
        toast.error("Could not load this store. Please retry.");
      }
    });
  }
  function openEditor(t: Template) {
    setEdit(structuredClone(t));
    setDirty(false);
  }
  function saveTemplate() {
    if (!data || !edit) return;
    const errors = validateEmail(edit);
    if (errors.length) {
      toast.error(errors[0]);
      return;
    }
    const saved = { ...edit, modified: true, updated: "Just now" };
    const templates = data.templates.some((t) => t.id === saved.id)
      ? data.templates.map((t) => (t.id === saved.id ? saved : t))
      : [...data.templates, saved];
    if (persist({ ...data, templates })) {
      setEdit(saved);
      setDirty(false);
      toast.success("Template saved.");
    }
  }
  function duplicate(t: Template) {
    if (!data) return;
    const copy = {
      ...t,
      id: crypto.randomUUID(),
      name: `${t.name} (copy)`,
      custom: true,
      modified: false,
      updated: "Just now",
    };
    if (persist({ ...data, templates: [...data.templates, copy] })) {
      setLibrary("My templates");
      toast.success("Template duplicated.");
    }
  }
  function saveFlow(f: Flow, close = false) {
    if (!data) return false;
    const existing = data.flows.find((x) => x.id === f.id);
    const saved = {
      ...f,
      name: f.name.trim() || `Untitled ${f.kind}`,
      updated: "Just now",
      ...(f.status === "Draft" && existing?.status === "Active"
        ? { published: existing }
        : {}),
    };
    if (
      persist({
        ...data,
        flows: data.flows.some((x) => x.id === f.id)
          ? data.flows.map((x) => (x.id === f.id ? saved : x))
          : [saved, ...data.flows],
      })
    ) {
      setDirty(false);
      if (close) {
        setFlow(null);
        setTab(f.kind === "campaign" ? "Campaigns" : "Automations");
      }
      toast.success(
        f.status === "Sent"
          ? "Demo campaign sent. No real emails were sent."
          : f.status === "Scheduled"
            ? `Scheduled for ${f.schedule.replace("T", " at ")} (Asia/Kathmandu).`
            : f.status === "Active"
              ? "Automation is active in the demo."
              : "Draft saved.",
      );
      return true;
    }
    return false;
  }
  function testOpen(t: Template) {
    setTest(structuredClone(t));
    setTestState("idle");
    setTestAddress("alex@northstargoods.example");
    setTestVerified(false);
    testVersion.current++;
  }
  async function sendTest() {
    if (!data || !test) return;
    if (!data.sender.ready) {
      toast.error("Set up your sender in Settings first.");
      return;
    }
    if (validateEmail(test).length) {
      toast.error(validateEmail(test)[0]);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testAddress)) {
      toast.error("Enter a valid email address.");
      return;
    }
    if (testAddress !== "alex@northstargoods.example" && !testVerified) {
      setTestState("verify");
      return;
    }
    const version = testVersion.current;
    setTestState("sending");
    await new Promise((r) => setTimeout(r, 800));
    if (version !== testVersion.current) return;
    setTestState("sent");
    persist({
      ...data,
      tests: [
        {
          name: test.name,
          date: new Date().toISOString(),
          address: testAddress,
        },
        ...data.tests,
      ].slice(0, 20),
    });
  }
  if (!data)
    return (
      <div className="loading-screen">
        <div className="brand-logo">
          <Layers /> reloopin<span>®</span>
        </div>
        <div className="skeleton" />
        <p>Getting your workspace ready…</p>
      </div>
    );
  const showMain = workspace === "emails" && !edit && !flow && !branding;
  const filtered = data.templates.filter(
    (t) =>
      (library === "Ready-made" ? !t.custom : t.custom) &&
      `${t.name} ${t.description}`
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (filter === "all" || String(t.event) === filter),
  );
  const flows = data.flows.filter(
    (f) =>
      f.kind === (tab === "Campaigns" ? "campaign" : "automation") &&
      f.name.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "all" || f.status === filter),
  );
  const activeFlows = data.flows.filter(
    (f) => f.status === "Active" || f.published?.status === "Active",
  );
  const openSettingsFromFlow = () => {
    if (flow) {
      saveFlow(flow);
      setReturnFlow(flow);
      setFlow(null);
      setTab("Settings");
      setDirty(false);
    }
  };
  const templateMenu = (t: Template) => [
    {
      label: "Preview email",
      icon: <Eye size={15} />,
      action: () => setPreview(t),
    },
    {
      label: "Send test email",
      icon: <Send size={15} />,
      action: () => testOpen(t),
    },
    {
      label: "Duplicate template",
      icon: <Copy size={15} />,
      action: () => duplicate(t),
    },
    ...(t.modified && !t.custom
      ? [
          {
            label: "Restore default",
            action: () =>
              setConfirm({
                title: `Restore “${t.name}”?`,
                description:
                  "A copy of your current version will be saved in My templates. Shared branding and existing campaigns or automations will not change.",
                label: "Restore default",
                action: () => {
                  persist({
                    ...data,
                    templates: [
                      ...data.templates.map((x) =>
                        x.id === t.id ? { ...defaults[t.event] } : x,
                      ),
                      {
                        ...t,
                        id: crypto.randomUUID(),
                        custom: true,
                        name: `${t.name} · before restore`,
                      },
                    ],
                  });
                  toast.success(
                    "Default restored. A backup is in My templates.",
                  );
                },
              }),
          },
        ]
      : []),
    ...(t.custom
      ? [
          {
            label: "Delete template",
            icon: <Trash2 size={15} />,
            danger: true,
            action: () =>
              setConfirm({
                title: `Delete “${t.name}”?`,
                description:
                  "This removes the library template. Campaign and automation copies remain unchanged.",
                label: "Delete template",
                action: () => {
                  persist({
                    ...data,
                    templates: data.templates.filter((x) => x.id !== t.id),
                  });
                  toast.success("Template deleted.");
                },
              }),
          },
        ]
      : []),
  ];
  return (
    <div className={`app ${dark ? "dark" : ""}`}>
      <Toaster position="bottom-right" richColors />
      <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
        <a
          className="brand-logo"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            if (workspace === "conversation") router.push("/");
            else goTab("Templates");
          }}
        >
          <span className="logo-mark">
            <Layers size={25} />
          </span>
          reloopin<span>®</span>
        </a>
        <Menu
          label="Switch store"
          trigger={
            <div className="store-switch">
              <span className="store-avatar">
                <span>{store === "urban" ? "U" : store === "willow" ? "W" : "N"}</span>
              </span>
              <span>
                <strong>
                  {store === "urban"
                    ? "Urban Goods"
                    : store === "willow"
                    ? "Willow & Co."
                    : "Northstar Goods"}
                </strong>
                <small>
                  <span className="connection-dot" />{" "}
                  {store === "urban" ? "Shopify" : "WooCommerce"}
                </small>
              </span>
              <ChevronsUpDown size={14} />
            </div>
          }
          items={[
            {
              label: "Northstar Goods · WooCommerce",
              action: () => switchStore("northstar"),
            },
            {
              label: "Urban Goods · Shopify",
              action: () => switchStore("urban"),
            },
            {
              label: "Willow & Co. · WooCommerce",
              action: () => switchStore("willow"),
            },
          ]}
        />
        <div className="nav-label">WORKSPACE</div>
        <nav>
          {nav.map(({ name, Icon }) => {
            const isEmailNav = name === "Email marketing" || name === "Emails";
            const isDashboardNav = name === "Dashboard";
            const isAnalyticsNav = name === "Analytics";
            const isConversationNav = name === "Conversation";

            const isActive =
              (isDashboardNav && workspace === "dashboard") ||
              (isEmailNav && workspace === "emails") ||
              (isAnalyticsNav && workspace === "analytics") ||
              (isConversationNav && workspace === "conversation");

            return (
              <button
                key={name}
                className={`nav-item ${isActive ? "nav-active" : ""}`}
                onClick={() => {
                  setMobileNav(false);
                  if (isDashboardNav) {
                    if (workspace !== "dashboard") router.push("/dashboard");
                  } else if (isConversationNav) {
                    if (workspace !== "conversation") router.push("/conversation");
                  } else if (isAnalyticsNav) {
                    if (workspace !== "analytics") router.push("/analytics");
                  } else if (isEmailNav) {
                    if (workspace !== "emails") router.push("/");
                    else goTab("Templates");
                  } else if (name === "VIP tiers") {
                    router.push("/analytics?tab=vip");
                  } else {
                    setInfo(
                      `${name} is part of the wider Reloopin platform. You can review loyalty operations in the Dashboard and Analytics workspaces.`,
                    );
                  }
                }}
              >
                <Icon size={19} />
                <span>{name}</span>
                {isActive && <span className="nav-dot" />}
              </button>
            );
          })}
        </nav>
        <div className="nav-divider" />
        <nav>
          {[
            { name: "Integrations", Icon: Plug },
            { name: "Billing", Icon: CreditCard },
            { name: "Team", Icon: Users },
            { name: "Account settings", Icon: SettingsIcon },
          ].map(({ name, Icon }) => (
            <button
              className="nav-item"
              key={name}
              onClick={() =>
                setInfo(
                  `${name} belongs to the wider platform. Email sender configuration is available in Emails → Settings.`,
                )
              }
            >
              <Icon size={18} />
              <span>{name}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card">
            <span className="help-card-icon">
              <Sparkles size={18} />
            </span>
            <strong>A little help goes a long way</strong>
            <p>Make your next email a good one.</p>
            <button
              onClick={() =>
                setInfo(
                  "Start with a template and customize its wording. Create a campaign for a one-time message, or an automation for future loyalty events. Set up your shared sender once in Settings. All sends in this prototype are simulated.",
                )
              }
            >
              Explore email guides <ArrowUpRightIcon />
            </button>
          </div>
          <button
            className="nav-item"
            onClick={() =>
              setInfo(
                "Need a hand? Explore all eight templates, then create a campaign or automation. This local prototype has no support service connection.",
              )
            }
          >
            <LifeBuoy size={18} />
            <span>Help & support</span>
            <ArrowUpRightIcon />
          </button>
          <div className="profile">
            <span className="avatar">AL</span>
            <div>
              <strong>Alex Lawrence</strong>
              <small>Store owner</small>
            </div>
            <Menu
              label="Account menu"
              trigger={<MoreHorizontal size={18} />}
              items={[
                {
                  label: dark ? "Use light theme" : "Use dark theme",
                  action: () => setDark(!dark),
                },
                {
                  label: "About this prototype",
                  action: () =>
                    setInfo(
                      "Reloopin Emails · frontend prototype. All names, addresses, counts, dates, and sends are demo data. Changes are saved in this browser, separately for each store. No real SMTP connection or email delivery occurs.",
                    ),
                },
              ]}
            />
          </div>
        </div>
      </aside>
      {mobileNav && (
        <button
          className="sidebar-backdrop"
          aria-label="Close navigation"
          onClick={() => setMobileNav(false)}
        />
      )}
      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumbs">
            <button
              aria-label="Toggle navigation"
              className="icon-button mobile-menu"
              onClick={() => setMobileNav(!mobileNav)}
            >
              <MenuIcon size={20} />
            </button>
            {workspace === "analytics" ? (
              <BarChart3 size={17} />
            ) : workspace === "conversation" ? (
              <MessageCircle size={17} />
            ) : workspace === "dashboard" ? (
              <Home size={17} />
            ) : (
              <Mail size={17} />
            )}
            <span>Workspace</span>
            <ChevronRight size={13} />
            <strong>
              {workspace === "analytics"
                ? "Analytics"
                : workspace === "conversation"
                  ? "Conversation"
                  : workspace === "dashboard"
                    ? "Dashboard"
                    : "Emails"}
            </strong>
          </div>
          <div className="topbar-right">
            <span className="demo-label">Demo workspace</span>
            <button
              className="icon-button"
              aria-label="Toggle theme"
              onClick={() => setDark(!dark)}
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              className="icon-button"
              aria-label="Notifications"
              onClick={() =>
                setInfo(
                  "You’re all caught up. Your saved templates and draft campaigns are ready when you are.",
                )
              }
            >
              <Bell size={19} />
            </button>
            <span className="topbar-divider" />
            <span className="avatar small">AL</span>
          </div>
        </header>
        <main
          className={`main-content ${
            workspace === "conversation" ? "conversation-main" : ""
          } ${workspace === "analytics" ? "analytics-main" : ""} ${
            workspace === "dashboard" ? "dashboard-main" : ""
          }`}
        >
          {workspace === "conversation" && <ConversationPage />}
          {workspace === "analytics" && <AnalyticsModule store={store} />}
          {workspace === "dashboard" && <MerchantDashboard initialStore={store} />}
          {showMain && (
            <>
              <div className="workspace-heading">
                <div className="eyebrow">
                  CONNECT. CELEBRATE. BRING THEM BACK.
                </div>
                <h1>Good relationships start with a little hello.</h1>
                <p>
                  Thoughtful emails for every step of your customer’s journey.
                </p>
                <div className="workspace-heading-art">
                  <Mail />
                  <span className="art-small-dot" />
                  <span className="art-line" />
                </div>
              </div>
              <nav className="tabs" aria-label="Email sections">
                {tabs.map((t) => (
                  <button
                    key={t}
                    onClick={() => goTab(t)}
                    className={tab === t ? "tab-active" : ""}
                  >
                    {t}
                    {t === "Automations" && <span>{activeFlows.length}</span>}
                  </button>
                ))}
              </nav>
            </>
          )}
          {showMain && tab === "Templates" && (
            <>
              <div className="page-heading">
                <div>
                  <h2>Email templates</h2>
                  <p>Start with a ready-made email or create your own.</p>
                </div>
                <div className="heading-actions">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setBranding(true);
                      setDirty(false);
                    }}
                  >
                    <Palette size={16} /> Customize email branding
                  </Button>
                  <Button
                    onClick={() => {
                      setName("");
                      setCreate(true);
                    }}
                  >
                    <Plus size={17} /> Create template
                  </Button>
                </div>
              </div>
              <div className="info-banner">
                <span className="info-banner-icon">
                  <Mail size={18} />
                </span>
                <p>
                  <strong>A starting point for something personal.</strong>{" "}
                  Templates don’t send emails on their own. Use one in a
                  campaign or automation.
                </p>
                <button
                  aria-label="Learn about templates"
                  onClick={() =>
                    setInfo(
                      "Templates are reusable email content. Saving a template never sends an email. Campaigns send a copy once to a selected audience; automations send a copy when a future qualifying event happens.",
                    )
                  }
                >
                  <ArrowRight size={17} />
                </button>
              </div>
              <div className="library-toolbar">
                <div className="segmented">
                  <button
                    onClick={() => setLibrary("Ready-made")}
                    className={library === "Ready-made" ? "selected" : ""}
                  >
                    Ready-made <span>8</span>
                  </button>
                  <button
                    onClick={() => setLibrary("My templates")}
                    className={library === "My templates" ? "selected" : ""}
                  >
                    My templates{" "}
                    <span>{data.templates.filter((t) => t.custom).length}</span>
                  </button>
                </div>
                <div className="filters">
                  <label className="search-field">
                    <Search size={16} />
                    <input
                      aria-label="Search templates"
                      placeholder="Search templates…"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    {search && (
                      <button
                        aria-label="Clear search"
                        onClick={() => setSearch("")}
                      >
                        <X size={14} />
                      </button>
                    )}
                  </label>
                  <div className="select-wrap">
                    <SlidersHorizontal size={15} />
                    <select
                      aria-label="Filter by event"
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                    >
                      <option value="all">All events</option>
                      {events.map((e, i) => (
                        <option key={e} value={i}>
                          {e}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="results-heading">
                <span>
                  {library === "Ready-made"
                    ? "Made for the moments that matter"
                    : "Your own kind of hello"}
                </span>
                <small>{filtered.length} templates</small>
              </div>
              <div className="template-grid">
                {filtered.map((t) => {
                  const Icon = EventIcons[t.event];
                  return (
                    <article className="template-card" key={t.id}>
                      <div
                        className={`template-thumbnail thumbnail-${t.event}`}
                      >
                        <span className="thumbnail-label">
                          {
                            [
                              "A GOOD FIRST HELLO",
                              "EVERY POINT COUNTS",
                              "A MOMENT TO CELEBRATE",
                              "GRATITUDE GOES A LONG WAY",
                              "LOYALTY, REWARDED",
                              "THEIR DAY. YOUR WISHES.",
                              "A FRIENDLY REMINDER",
                              "LET’S RECONNECT",
                            ][t.event]
                          }
                        </span>
                        <div
                          className="mini-email-wrap"
                          onClick={() => setPreview(t)}
                          role="button"
                          tabIndex={0}
                          aria-label={`Preview ${t.name}`}
                          onKeyDown={(e) => e.key === "Enter" && setPreview(t)}
                        >
                          <EmailCanvas template={t} brand={data.brand} mini />
                        </div>
                        <button
                          className="thumbnail-preview"
                          onClick={() => setPreview(t)}
                        >
                          <Eye size={14} /> Preview
                        </button>
                        <span className="thumbnail-bottom">
                          DESIGNED TO FEEL PERSONAL
                        </span>
                      </div>
                      <div className="template-card-content">
                        <div className="template-title-row">
                          <span className={`event-icon event-${t.event}`}>
                            <Icon size={18} />
                          </span>
                          <h3>{t.name}</h3>
                          <span
                            className={`badge ${t.modified ? "success" : ""}`}
                          >
                            {t.custom
                              ? "Custom"
                              : t.modified
                                ? "Customized"
                                : "Default"}
                          </span>
                        </div>
                        <p className="template-description">{t.description}</p>
                        <div className="template-meta">
                          <span>
                            <Layers size={13} /> Text & HTML
                          </span>
                          <span>Updated {t.updated}</span>
                        </div>
                        <div className="template-card-footer">
                          <Button
                            variant="outline"
                            onClick={() => openEditor(t)}
                          >
                            Edit template <ArrowRight size={14} />
                          </Button>
                          <Menu
                            trigger={<MoreHorizontal size={19} />}
                            label={`More actions for ${t.name}`}
                            items={templateMenu(t)}
                          />
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
              {!filtered.length && (
                <Empty
                  icon={<Mail />}
                  title={
                    search || filter !== "all"
                      ? "No matching templates"
                      : "A space for your own ideas"
                  }
                  description={
                    search || filter !== "all"
                      ? "Try a different search or event filter."
                      : "Create an email from scratch, or duplicate a ready-made template."
                  }
                  action={() => {
                    if (search || filter !== "all") {
                      setSearch("");
                      setFilter("all");
                    } else setCreate(true);
                  }}
                  label={
                    search || filter !== "all"
                      ? "Clear filters"
                      : "Create template"
                  }
                />
              )}
              <div className="library-footer">
                <ShieldCheck size={15} />
                <span>Made to look good. Built to feel like you.</span>
                <span>
                  All templates include your branding and an unsubscribe link.
                </span>
              </div>
            </>
          )}
          {edit && (
            <>
              <div className="workflow-header">
                <div className="flex-row">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Back to templates"
                    onClick={() => navigate(() => setEdit(null))}
                  >
                    <ArrowLeft size={19} />
                  </Button>
                  <div>
                    <div className="eyebrow">TEMPLATES / {edit.name}</div>
                    <input
                      className="editable-title"
                      aria-label="Template name"
                      value={edit.name}
                      onChange={(e) => {
                        setEdit({ ...edit, name: e.target.value });
                        setDirty(true);
                      }}
                    />
                  </div>
                  <span className="badge">
                    {dirty ? "Unsaved changes" : "Saved"}
                  </span>
                </div>
                <div className="heading-actions">
                  <Button variant="outline" onClick={() => testOpen(edit)}>
                    <Send size={15} /> Send test email
                  </Button>
                  <Button onClick={saveTemplate} disabled={!edit.name.trim()}>
                    Save template
                  </Button>
                </div>
              </div>
              <EmailEditor
                value={edit}
                onChange={(t) => {
                  setEdit(t);
                  setDirty(true);
                }}
                brand={data.brand}
              />
            </>
          )}
          {flow && flowEditorId && (
            <>
              <div className="workflow-header">
                <div className="flex-row">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Back to ${flow.kind}`}
                    onClick={() =>
                      navigate(() =>
                        router.push(
                          `/?${flow.kind}=${encodeURIComponent(flow.id)}`,
                        ),
                      )
                    }
                  >
                    <ArrowLeft size={19} />
                  </Button>
                  <div>
                    <div className="eyebrow">
                      {flow.kind === "automation" ? "AUTOMATIONS" : "CAMPAIGNS"}{" "}
                      / {flow.name}
                    </div>
                    <h1>Edit {flow.kind} email</h1>
                  </div>
                  <span className="badge">
                    {dirty ? "Unsaved changes" : "Saved"}
                  </span>
                </div>
                <div className="heading-actions">
                  <Button
                    variant="outline"
                    onClick={() => testOpen(flow.email)}
                  >
                    <Send size={15} /> Send test email
                  </Button>
                  <Button
                    onClick={() => {
                      const errors = validateEmail(flow.email);
                      if (errors.length) {
                        toast.error(errors[0]);
                        return;
                      }
                      if (saveFlow(flow))
                        router.push(
                          `/?${flow.kind}=${encodeURIComponent(flow.id)}`,
                        );
                    }}
                  >
                    Save & return to {flow.kind}
                  </Button>
                </div>
              </div>
              <p className="campaign-editor-note">
                Changes apply only to this {flow.kind}. The original library
                template stays unchanged.
              </p>
              <EmailEditor
                value={flow.email}
                onChange={(email) => {
                  setFlow({ ...flow, email });
                  setDirty(true);
                }}
                brand={data.brand}
              />
            </>
          )}
          {flow && !flowEditorId && (
            <FlowBuilder
              flow={flow}
              setFlow={(f) => {
                setFlow(f);
                setDirty(true);
              }}
              data={data}
              onSave={saveFlow}
              onClose={() => navigate(() => setFlow(null))}
              onTest={testOpen}
              onSettings={openSettingsFromFlow}
              onEditTemplate={() => {
                if (saveFlow({ ...flow, status: "Draft" }))
                  router.push(
                    `/${flow.kind}s/${encodeURIComponent(flow.id)}/email`,
                  );
              }}
            />
          )}
          {branding && (
            <Branding
              data={data}
              onDirty={() => setDirty(true)}
              onClose={() => navigate(() => setBranding(false))}
              onSave={(brand) => {
                if (persist({ ...data, brand })) {
                  setDirty(false);
                  setBranding(false);
                  toast.success("Shared email branding updated.");
                }
              }}
            />
          )}
          {showMain && ["Campaigns", "Automations"].includes(tab) && (
            <>
              <div className="page-heading">
                <div>
                  <h2>{tab}</h2>
                  <p>
                    {tab === "Campaigns"
                      ? "One thoughtful email. The right audience. Your perfect moment."
                      : "The right email, at the moments that matter."}
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setFlow(
                      newFlow(tab === "Campaigns" ? "campaign" : "automation"),
                    );
                    setDirty(false);
                  }}
                >
                  <Plus size={17} /> Create{" "}
                  {tab === "Campaigns" ? "campaign" : "automation"}
                </Button>
              </div>
              <div className="stats-grid">
                {(tab === "Campaigns"
                  ? [
                      {
                        label: "Total campaigns",
                        value: data.flows.filter((f) => f.kind === "campaign")
                          .length,
                        Icon: Mail,
                      },
                      {
                        label: "Sent campaigns",
                        value: data.flows.filter(
                          (f) => f.kind === "campaign" && f.status === "Sent",
                        ).length,
                        Icon: Send,
                      },
                      {
                        label: "Scheduled campaigns",
                        value: data.flows.filter(
                          (f) =>
                            f.kind === "campaign" && f.status === "Scheduled",
                        ).length,
                        Icon: Clock,
                      },
                      {
                        label: "Recipient sends · demo",
                        value: data.flows
                          .filter(
                            (f) => f.kind === "campaign" && f.status === "Sent",
                          )
                          .reduce((a, f) => a + f.recipients, 0),
                        Icon: Users,
                      },
                    ]
                  : [
                      {
                        label: "Total automations",
                        value: data.flows.filter((f) => f.kind === "automation")
                          .length,
                        Icon: Zap,
                      },
                      {
                        label: "Active",
                        value: activeFlows.length,
                        Icon: Play,
                      },
                      {
                        label: "Paused",
                        value: data.flows.filter(
                          (f) =>
                            f.kind === "automation" && f.status === "Paused",
                        ).length,
                        Icon: Pause,
                      },
                    ]
                ).map((s) => (
                  <div className="stat-card" key={s.label}>
                    <span>
                      {s.label}
                      <s.Icon size={17} />
                    </span>
                    <strong>{s.value.toLocaleString()}</strong>
                  </div>
                ))}
              </div>
              <div className="table-toolbar">
                <div className="filter-pills">
                  {(tab === "Campaigns"
                    ? ["all", "Draft", "Scheduled", "Sent", "Canceled"]
                    : [
                        "all",
                        "Draft",
                        "Active",
                        "Paused",
                        "Needs attention",
                        "Archived",
                      ]
                  ).map((f) => (
                    <button
                      className={filter === f ? "selected" : ""}
                      onClick={() => setFilter(f)}
                      key={f}
                    >
                      {f === "all" ? "All" : f}
                    </button>
                  ))}
                </div>
                <label className="search-field">
                  <Search size={16} />
                  <input
                    aria-label={`Search ${tab.toLowerCase()}`}
                    placeholder={`Search ${tab.toLowerCase()}…`}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </label>
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>{tab === "Campaigns" ? "Campaign" : "Automation"}</th>
                      <th>Status</th>
                      <th className="priority-col">
                        {tab === "Campaigns" ? "Audience" : "Trigger"}
                      </th>
                      <th className="priority-col">
                        {tab === "Campaigns" ? "Recipients" : "Timing"}
                      </th>
                      <th className="priority-col">Last updated</th>
                      <th>
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {flows.map((f) => (
                      <tr key={f.id}>
                        <td>
                          <button
                            className="table-name"
                            onClick={() =>
                              f.status === "Draft"
                                ? (setFlow(structuredClone(f)), setDirty(false))
                                : setDetail(f)
                            }
                          >
                            <span className="table-icon">
                              {f.kind === "campaign" ? (
                                <Mail size={18} />
                              ) : (
                                <Zap size={18} />
                              )}
                            </span>
                            <span>
                              {f.name}
                              <small>
                                {f.kind === "campaign"
                                  ? f.type
                                  : events[f.event]}
                              </small>
                            </span>
                          </button>
                        </td>
                        <td>
                          <span
                            className={`badge ${f.status === "Active" || f.status === "Sent" ? "success" : f.status === "Scheduled" ? "warning" : ""}`}
                          >
                            <span className="status-dot" />
                            {f.status}
                          </span>
                          {f.published && (
                            <small className="muted">
                              Published version active
                            </small>
                          )}
                        </td>
                        <td className="priority-col">
                          {f.kind === "campaign"
                            ? f.audience === "all"
                              ? "All eligible customers"
                              : f.audience === "tiers"
                                ? f.tiers.join(", ")
                                : `${f.minimum}+ points`
                            : events[f.event]}
                        </td>
                        <td className="priority-col">
                          {f.kind === "campaign"
                            ? f.status === "Sent"
                              ? f.recipients.toLocaleString()
                              : "—"
                            : f.timing}
                        </td>
                        <td className="priority-col">{f.updated}</td>
                        <td>
                          <Menu
                            label={`Actions for ${f.name}`}
                            trigger={<MoreHorizontal size={19} />}
                            items={[
                              {
                                label:
                                  f.status === "Draft"
                                    ? "Continue editing"
                                    : "View details",
                                icon: <Eye size={15} />,
                                action: () =>
                                  f.status === "Draft"
                                    ? (setFlow(structuredClone(f)),
                                      setDirty(false))
                                    : setDetail(f),
                              },
                              ...(["Active", "Paused", "Scheduled"].includes(
                                f.status,
                              )
                                ? [
                                    {
                                      label:
                                        f.status === "Scheduled"
                                          ? "Edit & reschedule"
                                          : "Edit automation",
                                      action: () => {
                                        setFlow({
                                          ...structuredClone(f),
                                          status: "Draft",
                                          published:
                                            f.status === "Active"
                                              ? structuredClone(f)
                                              : undefined,
                                        });
                                        setDirty(false);
                                      },
                                    },
                                  ]
                                : []),
                              {
                                label: "Duplicate",
                                icon: <Copy size={15} />,
                                action: () =>
                                  saveFlow({
                                    ...structuredClone(f),
                                    id: crypto.randomUUID(),
                                    name: f.name + " (copy)",
                                    status: "Draft",
                                    published: undefined,
                                    schedule: "",
                                    recipients: 0,
                                  }),
                              },
                              ...(f.status === "Active"
                                ? [
                                    {
                                      label: "Pause automation",
                                      icon: <Pause size={15} />,
                                      action: () =>
                                        setConfirm({
                                          title: "Pause this automation?",
                                          description:
                                            "New enrollments stop and pending demo emails are canceled. Messages already accepted by a provider cannot be recalled.",
                                          label: "Pause automation",
                                          action: () =>
                                            saveFlow({
                                              ...f,
                                              status: "Paused",
                                            }),
                                        }),
                                    },
                                  ]
                                : []),
                              ...(f.status === "Paused"
                                ? [
                                    {
                                      label: "Review & activate",
                                      icon: <Play size={15} />,
                                      action: () => {
                                        setFlow({ ...f, status: "Draft" });
                                        setDirty(false);
                                      },
                                    },
                                  ]
                                : []),
                              ...(f.status === "Scheduled"
                                ? [
                                    {
                                      label: "Cancel schedule",
                                      danger: true,
                                      action: () =>
                                        setConfirm({
                                          title: "Cancel this schedule?",
                                          description:
                                            "This campaign will not be dispatched. Its content will remain available for duplication.",
                                          label: "Cancel schedule",
                                          action: () =>
                                            saveFlow({
                                              ...f,
                                              status: "Canceled",
                                            }),
                                        }),
                                    },
                                  ]
                                : []),
                              ...(f.kind === "automation" &&
                              ["Paused", "Needs attention"].includes(f.status)
                                ? [
                                    {
                                      label: "Archive automation",
                                      danger: true,
                                      action: () =>
                                        setConfirm({
                                          title: "Archive this automation?",
                                          description:
                                            "This automation will stop enrolling customers. Its saved content remains available to duplicate.",
                                          label: "Archive automation",
                                          action: () =>
                                            saveFlow({
                                              ...f,
                                              status: "Archived",
                                            }),
                                        }),
                                    },
                                  ]
                                : []),
                              ...(f.status === "Draft"
                                ? [
                                    {
                                      label: "Delete draft",
                                      danger: true,
                                      action: () =>
                                        setConfirm({
                                          title: "Delete this draft?",
                                          description: f.published
                                            ? "Draft changes will be removed. The published automation stays active."
                                            : "The saved draft will be removed from this browser.",
                                          label: "Delete draft",
                                          action: () =>
                                            persist({
                                              ...data,
                                              flows: f.published
                                                ? data.flows.map((x) =>
                                                    x.id === f.id
                                                      ? f.published!
                                                      : x,
                                                  )
                                                : data.flows.filter(
                                                    (x) => x.id !== f.id,
                                                  ),
                                            }),
                                        }),
                                    },
                                  ]
                                : []),
                            ]}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!flows.length && (
                  <Empty
                    icon={tab === "Campaigns" ? <Mail /> : <Zap />}
                    title={`No ${tab.toLowerCase()} here yet`}
                    description="Create something thoughtful for your customers, or clear your filters."
                    label={`Create ${tab === "Campaigns" ? "campaign" : "automation"}`}
                    action={() =>
                      setFlow(
                        newFlow(
                          tab === "Campaigns" ? "campaign" : "automation",
                        ),
                      )
                    }
                  />
                )}
              </div>
              <p className="section-footnote">
                <Info size={14} /> Demo data. Delivery, opens, and click
                analytics are not available with this connection.
              </p>
            </>
          )}
          {showMain && tab === "Settings" && (
            <Settings
              key={store}
              data={data}
              onDirty={() => setDirty(true)}
              onSave={(sender, name, address) => {
                if (
                  persist({
                    ...data,
                    sender,
                    brand: { ...data.brand, name, address },
                  })
                ) {
                  setDirty(false);
                  toast.success("Demo sender settings saved.");
                }
              }}
              onBranding={() => navigate(() => setBranding(true))}
              onTest={() => testOpen(data.templates[0])}
              onReturn={
                returnFlow
                  ? () =>
                      navigate(() => {
                        setFlow(returnFlow);
                        setReturnFlow(null);
                        setTab(
                          returnFlow.kind === "campaign"
                            ? "Campaigns"
                            : "Automations",
                        );
                      })
                  : undefined
              }
              onDisconnect={() =>
                setConfirm({
                  title: "Disconnect your sender?",
                  description: `${data.flows.filter((f) => f.status === "Scheduled").length} scheduled campaigns and ${activeFlows.length} active automations will need attention. Drafts are preserved; reconnecting does not send overdue emails.`,
                  label: "Disconnect sender",
                  action: () => {
                    persist({
                      ...data,
                      sender: { ...data.sender, ready: false },
                      flows: data.flows.map((f) =>
                        ["Active", "Scheduled"].includes(f.status) ||
                        !!f.published
                          ? {
                              ...f,
                              status: "Needs attention",
                              published: undefined,
                            }
                          : f,
                      ),
                    });
                    setDirty(false);
                    toast.success("Sender disconnected.");
                  },
                })
              }
            />
          )}
          {showMain && tab === "Unsubscribers" && (
            <>
              <div className="page-heading">
                <div>
                  <h2>Unsubscribers</h2>
                  <p>Respect their preferences. Keep your community’s trust.</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    const rows = store === "northstar" ? suppression : [];
                    const blob = new Blob(
                      [
                        "Customer,Email,Reason,Source,Date\n" +
                          rows
                            .map((x) => Object.values(x).join(","))
                            .join("\n"),
                      ],
                      { type: "text/csv" },
                    );
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "demo-unsubscribers.csv";
                    a.click();
                    URL.revokeObjectURL(url);
                    toast.success("Demo exclusions exported.");
                  }}
                >
                  <ArrowDownToLine size={16} /> Export CSV
                </Button>
              </div>
              <div className="info-banner">
                <ShieldCheck size={20} />
                <p>
                  These customers won’t receive marketing emails. A new,
                  explicit consent is needed to subscribe again.
                </p>
              </div>
              <div className="table-toolbar">
                <div className="filter-pills">
                  {["all", "Unsubscribed", "Missing consent"].map((f) => (
                    <button
                      key={f}
                      className={filter === f ? "selected" : ""}
                      onClick={() => setFilter(f)}
                    >
                      {f === "all" ? "All exclusions" : f}
                    </button>
                  ))}
                </div>
                <label className="search-field">
                  <Search size={16} />
                  <input
                    aria-label="Search excluded customers"
                    placeholder="Search customers…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </label>
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Reason</th>
                      <th className="priority-col">Source</th>
                      <th className="priority-col">Date</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {(store === "northstar" ? suppression : [])
                      .filter(
                        (c) =>
                          (filter === "all" || filter === c.reason) &&
                          `${c.name} ${c.email}`
                            .toLowerCase()
                            .includes(search.toLowerCase()),
                      )
                      .map((c) => (
                        <tr key={c.email}>
                          <td>
                            <div className="table-name">
                              <span className="avatar">
                                {c.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                              <span>
                                {c.name}
                                <small>{c.email}</small>
                              </span>
                            </div>
                          </td>
                          <td>
                            <span className="badge">{c.reason}</span>
                          </td>
                          <td className="priority-col">{c.source}</td>
                          <td className="priority-col">{c.date}</td>
                          <td>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setInfo(
                                  `${c.name} (${c.email}) · ${c.reason} via ${c.source} on ${c.date}. Marketing is excluded. Consent cannot be restored by deleting this record.`,
                                )
                              }
                            >
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                {!(store === "northstar" ? suppression : []).filter(
                  (c) =>
                    (filter === "all" || filter === c.reason) &&
                    `${c.name} ${c.email}`
                      .toLowerCase()
                      .includes(search.toLowerCase()),
                ).length && (
                  <Empty
                    icon={<ShieldCheck />}
                    title="No matching exclusions"
                    description="Excluded customers will appear here. Try clearing your search."
                    action={() => {
                      setSearch("");
                      setFilter("all");
                    }}
                    label="Clear filters"
                  />
                )}
              </div>
              <p className="section-footnote">
                <Info size={15} /> Demo records. Bounce and complaint feedback
                is not available with this connection.
              </p>
              <Button
                variant="ghost"
                onClick={() => window.open("/preferences?demo=valid", "_blank")}
              >
                Preview customer preference page <ArrowRight size={14} />
              </Button>
            </>
          )}
        </main>
        <footer className="app-footer">
          <span>© 2026 Reloopin</span>
          <span>A little loyalty goes a long way.</span>
          <button
            onClick={() =>
              setInfo(
                "All data is demo data, stored locally per store. The dashboard uses your supplied Reloopin light and dark semantic color tokens, with shadcn-compatible aliases. See docs/HANDOFF.md for proposed behavior and backend dependencies.",
              )
            }
          >
            Prototype notes <Info size={12} />
          </button>
        </footer>
      </div>
      <Modal
        open={create}
        onClose={() => setCreate(false)}
        title="Create a template"
        description="Start with a simple email, then make it your own. Saving a template never sends an email."
      >
        <Field label="Template name">
          <input
            autoFocus
            placeholder="e.g. A thank-you from our team"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Field>
        <div className="dialog-actions">
          <Button variant="outline" onClick={() => setCreate(false)}>
            Cancel
          </Button>
          <Button
            disabled={!name.trim()}
            onClick={() => {
              setEdit({
                ...defaults[0],
                id: crypto.randomUUID(),
                name: name.trim(),
                custom: true,
                description: "A personal email, made by your team.",
                subject: "A little hello from {{merchant_name}}",
                heading: "A little hello, just for you.",
                body: "Thanks for being part of our community. We’re glad you’re here.",
                updated: "Just now",
              });
              setCreate(false);
              setDirty(true);
            }}
          >
            Create template <ArrowRight size={15} />
          </Button>
        </div>
      </Modal>
      <Modal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        title={confirm?.title || ""}
        description={confirm?.description}
      >
        <div className="dialog-actions">
          <Button variant="outline" onClick={() => setConfirm(null)}>
            Keep editing
          </Button>
          <Button
            onClick={() => {
              confirm?.action();
              setConfirm(null);
            }}
          >
            {confirm?.label || "Confirm"}
          </Button>
        </div>
      </Modal>
      <Modal
        open={!!preview}
        onClose={() => setPreview(null)}
        title={preview?.name || "Email preview"}
        description="See your email with sample customer details."
        wide
      >
        {preview && <Preview template={preview} brand={data.brand} />}
      </Modal>
      <Modal
        open={!!test}
        onClose={() => {
          setTest(null);
          testVersion.current++;
        }}
        title="Send a test email"
        description="Preview the sending flow using sample customer details. No real email is sent in this prototype."
      >
        {testState === "sent" ? (
          <div className="test-success">
            <span>
              <CheckCircle2 size={38} />
            </span>
            <h3>Test send simulated</h3>
            <p>
              The demo accepted your test for <strong>{testAddress}</strong>. No
              message was delivered.
            </p>
            <Button onClick={() => setTest(null)}>Done</Button>
          </div>
        ) : (
          <>
            <div className="test-summary">
              <span className="icon-tile">
                <Mail size={21} />
              </span>
              <div>
                <strong>{test?.name}</strong>
                <p>From {data.brand.name} · sample data</p>
              </div>
            </div>
            <Field label="Send to">
              <input
                type="email"
                value={testAddress}
                onChange={(e) => {
                  setTestAddress(e.target.value);
                  setTestVerified(false);
                  setTestState("idle");
                }}
              />
            </Field>
            <p className="helper muted">
              This uses your current email, including unsaved changes. No
              customers receive this test.
            </p>
            {testState === "verify" && (
              <div className="alert warning">
                <p>
                  This address needs ownership verification. In production,
                  verify it through a secure email link.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setTestVerified(true);
                    setTestState("idle");
                  }}
                >
                  Simulate address verification
                </Button>
              </div>
            )}
            {!data.sender.ready && (
              <div className="alert warning">
                Set up your sender in Settings before testing.
              </div>
            )}
            <div className="dialog-actions">
              <Button
                variant="outline"
                onClick={() => {
                  setTest(null);
                  testVersion.current++;
                }}
              >
                Cancel
              </Button>
              <Button
                disabled={testState === "sending" || !data.sender.ready}
                onClick={sendTest}
              >
                {testState === "sending" ? "Simulating…" : "Send test"}{" "}
                <Send size={14} />
              </Button>
            </div>
          </>
        )}
      </Modal>
      <Modal
        open={!!detail}
        onClose={() => {
          setDetail(null);
          setDetailPreview(false);
        }}
        title={
          detail?.kind === "campaign"
            ? "Email Campaign Detail"
            : detail?.name || ""
        }
        description={
          detail?.kind === "campaign"
            ? detail.name
            : "A snapshot of this email and its sending rules."
        }
        side={detail?.kind === "campaign"}
        wide={detail?.kind !== "campaign"}
      >
        {detail && (
          <>
            {detail.kind === "campaign" ? (
              <CampaignDetails
                campaign={detail}
                data={data}
                onPreview={() => setDetailPreview(true)}
                onExclusions={() => {
                  setDetail(null);
                  setDetailPreview(false);
                  goTab("Unsubscribers");
                }}
              />
            ) : (
              <>
                <div className="detail-grid">
                  <div>
                    <span className="badge success">{detail.status}</span>
                    <div className="review-lines">
                      <div>
                        <span>Type</span>
                        <strong>{events[detail.event]}</strong>
                      </div>
                      <div>
                        <span>Subject</span>
                        <strong>{detail.email.subject}</strong>
                      </div>
                      <div>
                        <span>Schedule</span>
                        <strong>
                          {detail.schedule
                            ? detail.schedule.replace("T", " at ") +
                              " · Asia/Kathmandu"
                            : "Not scheduled"}
                        </strong>
                      </div>
                    </div>
                    <RecipientSummary flow={detail} />
                    <p className="helper muted">
                      {detail.status === "Sent"
                        ? `${detail.recipients.toLocaleString()} demo recipient sends. Delivery feedback is unavailable.`
                        : "No live queue or dispatch service is connected. Demo rules are saved locally."}
                    </p>
                  </div>
                  <EmailCanvas
                    template={detail.email}
                    brand={detail.brand || data.brand}
                  />
                </div>
                <div className="dialog-actions">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setDetailPreview(true);
                    }}
                  >
                    <Eye size={15} /> Preview email
                  </Button>
                  <Button
                    onClick={() => {
                      setDetail(null);
                      setDetailPreview(false);
                    }}
                  >
                    Done
                  </Button>
                </div>
              </>
            )}
            <Modal
              open={detailPreview}
              onClose={() => setDetailPreview(false)}
              title="Email preview"
              description={detail.email.subject}
              wide
            >
              <Preview
                template={detail.email}
                brand={detail.brand || data.brand}
              />
            </Modal>
          </>
        )}
      </Modal>
      <Modal
        open={!!info}
        onClose={() => setInfo("")}
        title="A little context"
        description={info}
      >
        <div className="dialog-actions">
          <Button onClick={() => setInfo("")}>Got it</Button>
        </div>
      </Modal>
    </div>
  );
}
function ArrowUpRightIcon() {
  return <ArrowRight size={14} style={{ transform: "rotate(-35deg)" }} />;
}
function Empty({
  icon,
  title,
  description,
  action,
  label,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: () => void;
  label: string;
}) {
  return (
    <div className="empty-state">
      <span className="icon-tile">{icon}</span>
      <h3>{title}</h3>
      <p>{description}</p>
      <Button variant="outline" onClick={action}>
        {label}
      </Button>
    </div>
  );
}
