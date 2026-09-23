import {
  OnboardingState,
  PlatformOption,
  SyncProgressItem,
  VIPTier,
} from "./onboarding-types";

export const DEFAULT_PLATFORMS: PlatformOption[] = [
  {
    id: "woocommerce",
    name: "WooCommerce",
    badge: "Available",
    availability: "available",
    description: "Connect your WordPress store with automatic webhooks and REST API sync.",
  },
  {
    id: "shopify",
    name: "Shopify",
    badge: "Available",
    availability: "available",
    description: "Install the verified Reloopin Shopify app with instant customer synchronization.",
  },
  {
    id: "wix",
    name: "Wix eCommerce",
    badge: "Coming soon",
    availability: "coming_soon",
    description: "Direct integration for Wix stores is currently in private beta.",
  },
  {
    id: "bigcommerce",
    name: "BigCommerce",
    badge: "Coming soon",
    availability: "coming_soon",
    description: "Enterprise BigCommerce connector launching soon.",
  },
];

export const INITIAL_VIP_TIERS: VIPTier[] = [
  {
    id: "silver",
    name: "Silver",
    minimumPoints: 0,
    color: "#94A3B8",
    isDefault: true,
  },
  {
    id: "gold",
    name: "Gold",
    minimumPoints: 1000,
    color: "#EAB308",
    isDefault: true,
  },
  {
    id: "platinum",
    name: "Platinum",
    minimumPoints: 3000,
    color: "#334155",
    isDefault: true,
  },
];

export interface ColorPreset {
  name: string;
  hex: string;
  isAccessible: boolean;
}

export const PRESET_BRAND_COLORS: ColorPreset[] = [
  { name: "Indigo", hex: "#4F46E5", isAccessible: true },
  { name: "Violet", hex: "#7C3AED", isAccessible: true },
  { name: "Emerald", hex: "#059669", isAccessible: true },
  { name: "Rose", hex: "#E11D48", isAccessible: true },
  { name: "Amber", hex: "#D97706", isAccessible: true },
  { name: "Slate", hex: "#0F172A", isAccessible: true },
];

export const DEFAULT_SYNC_ITEMS: SyncProgressItem[] = [
  {
    id: "customers",
    label: "Customers",
    count: 2486,
    totalTarget: 2486,
    status: "complete",
  },
  {
    id: "orders",
    label: "Orders",
    count: 8420,
    totalTarget: 8420,
    status: "complete",
  },
  {
    id: "products",
    label: "Products",
    count: 684,
    totalTarget: 684,
    status: "complete",
  },
];

export const INITIAL_ONBOARDING_STATE: OnboardingState = {
  currentStep: "welcome",
  completedSteps: [],
  storeConnection: {
    platform: "woocommerce",
    storeName: "Northstar Goods",
    storeUrl: "https://northstargoods.com",
    connectedAt: "Just now",
    connectionState: "select_platform",
    syncProgress: DEFAULT_SYNC_ITEMS.map((item) => ({
      ...item,
      count: 0,
      status: "waiting",
    })),
  },
  earningRule: {
    ruleName: "Points for purchases",
    pointsEarned: 1,
    perOrderSpend: 1,
    minimumOrder: null,
    maximumPoints: null,
    isSaved: false,
  },
  vipTiers: INITIAL_VIP_TIERS,
  branding: {
    brandColor: "#4F46E5",
    storeName: "Northstar Goods",
    previewMode: "open",
    previewCustomer: "existing",
    isSaved: false,
  },
  activationStatus: "idle",
  onboardingCompleted: false,
  tourCompleted: false,
  lastUpdated: new Date().toISOString(),
  systemState: "none",
};

export const ONBOARDING_FAQS = [
  {
    question: "How long does onboarding take?",
    answer:
      "Most merchants complete setup in 5 to 10 minutes. The 4 core steps establish your store connection, basic points earning rule, VIP tiers, and customer widget branding.",
  },
  {
    question: "Can I change my settings after activation?",
    answer:
      "Yes. Every rule, VIP tier, reward, and brand style can be edited, paused, or customized in detail at any time from your dashboard settings.",
  },
  {
    question: "Do existing customers get notified immediately?",
    answer:
      "No. Existing customers will start with 0 points and will only earn points from eligible orders placed after you activate the loyalty program. No automated emails are sent until you configure them.",
  },
  {
    question: "Can I save my progress and finish later?",
    answer:
      "Yes. Click 'Save and exit' at any time. Your progress is saved automatically in your browser and you can resume where you left off.",
  },
];

