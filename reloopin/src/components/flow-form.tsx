"use client";
import { CheckCircle2, Clock, Pencil, Send } from "lucide-react";
import { Flow, StoreData, Template, events } from "@/lib/model";
import { Field } from "./editor";
import { Preview } from "./email-preview";
import { Button } from "./ui/button";
import { Menu } from "./ui/menu";

export function FlowForm({
  flow: f,
  data,
  onChange,
  onTemplate,
  onTest,
  onSettings,
  timing,
  onTiming,
  onEditTemplate,
  onTrigger,
  blockers,
}: {
  flow: Flow;
  data: StoreData;
  onChange: (patch: Partial<Flow>) => void;
  onTemplate: () => void;
  onTest: (t: Template) => void;
  onSettings: () => void;
  timing: "now" | "later";
  onTiming: (value: "now" | "later") => void;
  onEditTemplate: () => void;
  onTrigger: (event: number) => void;
  blockers: string[];
}) {
  const auto = f.kind === "automation";
  return (
    <div className="campaign-compose">
      <div className="campaign-compose-main">
        <section className="form-card">
          <h2>{auto ? "Automation details" : "Campaign details"}</h2>
          <p className="muted">
            Give your {f.kind} a name your team will recognize.
          </p>
          <div className="two-fields">
            <Field label={auto ? "Automation name" : "Campaign name"}>
              <input
                autoFocus
                placeholder={
                  auto ? "e.g. Welcome new members" : "e.g. The autumn edit"
                }
                value={f.name}
                onChange={(e) => onChange({ name: e.target.value })}
              />
            </Field>
            {!auto && (
              <Field label="Campaign type">
                <select
                  value={f.type}
                  onChange={(e) => onChange({ type: e.target.value })}
                >
                  {[
                    "Promotion",
                    "Loyalty update",
                    "Newsletter",
                    "Announcement",
                  ].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </Field>
            )}
          </div>
        </section>
        {auto && (
          <section className="form-card">
            <h2>Trigger & timing</h2>
            <p className="muted">Choose the moment that starts this email.</p>
            <Field label="Trigger event">
              <select
                aria-label="Trigger event"
                value={f.event}
                onChange={(e) => onTrigger(Number(e.target.value))}
              >
                {events.map((event, index) => (
                  <option key={event} value={index}>
                    {event}
                  </option>
                ))}
              </select>
            </Field>
            <p className="campaign-consent-note">
              {
                [
                  "When a customer first joins this store’s loyalty program.",
                  "A positive, finalized points-credit event.",
                  "An upward move to a higher VIP tier.",
                  "A qualifying review reported by a supported integration.",
                  "A qualifying coupon redemption reported by your store.",
                  "Once per recorded birthday each year. Feb 29 uses Feb 28 in non-leap years.",
                  "Only customers with eligible points approaching expiry.",
                  "Completed orders reset the inactivity timer. Customers without orders are excluded.",
                ][f.event]
              }
            </p>
            {f.event >= 5 && (
              <div className="two-fields">
                <Field
                  label={
                    f.event === 5
                      ? "Days before birthday"
                      : f.event === 6
                        ? "Days before expiry"
                        : "Days without an order"
                  }
                >
                  <input
                    type="number"
                    min={f.event === 5 ? 0 : 1}
                    value={f.days}
                    onChange={(e) => onChange({ days: Number(e.target.value) })}
                  />
                </Field>
                <Field label="Send time · Asia/Kathmandu">
                  <input
                    type="time"
                    value={f.time}
                    onChange={(e) => onChange({ time: e.target.value })}
                  />
                </Field>
              </div>
            )}
            <Field label="When to send">
              <select
                aria-label="When to send"
                value={f.timing}
                onChange={(e) => onChange({ timing: e.target.value })}
              >
                <option>Immediately</option>
                <option>After a delay</option>
              </select>
            </Field>
            {f.timing === "After a delay" && (
              <div className="two-fields">
                <Field label="Delay">
                  <input
                    type="number"
                    min={1}
                    value={f.delay}
                    onChange={(e) =>
                      onChange({ delay: Number(e.target.value) })
                    }
                  />
                </Field>
                <Field label="Unit">
                  <select
                    aria-label="Unit"
                    value={f.unit}
                    onChange={(e) => onChange({ unit: e.target.value })}
                  >
                    <option>Minutes</option>
                    <option>Hours</option>
                    <option>Days</option>
                  </select>
                </Field>
              </div>
            )}
            <p className="campaign-consent-note">
              {f.timing === "Immediately"
                ? "Send when the qualifying event or condition occurs"
                : `Send ${f.delay} ${f.unit.toLowerCase()} after the qualifying event or condition`}
              . Past events aren’t replayed.
            </p>
            {data.flows.some(
              (item) =>
                item.kind === "automation" &&
                item.event === f.event &&
                item.id !== f.id,
            ) && (
              <p className="campaign-consent-note warning-text">
                Another automation uses this trigger. Review audience overlap
                before activating.
              </p>
            )}
          </section>
        )}
        <section className="form-card">
          <h2>Audience</h2>
          <p className="muted">
            {auto
              ? "Additional conditions for the customer who triggers the event."
              : "Choose who this email is for."}
          </p>
          <Field label="Send to">
            <select
              aria-label="Send to"
              value={f.audience}
              onChange={(e) =>
                onChange({ audience: e.target.value, minimum: 0 })
              }
            >
              <option value="all">All eligible customers</option>
              <option value="tiers">Selected VIP tiers</option>
              <option value="points">Minimum points balance</option>
            </select>
          </Field>
          {f.audience === "tiers" && (
            <div className="tier-options">
              {["Silver", "Gold", "Platinum"].map((t) => (
                <label key={t}>
                  <input
                    type="checkbox"
                    checked={f.tiers.includes(t)}
                    onChange={() =>
                      onChange({
                        tiers: f.tiers.includes(t)
                          ? f.tiers.filter((x) => x !== t)
                          : [...f.tiers, t],
                      })
                    }
                  />
                  {t}
                </label>
              ))}
            </div>
          )}
          {f.audience !== "all" && (
            <Field
              label="Minimum points balance"
              hint={
                f.audience === "tiers"
                  ? "Customers in any selected tier with at least this points balance."
                  : "Customers must have at least this many points."
              }
            >
              <input
                type="number"
                min={0}
                value={f.minimum}
                onChange={(e) => onChange({ minimum: Number(e.target.value) })}
              />
            </Field>
          )}
          <p className="campaign-consent-note">
            Unsubscribed and suppressed customers are always excluded.
          </p>
        </section>
        <section className="form-card campaign-sender">
          <div className="campaign-section-header">
            <h3>From</h3>
            <span
              className={`badge ${data.sender.ready ? "success" : "warning"}`}
            >
              {data.sender.ready ? <CheckCircle2 size={12} /> : null}
              {data.sender.ready ? "Ready · demo" : "Setup required"}
            </span>
          </div>
          <strong>{data.brand.name}</strong>
          <p>{data.sender.email}</p>
          <Button variant="ghost" size="sm" onClick={onSettings}>
            Manage sender settings
          </Button>
        </section>
        {!auto && (
          <section className="form-card campaign-timing">
            <h3>When to send</h3>
            {[
              { value: "now" as const, label: "Send now" },
              { value: "later" as const, label: "Schedule for later" },
            ].map((t) => (
              <label className="campaign-timing-option" key={t.value}>
                <input
                  type="radio"
                  name="campaign-timing"
                  checked={timing === t.value}
                  onChange={() => {
                    onTiming(t.value);
                  }}
                />
                {t.label}
              </label>
            ))}
            {timing === "later" && (
              <Field
                label="Date & time · Asia/Kathmandu (UTC+05:45)"
                hint="Recipient eligibility is checked again before sending."
              >
                <input
                  type="datetime-local"
                  value={f.schedule}
                  onChange={(e) => onChange({ schedule: e.target.value })}
                />
              </Field>
            )}
            <p className="campaign-consent-note">
              You’ll review the details before confirming.
            </p>
          </section>
        )}
        {blockers.length > 0 && (
          <div className="campaign-readiness">
            <h3>{auto ? "Before you activate" : "Before you send"}</h3>
            <ul>
              {blockers.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <aside
        className="campaign-live-preview"
        aria-label={auto ? "Automation live preview" : "Campaign live preview"}
      >
        <div className="campaign-preview-actions">
          <Button variant="outline" size="sm" onClick={onTemplate}>
            Change template
          </Button>
          <Button variant="outline" size="sm" onClick={onEditTemplate}>
            <Pencil size={14} /> Edit template
          </Button>
          <Button variant="outline" size="sm" onClick={() => onTest(f.email)}>
            <Send size={14} /> Send test email
          </Button>
        </div>
        <Preview template={f.email} brand={data.brand} />
        <div className="campaign-preview-source">
          <span>
            {f.email.name} · {auto ? "Automation" : "Campaign"} copy
          </span>
          {!!f.history?.length && (
            <Menu
              label="Draft history"
              trigger={
                <>
                  Draft history <Clock size={14} />
                </>
              }
              items={f.history.map((email, index) => ({
                label: `Version ${index + 1} · ${email.heading || email.name}`,
                action: () =>
                  onChange({
                    email: { ...email },
                    history: [...(f.history || []), f.email],
                  }),
              }))}
            />
          )}
        </div>
      </aside>
    </div>
  );
}
