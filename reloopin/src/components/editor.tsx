"use client";
import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { html } from "@codemirror/lang-html";
import {
  Braces,
  ChevronDown,
  Code2,
  LetterText,
  ShieldCheck,
  Maximize2,
} from "lucide-react";
import { Template, Brand, variables, toHtml, validateEmail } from "@/lib/model";
import { Preview } from "./email-preview";
import { Menu } from "./ui/menu";
import { Button } from "./ui/button";
import { Modal } from "./ui/dialog";
const CodeMirror = dynamic(() => import("@uiw/react-codemirror"), {
  ssr: false,
});
export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}
export function EmailEditor({
  value: t,
  onChange,
  brand,
}: {
  value: Template;
  onChange: (t: Template) => void;
  brand: Brand;
}) {
  const [convert, setConvert] = useState(false);
  const [expand, setExpand] = useState(false);
  const [backup, setBackup] = useState(t);
  const target = useRef<{ key: keyof Template; start: number; end: number }>({
    key: "body",
    start: t.body.length,
    end: t.body.length,
  });
  const code = useRef<import("@uiw/react-codemirror").ReactCodeMirrorRef>(null);
  const [lastField, setLastField] = useState("body");
  const set = (key: keyof Template, value: string) =>
    onChange({ ...t, [key]: value });
  const focus = (
    key: keyof Template,
    e: React.SyntheticEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    target.current = {
      key,
      start: e.currentTarget.selectionStart || 0,
      end: e.currentTarget.selectionEnd || 0,
    };
    setLastField(key);
  };
  const insert = (key: string) => {
    const token = `{{${key}}}`;
    if (lastField === "html" && code.current?.view) {
      const view = code.current.view;
      const { from, to } = view.state.selection.main;
      view.dispatch({
        changes: { from, to, insert: token },
        selection: { anchor: from + token.length },
      });
      view.focus();
      return;
    }
    const { key: field, start, end } = target.current;
    const value = String(t[field]);
    set(field, value.slice(0, start) + token + value.slice(end));
    target.current = {
      key: field,
      start: start + token.length,
      end: start + token.length,
    };
  };
  const errors = validateEmail(t);
  return (
    <div className={`editor-grid ${expand ? "editor-expanded" : ""}`}>
      <section className="editing-panel">
        <div className="editor-section-title">
          <h3>Email content</h3>
          <Menu
            label="Insert variable"
            trigger={
              <>
                <Braces size={14} /> Insert variable <ChevronDown size={13} />
              </>
            }
            items={Object.entries(variables).map(([key, label]) => ({
              label: `${label} · {{${key}}}`,
              // Menu invokes action only from its Radix onSelect event, never during render.
              // eslint-disable-next-line react-hooks/refs
              action: () => insert(key),
            }))}
          />
        </div>
        <Field
          label="Subject line"
          hint={`${t.subject.length} characters · Keep it short and clear`}
        >
          <input
            value={t.subject}
            onChange={(e) => set("subject", e.target.value)}
            onSelect={(e) => focus("subject", e)}
          />
        </Field>
        <Field
          label="Preview text"
          hint="Shown beside the subject in some inboxes."
        >
          <input
            value={t.preheader}
            onChange={(e) => set("preheader", e.target.value)}
            onSelect={(e) => focus("preheader", e)}
          />
        </Field>
        <div className="editor-mode-row">
          <div className="segmented">
            <button
              className={t.mode === "text" ? "selected" : ""}
              onClick={() => (t.mode === "html" ? setConvert(true) : null)}
            >
              <LetterText size={16} /> Text editor
            </button>
            <button
              className={t.mode === "html" ? "selected" : ""}
              onClick={() => {
                if (t.mode === "text") {
                  setBackup(t);
                  onChange({ ...t, mode: "html", html: t.html || toHtml(t) });
                  setLastField("html");
                }
              }}
            >
              <Code2 size={16} /> HTML editor
            </button>
          </div>
          <button
            className="icon-button"
            aria-label="Expand editor"
            onClick={() => setExpand(!expand)}
          >
            <Maximize2 size={16} />
          </button>
        </div>
        {t.mode === "text" ? (
          <>
            <p className="muted helper">
              Update the wording without editing code.
            </p>
            <Field label="Heading">
              <input
                value={t.heading}
                onChange={(e) => set("heading", e.target.value)}
                onSelect={(e) => focus("heading", e)}
              />
            </Field>
            <Field label="Greeting">
              <input
                value={t.greeting}
                onChange={(e) => set("greeting", e.target.value)}
                onSelect={(e) => focus("greeting", e)}
              />
            </Field>
            <Field label="Email body">
              <textarea
                rows={7}
                value={t.body}
                onChange={(e) => set("body", e.target.value)}
                onSelect={(e) => focus("body", e)}
              />
            </Field>
            <div className="two-fields">
              <Field label="Button label">
                <input
                  value={t.cta}
                  onChange={(e) => set("cta", e.target.value)}
                />
              </Field>
              <Field label="Destination URL">
                <input
                  value={t.url}
                  onChange={(e) => set("url", e.target.value)}
                />
              </Field>
            </div>
            <div className="subtle-box">
              <ShieldCheck size={17} />
              <div>
                <strong>Footer & unsubscribe link</strong>
                <p>
                  Your store details and unsubscribe link are automatically
                  included.
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            <p className="muted helper">
              Custom HTML can look different across email apps. Preview and send
              a test before sending.
            </p>
            <div className="code-toolbar">
              <span>email.html</span>
              <span>Custom branding · Ctrl/Cmd + F to find</span>
            </div>
            <CodeMirror
              ref={code}
              value={t.html}
              height="460px"
              extensions={[html()]}
              onFocus={() => setLastField("html")}
              onChange={(v) => set("html", v)}
              basicSetup={{
                lineNumbers: true,
                foldGutter: true,
                highlightActiveLine: true,
              }}
            />
            <p className="muted helper">
              HTML is sandboxed. Scripts, forms and active content are blocked.
              Inline CSS is recommended.
            </p>
          </>
        )}
        {errors.length > 0 && (
          <div className="alert error" role="alert">
            {errors.map((e) => (
              <p key={e}>{e}</p>
            ))}
          </div>
        )}
      </section>
      <Preview template={t} brand={brand} />
      <Modal
        open={convert}
        onClose={() => setConvert(false)}
        title="Return to the text editor?"
        description="Custom HTML cannot be converted into fields reliably. Your HTML is preserved; the previous structured version will be restored."
      >
        <div className="dialog-actions">
          <Button variant="outline" onClick={() => setConvert(false)}>
            Keep editing HTML
          </Button>
          <Button
            onClick={() => {
              onChange({ ...backup, html: t.html, mode: "text" });
              setConvert(false);
            }}
          >
            Restore text version
          </Button>
        </div>
      </Modal>
    </div>
  );
}
