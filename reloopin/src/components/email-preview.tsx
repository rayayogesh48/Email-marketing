"use client";
import Image from "next/image";
import { useState } from "react";
import {
  Monitor,
  Smartphone,
  Code2,
  ImageOff,
  ArrowUpRight,
  Sparkles,
  Gift,
  Star,
  Leaf,
  Crown,
  PartyPopper,
  Clock,
  Heart,
} from "lucide-react";
import DOMPurify from "dompurify";
import { Brand, Template, personalize, escapeHtml } from "@/lib/model";
export const EventIcons = [
  Sparkles,
  Gift,
  Crown,
  Star,
  Gift,
  PartyPopper,
  Clock,
  Heart,
];
export function EmailCanvas({
  template: t,
  brand,
  mini = false,
  scenario = "default",
  images = true,
}: {
  template: Template;
  brand: Brand;
  mini?: boolean;
  scenario?: string;
  images?: boolean;
}) {
  const Icon = EventIcons[t.event] || Leaf;
  const p = (v: string) => personalize(v, brand, scenario);
  if (t.mode === "html" && !mini) {
    const sanitized =
      typeof window === "undefined"
        ? ""
        : DOMPurify.sanitize(t.html, {
            FORBID_TAGS: [
              "script",
              "form",
              "iframe",
              "object",
              "embed",
              "meta",
              "base",
            ],
            FORBID_ATTR: ["srcset", "action"],
          });
    return (
      <iframe
        title="Sandboxed custom email preview"
        sandbox=""
        referrerPolicy="no-referrer"
        className="html-preview"
        srcDoc={`<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data: https:; style-src 'unsafe-inline'"><style>a{pointer-events:none}body{overflow-wrap:anywhere}</style>${sanitized.replace(/\{\{\s*(\w+)\s*\}\}/g, (token) => escapeHtml(p(token)))}`}
      />
    );
  }
  return (
    <article
      className={`email-paper ${mini ? "email-mini" : ""}`}
      style={{ "--brand-color": brand.color } as React.CSSProperties}
    >
      <div className="email-wordmark">
        {brand.logo && images ? (
          <Image
            unoptimized
            width={140}
            height={45}
            alt={`${brand.name} logo`}
            src={brand.logo}
          />
        ) : (
          <>
            <span className="north-star">✳</span> {brand.name.toUpperCase()}
          </>
        )}
      </div>
      <div className={`email-art art-${t.event}`}>
        <div className="art-ring ring-one" />
        <div className="art-ring ring-two" />
        <div className="art-spark spark-one">✧</div>
        <div className="art-spark spark-two">✧</div>
        <div className="art-symbol">
          <Icon strokeWidth={1.1} />
        </div>
        <span className="art-label">
          {
            [
              "THE START OF SOMETHING GOOD",
              "A LITTLE MORE TO LOOK FORWARD TO",
              "YOUR NEXT CHAPTER",
              "GOOD WORDS. GREAT COMMUNITY.",
              "GOOD THINGS, REWARDED",
              "A DAY ALL ABOUT YOU",
              "MAKE EVERY POINT COUNT",
              "ALWAYS A PLACE FOR YOU",
            ][t.event]
          }
        </span>
      </div>
      <div className="email-content">
        <h2>{p(t.heading)}</h2>
        <p className="email-greeting">{p(t.greeting)}</p>
        <p className="email-body">{p(t.body)}</p>
        {[1, 2].includes(t.event) && (
          <div className="email-balance">
            <span>
              {t.event === 1 ? "YOUR POINTS BALANCE" : "YOUR MEMBERSHIP"}
            </span>
            <strong>
              {t.event === 1 ? p("{{points_balance}}") : p("{{tier_name}}")}
              {t.event === 1 && <small> points</small>}
            </strong>
          </div>
        )}
        {t.cta && (
          <span className="email-cta">
            {p(t.cta)} <ArrowUpRight size={13} />
          </span>
        )}
        <p className="email-signoff">
          A little more rewarding, every day.
          <br />
          The {brand.name} team
        </p>
      </div>
      <footer className="email-footer">
        {brand.name} · {brand.address}
        <br />
        <span>You’re receiving this as part of our loyalty community.</span>
        <br />
        <button type="button" onClick={(e) => e.preventDefault()}>
          Unsubscribe
        </button>{" "}
        · <span>Manage preferences</span>
      </footer>
    </article>
  );
}
export function Preview({
  template,
  brand,
}: {
  template: Template;
  brand: Brand;
}) {
  const [mode, setMode] = useState("desktop");
  const [scenario, setScenario] = useState("default");
  const [images, setImages] = useState(true);
  return (
    <section className="preview-panel">
      <header className="preview-toolbar">
        <strong>
          Live preview <span className="live-dot" />
        </strong>
        <div className="segmented compact">
          {[
            { id: "desktop", Icon: Monitor },
            { id: "mobile", Icon: Smartphone },
            { id: "plain", Icon: Code2 },
          ].map(({ id, Icon }) => (
            <button
              key={id}
              aria-label={`${id} preview`}
              className={mode === id ? "selected" : ""}
              onClick={() => setMode(id)}
            >
              <Icon size={16} />
            </button>
          ))}
        </div>
      </header>
      <div className="inbox-header">
        <div>
          <span>From</span>
          {brand.name} <small>· sample sender</small>
        </div>
        <div>
          <span>To</span>Maya Sharma <small>· sample customer</small>
        </div>
        <div>
          <span>Subject</span>
          {personalize(template.subject, brand)}
        </div>
        <p>{personalize(template.preheader, brand)}</p>
      </div>
      <div className="preview-stage">
        <div className={mode === "mobile" ? "mobile-canvas" : "desktop-canvas"}>
          {mode === "plain" ? (
            <pre className="plain-preview">
              {personalize(
                `${template.heading}\n\n${template.greeting}\n\n${template.mode === "html" ? template.html.replace(/<[^>]*>/g, "") : template.body}\n\n${template.cta}: ${template.url}\n\n${brand.name}\n${brand.address}\nUnsubscribe: {{unsubscribe_url}}`,
                brand,
                scenario,
              )}
            </pre>
          ) : (
            <EmailCanvas
              template={template}
              brand={brand}
              scenario={scenario}
              images={images}
            />
          )}
        </div>
      </div>
      <div className="preview-options">
        <select
          aria-label="Sample customer"
          value={scenario}
          onChange={(e) => setScenario(e.target.value)}
        >
          <option value="default">Maya Sharma · sample customer</option>
          <option value="missing">Missing first name</option>
          <option value="long">Long customer name</option>
          <option value="large">Large points balance</option>
          <option value="no-tier">No VIP tier</option>
          <option value="international">Non-Latin name</option>
        </select>
        <button
          className="icon-button"
          aria-label="Toggle images"
          onClick={() => setImages(!images)}
        >
          <ImageOff size={16} />
        </button>
      </div>
      <p className="preview-caption">
        Sample data. Links are inactive in preview.
      </p>
    </section>
  );
}
