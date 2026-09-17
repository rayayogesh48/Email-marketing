"use client";
import Image from "next/image";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ImagePlus,
  Info,
  Loader2,
  Palette,
  ShieldCheck,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Brand, Sender, StoreData, defaults } from "@/lib/model";
import { Field } from "./editor";
import { Preview } from "./email-preview";
import { Button } from "./ui/button";
import { Modal } from "./ui/dialog";
export function Branding({
  data,
  onSave,
  onClose,
  onDirty,
}: {
  data: StoreData;
  onSave: (b: Brand) => void;
  onClose: () => void;
  onDirty: () => void;
}) {
  const [brand, setBrand] = useState({ ...data.brand });
  const [sample, setSample] = useState(0);
  const [confirm, setConfirm] = useState(false);
  const change = (v: Partial<Brand>) => {
    setBrand({ ...brand, ...v });
    onDirty();
  };
  const rgb = /^#[0-9a-f]{6}$/i.test(brand.color)
    ? brand.color
        .slice(1)
        .match(/../g)!
        .map((x) => parseInt(x, 16) / 255)
        .map((x) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4))
    : [];
  const contrast = rgb.length
    ? 1.05 / (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2] + 0.05)
    : 0;
  const valid =
    !!brand.name.trim() && !!brand.address.trim() && contrast >= 4.5;
  return (
    <>
      <div className="page-heading">
        <div className="flex-row">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Back to templates"
          >
            <ArrowLeft size={19} />
          </Button>
          <div>
            <h1>Customize email branding</h1>
            <p>Make every email feel unmistakably yours.</p>
          </div>
        </div>
        <Button disabled={!valid} onClick={() => setConfirm(true)}>
          Save branding
        </Button>
      </div>
      <div className="editor-grid">
        <section className="editing-panel">
          <h3>Store identity</h3>
          <p className="muted helper">
            One shared look, across all your branding-linked emails.
          </p>
          <Field label="Sender & store name">
            <input
              value={brand.name}
              onChange={(e) => change({ name: e.target.value })}
            />
          </Field>
          <Field label="Store logo">
            <div className="upload-zone">
              {brand.logo ? (
                <>
                  <Image
                    unoptimized
                    width={150}
                    height={90}
                    src={brand.logo}
                    alt="Uploaded store logo"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => change({ logo: "" })}
                  >
                    <X size={13} /> Remove logo
                  </Button>
                </>
              ) : (
                <>
                  <span className="icon-tile">
                    <ImagePlus size={24} />
                  </span>
                  <strong>Upload your store logo</strong>
                  <span>PNG or JPG, up to 2 MB</span>
                </>
              )}
              <input
                aria-label="Upload logo"
                type="file"
                accept="image/png,image/jpeg"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (
                    !["image/png", "image/jpeg"].includes(file.type) ||
                    file.size > 2 * 1024 * 1024
                  ) {
                    toast.error("Choose a PNG or JPG smaller than 2 MB.");
                    return;
                  }
                  const reader = new FileReader();
                  reader.onload = () => change({ logo: String(reader.result) });
                  reader.onerror = () =>
                    toast.error("Upload failed. Please try again.");
                  reader.readAsDataURL(file);
                }}
              />
            </div>
          </Field>
          <Field
            label="Brand color"
            hint="Used for buttons and accents in your email."
          >
            <div className="color-field">
              <input
                type="color"
                aria-label="Pick brand color"
                value={
                  /^#[0-9a-f]{6}$/i.test(brand.color) ? brand.color : "#344e41"
                }
                onChange={(e) => change({ color: e.target.value })}
              />
              <input
                value={brand.color}
                onChange={(e) => change({ color: e.target.value })}
              />
            </div>
          </Field>
          {contrast < 4.5 ? (
            <div className="alert error">
              Choose a color with enough contrast for white button text.
              <button onClick={() => change({ color: "#344e41" })}>
                Use suggested forest green
              </button>
            </div>
          ) : (
            <p className="success-text helper">
              <ShieldCheck size={14} /> Button text contrast passes ·{" "}
              {contrast.toFixed(1)}:1
            </p>
          )}
          <Field
            label="Business address"
            hint="Included in the protected email footer."
          >
            <textarea
              rows={3}
              value={brand.address}
              onChange={(e) => change({ address: e.target.value })}
            />
          </Field>
          <Field label="Preview template">
            <select
              value={sample}
              onChange={(e) => setSample(Number(e.target.value))}
            >
              {defaults.map((t, i) => (
                <option value={i} key={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </Field>
          <div className="alert">
            <Info size={17} />
            <span>
              Scheduled campaigns keep their approved branding. Custom HTML may
              use its own colors and logo.
            </span>
          </div>
        </section>
        <Preview
          template={data.templates[sample] || defaults[sample]}
          brand={brand}
        />
      </div>
      <Modal
        open={confirm}
        onClose={() => setConfirm(false)}
        title="Update shared email branding?"
        description={`This updates ${data.templates.filter((t) => t.mode === "text").length} branding-linked templates and future emails. Scheduled campaigns and already queued messages keep their approved snapshots. Custom HTML is unchanged.`}
      >
        <div className="dialog-actions">
          <Button variant="outline" onClick={() => setConfirm(false)}>
            Keep editing
          </Button>
          <Button
            onClick={() => {
              onSave(brand);
              setConfirm(false);
            }}
          >
            Update branding
          </Button>
        </div>
      </Modal>
    </>
  );
}
export function Settings({
  data,
  onSave,
  onBranding,
  onTest,
  onReturn,
  onDisconnect,
  onDirty,
}: {
  data: StoreData;
  onSave: (s: Sender, name: string, address: string) => void;
  onBranding: () => void;
  onTest: () => void;
  onReturn?: () => void;
  onDisconnect: () => void;
  onDirty: () => void;
}) {
  const savedSender = {
    ...data.sender,
    username:
      data.sender.username === "demo-merchant"
        ? data.sender.email
        : data.sender.username,
  };
  const [sender, setSender] = useState(savedSender);
  const [name, setName] = useState(data.brand.name);
  const [address, setAddress] = useState(data.brand.address);
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [state, setState] = useState("idle");
  const [error, setError] = useState("");
  const change = (v: Partial<Sender>) => {
    setSender({ ...sender, ...v });
    setState("idle");
    onDirty();
  };
  const emailValid = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  async function test() {
    if (
      !name.trim() ||
      !address.trim() ||
      !emailValid(sender.email) ||
      (sender.reply && !emailValid(sender.reply)) ||
      !sender.host.trim() ||
      !emailValid(sender.username) ||
      !Number.isInteger(Number(sender.port)) ||
      Number(sender.port) < 1 ||
      Number(sender.port) > 65535
    ) {
      setError(
        "Complete sender details, a valid SMTP email, email host, and port (1–65535).",
      );
      return;
    }
    setError("");
    setState("testing");
    await new Promise((r) => setTimeout(r, 900));
    if (sender.host.includes("fail")) {
      setState("failed");
      setError(
        "The simulated provider couldn’t connect. Your existing connection is unchanged. Try a different host.",
      );
    } else setState("verified");
  }
  const hasChanges =
    name !== data.brand.name ||
    address !== data.brand.address ||
    password !== "" ||
    ["email", "reply", "host", "port", "username"].some(
      (key) => sender[key as keyof Sender] !== savedSender[key as keyof Sender],
    );
  const ready = data.sender.ready && !hasChanges;
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Email settings</h1>
          <p>Manage your sender and how your emails look.</p>
        </div>
        {onReturn && (
          <Button variant="outline" onClick={onReturn}>
            <ArrowLeft size={15} /> Return to draft
          </Button>
        )}
      </div>
      <div className="settings-grid email-settings">
        <fieldset className="settings-main" disabled={state === "testing"}>
          <section className="form-card" aria-labelledby="smtp-heading">
            <div className="settings-section-heading">
              <h2 id="smtp-heading">Email configuration</h2>
              <p>Connect your email provider using its SMTP details.</p>
            </div>
            <div className="two-fields">
              <Field label="Email">
                <input
                  type="email"
                  autoComplete="off"
                  value={sender.username}
                  onChange={(e) => change({ username: e.target.value })}
                />
              </Field>
              <Field label="Password">
                <div className="password-field">
                  <input
                    type={show ? "text" : "password"}
                    value={password}
                    autoComplete="new-password"
                    placeholder="Enter an example password"
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setState("idle");
                      onDirty();
                    }}
                  />
                  <button
                    type="button"
                    aria-label={show ? "Hide password" : "Show password"}
                    onClick={() => setShow(!show)}
                  >
                    {show ? "Hide" : "Show"}
                  </button>
                </div>
              </Field>
            </div>
            <div className="two-fields settings-host-fields">
              <Field label="Email host">
                <input
                  value={sender.host}
                  placeholder="smtp.example.com"
                  onChange={(e) => change({ host: e.target.value })}
                />
              </Field>
              <Field label="Port">
                <input
                  type="number"
                  min="1"
                  max="65535"
                  value={sender.port}
                  onChange={(e) =>
                    change({
                      port: e.target.value,
                      security:
                        e.target.value === "465" ? "SSL/TLS" : "STARTTLS",
                    })
                  }
                />
              </Field>
            </div>
            <p className="settings-demo-note">
              Demo only. Use example credentials; passwords are never saved or
              sent.
            </p>
          </section>
          <section className="form-card" aria-labelledby="sender-heading">
            <div className="settings-section-heading">
              <h2 id="sender-heading">Sender details</h2>
              <p>What customers see when they receive your emails.</p>
            </div>
            <Field label="Name">
              <input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setState("idle");
                  onDirty();
                }}
              />
            </Field>
            <div className="two-fields">
              <Field label="Email">
                <input
                  type="email"
                  value={sender.email}
                  onChange={(e) => change({ email: e.target.value })}
                />
              </Field>
              <Field
                label="Reply-to email"
                hint="Optional. Defaults to your sender email."
              >
                <input
                  type="email"
                  placeholder="Same as sender email"
                  value={sender.reply}
                  onChange={(e) => change({ reply: e.target.value })}
                />
              </Field>
            </div>
            <Field label="Business address">
              <input
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  setState("idle");
                  onDirty();
                }}
              />
            </Field>
          </section>
          <div className="settings-save-row">
            <div className="settings-feedback" aria-live="polite">
              {error && (
                <div role="alert" className="alert error">
                  {error}
                </div>
              )}
              {state === "verified" && (
                <p className="success-text helper">
                  <CheckCircle2 size={16} /> Demo check passed. Save your
                  settings to continue.
                </p>
              )}
            </div>
            <div className="settings-save-actions">
              <Button
                variant="outline"
                disabled={state === "testing"}
                onClick={test}
              >
                {state === "testing" && <Loader2 className="spin" size={15} />}
                {state === "testing"
                  ? "Testing configuration…"
                  : "Test email configuration"}
              </Button>
              <Button
                disabled={state !== "verified"}
                onClick={() => {
                  onSave({ ...sender, ready: true }, name, address);
                  setPassword("");
                  setState("idle");
                }}
              >
                Save changes
              </Button>
            </div>
          </div>
          {data.sender.ready && (
            <div className="settings-disconnect">
              <Button
                variant="ghost"
                className="danger-text"
                onClick={onDisconnect}
              >
                Disconnect sender
              </Button>
            </div>
          )}
        </fieldset>
        <aside>
          <section className="form-card settings-readiness">
            <div className="settings-card-title">
              <h3>Sending readiness</h3>
              <span className={`badge ${ready ? "success" : "warning"}`}>
                {ready
                  ? "Ready · demo"
                  : hasChanges
                    ? "Unsaved changes"
                    : "Not connected"}
              </span>
            </div>
            <p className="helper muted">
              {ready
                ? "Your sender is ready. Send a test email to verify your SMTP settings."
                : hasChanges
                  ? "Test and save your changes before sending a test email."
                  : "Add your email configuration, then test and save it to get started."}
            </p>
            <Button variant="outline" disabled={!ready} onClick={onTest}>
              Send test email <ArrowRight size={14} />
            </Button>
            <p className="settings-demo-note">
              Test delivery is simulated in this prototype.
            </p>
          </section>
          <section className="form-card">
            <span className="icon-tile">
              <Palette size={20} />
            </span>
            <h3 className="spaced">Make it your own</h3>
            <p className="muted helper">
              Add your logo and brand colors to every email.
            </p>
            <Button variant="outline" onClick={onBranding}>
              Customize email branding
            </Button>
          </section>
        </aside>
      </div>
    </>
  );
}
