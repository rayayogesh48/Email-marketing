"use client";
import { useState } from "react";
import {
  ArrowLeft,
  Clock,
  Mail,
  Send,
  ShieldCheck,
  Users,
  Zap,
  Info,
} from "lucide-react";
import {
  Flow,
  StoreData,
  events,
  audienceCount,
  validateEmail,
  Template,
} from "@/lib/model";
import { Button } from "./ui/button";
import { Modal } from "./ui/dialog";
import { FlowForm } from "./flow-form";
import { EventIcons } from "./email-preview";
export function RecipientSummary({
  flow,
  breakdown = false,
}: {
  flow: Flow;
  breakdown?: boolean;
}) {
  const c = audienceCount(flow);
  return (
    <div className="recipient-summary">
      <div className="recipient-top">
        <span className="icon-tile">
          <Users size={20} />
        </span>
        <div>
          <strong>{c.eligible.toLocaleString()}</strong>
          <p>
            {flow.kind === "automation"
              ? "Currently eligible customers"
              : "Eligible recipients"}
          </p>
        </div>
        <span className="badge">Demo estimate</span>
      </div>
      <div className="recipient-line">
        <span>Matched customers</span>
        <strong>{c.matched.toLocaleString()}</strong>
      </div>
      <div className="recipient-line">
        <span>Unsubscribed / suppressed</span>
        <strong>−{c.excluded}</strong>
      </div>
      {breakdown && (
        <div className="breakdown">
          <p>
            Unsubscribed <span>{Math.round(c.excluded * 0.7)}</span>
          </p>
          <p>
            Missing consent{" "}
            <span>{c.excluded - Math.round(c.excluded * 0.7)}</span>
          </p>
          <p>
            Bounce / complaint telemetry <span>Not available</span>
          </p>
        </div>
      )}
      <p className="helper muted">
        {flow.kind === "automation"
          ? "Audience estimate only. Emails send individually when a customer meets the trigger and timing rules."
          : "Consent and suppression checks always apply. Recipients are checked again before sending."}
      </p>
    </div>
  );
}
export function FlowBuilder({
  flow: f,
  setFlow,
  data,
  onSave,
  onClose,
  onTest,
  onSettings,
  onEditTemplate,
}: {
  flow: Flow;
  setFlow: (f: Flow) => void;
  data: StoreData;
  onSave: (f: Flow, close?: boolean) => void;
  onClose: () => void;
  onTest: (t: Template) => void;
  onSettings: () => void;
  onEditTemplate: () => void;
}) {
  const [now] = useState(() => Date.now());
  const [timing, setTiming] = useState(
    f.sendTiming || (f.schedule ? "later" : "now"),
  );
  const [confirm, setConfirm] = useState(false);
  const [picker, setPicker] = useState(false);
  const [replace, setReplace] = useState<Template | null>(null);
  const [pendingTrigger, setPendingTrigger] = useState<number | null>(null);
  const auto = f.kind === "automation";
  const patch = (value: Partial<Flow>) => setFlow({ ...f, ...value });
  const count = audienceCount(f);
  const validations = validateEmail(f.email);
  const audienceValid =
    (f.audience !== "tiers" || f.tiers.length > 0) && f.minimum >= 0;
  const scheduleInvalid =
    !auto &&
    timing === "later" &&
    (!f.schedule || new Date(f.schedule + "+05:45").getTime() <= now);
  const blockers = [
    ...validations,
    ...(!f.name.trim() ? ["Add a name."] : []),
    ...(!data.sender.ready ? ["Set up your sender before sending."] : []),
    ...(!audienceValid
      ? ["Select at least one tier and a valid minimum balance."]
      : []),
    ...(!auto && count.eligible === 0
      ? ["No customers match this audience."]
      : []),
    ...(scheduleInvalid
      ? ["Choose a future date and time in Asia/Kathmandu."]
      : []),
    ...(auto &&
    f.event >= 5 &&
    (!Number.isFinite(f.days) || f.days < (f.event === 5 ? 0 : 1) || !f.time)
      ? ["Choose valid event days and a send time."]
      : []),
    ...(auto && f.event === 3
      ? ["Connect a review event integration before activating."]
      : []),
    ...(auto && f.timing === "After a delay" && f.delay <= 0
      ? ["Delay must be greater than zero."]
      : []),
    ...(auto &&
    f.event === 6 &&
    f.timing === "After a delay" &&
    f.delay * (f.unit === "Days" ? 24 : f.unit === "Hours" ? 1 : 1 / 60) >=
      f.days * 24
      ? ["The delay must end before the points expire."]
      : []),
  ];
  const select = (t: Template) => {
    patch({
      email: { ...t },
      history: [...(f.history || []), f.email],
      ...(pendingTrigger !== null ? { event: pendingTrigger } : {}),
    });
    setPendingTrigger(null);
    setPicker(false);
    setReplace(null);
  };
  return (
    <>
      <div className="workflow-header">
        <div className="flex-row">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Back to overview"
            onClick={onClose}
          >
            <ArrowLeft size={19} />
          </Button>
          <div>
            <div className="eyebrow">
              {auto ? "AUTOMATIONS" : "CAMPAIGNS"} /{" "}
              {f.name || `NEW ${auto ? "AUTOMATION" : "CAMPAIGN"}`}
            </div>
            <h1>
              {f.name || `Create ${f.kind}`}{" "}
              <span className="badge">Draft</span>
            </h1>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => onSave({ ...f, status: "Draft" }, true)}
        >
          Save draft
        </Button>
      </div>
      {f.published && (
        <div className="alert">
          <Info size={17} /> Editing draft changes. The published version is
          still active.
        </div>
      )}
      <FlowForm
        flow={f}
        data={data}
        onChange={patch}
        onTemplate={() => setPicker(true)}
        onTest={onTest}
        onSettings={onSettings}
        timing={timing}
        onTiming={(value) => {
          setTiming(value);
          patch({
            sendTiming: value,
            ...(value === "now" ? { schedule: "" } : {}),
          });
        }}
        onEditTemplate={onEditTemplate}
        onTrigger={(event) => {
          setPendingTrigger(event);
          setReplace(
            data.templates.find((t) => t.event === event && !t.custom) ||
              data.templates[0],
          );
        }}
        blockers={blockers}
      />
      <footer className="workflow-footer">
        <Button variant="outline" onClick={onClose}>
          <ArrowLeft size={15} /> Cancel
        </Button>
        <span>
          <ShieldCheck size={14} /> Frontend demo · no real emails are sent
        </span>
        <Button disabled={blockers.length > 0} onClick={() => setConfirm(true)}>
          {auto ? (
            <Zap size={15} />
          ) : timing === "later" ? (
            <Clock size={15} />
          ) : (
            <Send size={15} />
          )}{" "}
          {auto
            ? f.published
              ? "Publish changes"
              : "Activate automation"
            : timing === "later"
              ? "Schedule campaign"
              : "Send campaign"}
        </Button>
      </footer>
      <Modal
        open={confirm}
        onClose={() => setConfirm(false)}
        title={
          auto
            ? f.published
              ? "Publish automation changes?"
              : "Activate this automation?"
            : timing === "later"
              ? "Schedule this campaign?"
              : "Send this campaign?"
        }
        description={
          auto
            ? "Customers receive this email when they meet the trigger, audience, and timing rules. Activation does not send to everyone."
            : timing === "later"
              ? `Scheduled for ${f.schedule.replace("T", " at ")} (Asia/Kathmandu). This prototype does not dispatch on a timer.`
              : `This simulates sending to ${count.eligible.toLocaleString()} eligible recipients. No real emails will be sent.`
        }
      >
        <div className="review-lines">
          <div>
            <span>{auto ? "Automation" : "Campaign"}</span>
            <strong>{f.name}</strong>
          </div>
          <div>
            <span>From</span>
            <strong>
              {data.brand.name} &lt;{data.sender.email}&gt;
            </strong>
          </div>
          <div>
            <span>Subject</span>
            <strong>{f.email.subject}</strong>
          </div>
          {auto && (
            <>
              <div>
                <span>Trigger</span>
                <strong>{events[f.event]}</strong>
              </div>
              <div>
                <span>Timing</span>
                <strong>
                  {f.timing === "Immediately"
                    ? "When the event or condition occurs"
                    : `${f.delay} ${f.unit.toLowerCase()} after the event or condition`}
                  {f.event >= 5
                    ? ` · ${f.days} ${f.event === 5 ? "days before birthday" : f.event === 6 ? "days before expiry" : "days without an order"} · ${f.time} (Asia/Kathmandu)`
                    : ""}
                </strong>
              </div>
            </>
          )}
        </div>
        <RecipientSummary flow={f} />
        <div className="dialog-actions">
          <Button variant="outline" onClick={() => setConfirm(false)}>
            Go back
          </Button>
          <Button
            onClick={() => {
              onSave(
                {
                  ...f,
                  status: auto
                    ? "Active"
                    : timing === "later"
                      ? "Scheduled"
                      : "Sent",
                  schedule: timing === "later" ? f.schedule : "",
                  recipients: auto ? 0 : count.eligible,
                  brand: { ...data.brand },
                  sender: { ...data.sender },
                  published: undefined,
                },
                true,
              );
              setConfirm(false);
            }}
          >
            {auto
              ? f.published
                ? "Publish changes"
                : "Activate automation"
              : timing === "later"
                ? "Schedule campaign"
                : "Simulate send"}
          </Button>
        </div>
      </Modal>
      <Modal
        open={picker}
        onClose={() => setPicker(false)}
        title="Choose your starting point"
        description="A separate copy will be used for this email."
        wide
      >
        <div className="template-picker">
          {data.templates.map((t) => {
            const Icon = EventIcons[t.event];
            return (
              <button key={t.id} onClick={() => setReplace(t)}>
                <Icon size={22} />
                <strong>{t.name}</strong>
                <span>{t.description}</span>
              </button>
            );
          })}
          <button
            onClick={() =>
              setReplace({
                ...data.templates[0],
                name: "Blank email",
                subject: "",
                heading: "",
                body: "",
                cta: "",
              })
            }
          >
            <Mail size={22} />
            <strong>Start from scratch</strong>
            <span>Create a blank email.</span>
          </button>
        </div>
      </Modal>
      <Modal
        open={!!replace}
        onClose={() => {
          setReplace(null);
          setPendingTrigger(null);
        }}
        title={
          pendingTrigger !== null ? "Change the trigger?" : "Use this template?"
        }
        description="Your current email will be preserved in this draft’s history. The selected template becomes a separate copy."
      >
        <div className="dialog-actions">
          <Button
            variant="outline"
            onClick={() => {
              if (pendingTrigger !== null) patch({ event: pendingTrigger });
              setPendingTrigger(null);
              setReplace(null);
            }}
          >
            Keep current email
          </Button>
          <Button onClick={() => replace && select(replace)}>
            Use matching template
          </Button>
        </div>
      </Modal>
    </>
  );
}
