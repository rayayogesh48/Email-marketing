export type Template = {
  id: string;
  name: string;
  description: string;
  subject: string;
  preheader: string;
  heading: string;
  greeting: string;
  body: string;
  cta: string;
  url: string;
  event: number;
  custom?: boolean;
  modified?: boolean;
  mode: "text" | "html";
  html: string;
  updated: string;
};
export type Brand = {
  name: string;
  color: string;
  logo: string;
  address: string;
};
export type Sender = {
  email: string;
  reply: string;
  host: string;
  port: string;
  security: string;
  username: string;
  ready: boolean;
};
export type Flow = {
  id: string;
  name: string;
  kind: "campaign" | "automation";
  type: string;
  event: number;
  status: string;
  audience: string;
  tiers: string[];
  minimum: number;
  timing: string;
  delay: number;
  unit: string;
  days: number;
  time: string;
  schedule: string;
  sendTiming?: "now" | "later";
  email: Template;
  recipients: number;
  updated: string;
  brand?: Brand;
  sender?: Sender;
  published?: Flow;
  history?: Template[];
};
export type StoreData = {
  templates: Template[];
  flows: Flow[];
  brand: Brand;
  sender: Sender;
  tests: { name: string; date: string; address: string }[];
};
export const events = [
  "Customer signup",
  "Points earned",
  "Tier upgrade",
  "Review submitted",
  "Coupon redeemed",
  "Birthday",
  "Points expiring",
  "Inactivity",
];
const descriptions = [
  "Make a great first impression and welcome new members.",
  "Keep customers in the loop about their points balance.",
  "Celebrate the next milestone in their loyalty journey.",
  "A little thank-you for sharing their experience.",
  "Confirm a redemption and keep the good things going.",
  "Make their special day feel a little more special.",
  "Give customers a friendly nudge before points expire.",
  "Reconnect with customers you haven’t seen in a while.",
];
const headings = [
  "A warm welcome to the club.",
  "Good things add up.",
  "You’ve reached a new level.",
  "Your words mean a lot.",
  "A little reward, well deserved.",
  "Here’s to your special day.",
  "Don’t let good things go.",
  "It’s been a little while.",
];
const subjects = [
  "Welcome to {{merchant_name}}, {{customer_first_name}}",
  "Your points balance has been updated",
  "You’re now a {{tier_name}} member",
  "Thanks for your review, {{customer_first_name}}",
  "Your coupon redemption is confirmed",
  "Happy birthday, {{customer_first_name}}",
  "Some of your points expire soon",
  "We’d love to see you again, {{customer_first_name}}",
];
const bodies = [
  "You’re officially part of the {{merchant_name}} community. Discover thoughtfully made favorites, collect points as you shop, and enjoy a little more with every visit.\nYour next good thing starts here.",
  "A little more to look forward to. Points have been added to your account, bringing you closer to your next reward.\nTake a look at your balance and see what’s waiting for you.",
  "A new chapter of good things starts today. You’ve moved up in our loyalty program, and we couldn’t be happier to have you with us.\nExplore the benefits that come with your membership.",
  "Thank you for taking the time to share your thoughts. Your feedback helps our community discover their next favorite and helps us make every experience better.\nWe’re glad you’re here.",
  "Your coupon redemption is confirmed. Thanks for being part of the {{merchant_name}} community.\nYou can find your rewards and account details whenever you need them.",
  "Wishing you a day filled with your favorite people and all the little things that make you smile.\nWith warm wishes from all of us at {{merchant_name}}.",
  "You’ve collected something good. Some of the points in your account are approaching their expiry.\nVisit your rewards account to check the details and explore your options.",
  "We’ve missed having you around. If you’re ready for a little inspiration, come see what’s happening at {{merchant_name}}.\nWe’d love to welcome you back.",
];
const ctas = [
  "Explore your rewards",
  "View your points",
  "View your benefits",
  "Visit our store",
  "View your rewards",
  "Visit our store",
  "View your points",
  "Explore what’s new",
];
export const defaults: Template[] = events.map((name, i) => ({
  id: `default-${i}`,
  name,
  description: descriptions[i],
  subject: subjects[i],
  preheader: descriptions[i],
  heading: headings[i],
  greeting: "Hi {{customer_first_name}},",
  body: bodies[i],
  cta: ctas[i],
  url: "https://northstargoods.example/rewards",
  event: i,
  mode: "text",
  html: "",
  updated: "Sep 12, 2026",
}));
export const variables: Record<string, string> = {
  customer_first_name: "First name",
  customer_last_name: "Last name",
  customer_email: "Email address",
  points_balance: "Points balance",
  tier_name: "VIP tier",
  merchant_name: "Store name",
  unsubscribe_url: "Unsubscribe link",
};
export function personalize(value: string, brand: Brand, scenario = "default") {
  const values: Record<string, string> = {
    customer_first_name:
      scenario === "missing"
        ? "there"
        : scenario === "long"
          ? "Alexandria Charlotte"
          : scenario === "international"
            ? "माया"
            : "Maya",
    customer_last_name: "Sharma",
    customer_email: "maya@example.com",
    points_balance: scenario === "large" ? "1,250,620" : "620",
    tier_name: scenario === "no-tier" ? "Member" : "Gold",
    merchant_name: brand.name,
    unsubscribe_url: "#preview-unsubscribe",
  };
  return value.replace(
    /\{\{\s*(\w+)\s*\}\}/g,
    (all, key) => values[key] ?? all,
  );
}
export function validateEmail(t: Template) {
  const errors: string[] = [];
  if (!t.subject.trim() || /[<>\r\n]/.test(t.subject))
    errors.push("Add a subject without HTML or line breaks.");
  if (t.subject.includes("unsubscribe_url"))
    errors.push(
      "The unsubscribe variable belongs in the footer, not the subject.",
    );
  const content =
    t.subject +
    " " +
    t.preheader +
    " " +
    (t.mode === "html"
      ? t.html
      : t.body + " " + t.heading + " " + t.greeting + " " + t.cta);
  const unknown = [...content.matchAll(/\{\{\s*([^}]+)\s*\}\}/g)].filter(
    (m) => !variables[m[1].trim()],
  );
  if (unknown.length)
    errors.push("This variable isn’t supported. Choose one from the list.");
  if (
    content.replace(/\{\{[^}]+\}\}/g, "").includes("{{") ||
    content.replace(/\{\{[^}]+\}\}/g, "").includes("}}")
  )
    errors.push("A personalization variable has unmatched braces.");
  if (t.mode === "text") {
    if (!t.body.trim() || !t.heading.trim())
      errors.push("Add a heading and email body.");
    if (t.cta && !/^https:\/\/[^\s]+\.[^\s]+$/.test(t.url))
      errors.push("Add a valid HTTPS destination for your button.");
  } else {
    if (!t.html.trim()) errors.push("Add email HTML.");
    if (!/href\s*=\s*["']\{\{unsubscribe_url\}\}["']/i.test(t.html))
      errors.push("Add an unsubscribe link using {{unsubscribe_url}}.");
    if (
      /<\s*(script|iframe|form|object|embed)|\bon\w+\s*=|(?:javascript|vbscript)\s*:|<meta|<base/i.test(
        t.html,
      )
    )
      errors.push("Remove active content, scripts, forms, and unsafe links.");
  }
  return errors;
}
export function newFlow(kind: Flow["kind"]): Flow {
  return {
    id: crypto.randomUUID(),
    name: "",
    kind,
    type: "Loyalty update",
    event: 0,
    status: "Draft",
    audience: "all",
    tiers: [],
    minimum: 0,
    timing: "Immediately",
    delay: 1,
    unit: "Hours",
    days: 7,
    time: "09:00",
    schedule: "",
    email: { ...defaults[0] },
    recipients: 0,
    updated: "Just now",
  };
}
export function audienceCount(f: Flow) {
  if (f.audience === "tiers" && !f.tiers.length)
    return { matched: 0, eligible: 0, excluded: 0 };
  const base = f.audience === "tiers" ? f.tiers.length * 890 : 2650;
  const matched = Math.max(0, base - Math.floor(f.minimum * 0.3));
  const excluded = Math.min(matched, Math.round((matched * 170) / 2650));
  return { matched, eligible: matched - excluded, excluded };
}
export function initialStore(store: string): StoreData {
  const brand = {
    name: store === "northstar" ? "Northstar Goods" : "Willow & Co.",
    color: "#344e41",
    logo: "",
    address: "124 Maple Street, Portland, OR 97205",
  };
  return {
    templates: structuredClone(defaults),
    brand,
    sender: {
      email:
        store === "northstar"
          ? "hello@northstargoods.example"
          : "hello@willow.example",
      reply: "",
      host: "smtp.provider.example",
      port: "587",
      security: "STARTTLS",
      username:
        store === "northstar"
          ? "hello@northstargoods.example"
          : "hello@willow.example",
      ready: store === "northstar",
    },
    tests: [],
    flows:
      store === "northstar"
        ? [
            {
              ...newFlow("campaign"),
              id: "demo-c1",
              name: "A little something for our members",
              status: "Sent",
              recipients: 2480,
              updated: "Sep 10, 2026",
              email: { ...defaults[1] },
              brand,
            },
            {
              ...newFlow("campaign"),
              id: "demo-c2",
              name: "The autumn edit",
              status: "Draft",
              updated: "Sep 14, 2026",
            },
            {
              ...newFlow("automation"),
              id: "demo-a1",
              name: "Welcome to the community",
              status: "Active",
              updated: "Sep 12, 2026",
            },
            {
              ...newFlow("automation"),
              id: "demo-a2",
              name: "Celebrate every milestone",
              event: 2,
              status: "Paused",
              email: { ...defaults[2] },
              updated: "Sep 12, 2026",
            },
          ]
        : [],
  };
}
export function toHtml(t: Template) {
  return `<html><body style="font-family:Arial,sans-serif;background:#f4f3ef;padding:32px"><main style="max-width:560px;margin:auto;background:white;padding:32px"><h2>{{merchant_name}}</h2><h1>${escapeHtml(t.heading)}</h1><p>${escapeHtml(t.greeting)}</p><p>${escapeHtml(t.body).replace(/\n/g, "<br>")}</p><a href="${escapeHtml(t.url)}" style="display:inline-block;background:#344e41;color:white;padding:16px 24px">${escapeHtml(t.cta)}</a><p><a href="{{unsubscribe_url}}">Unsubscribe</a></p></main></body></html>`;
}
export function escapeHtml(s: string) {
  return s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
}
