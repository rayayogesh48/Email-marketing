"use client";
import { useState } from "react";
import { CheckCircle2, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
export default function Preferences() {
  const [state, setState] = useState("active");
  return (
    <main
      className="preferences-page"
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        background: "var(--background)",
      }}
    >
      <section
        className="form-card"
        style={{ maxWidth: 460, padding: 36, textAlign: "center" }}
      >
        <div className="email-wordmark">
          <span className="north-star">✳</span> NORTHSTAR GOODS
        </div>
        <span className="icon-tile" style={{ margin: "20px auto" }}>
          {state === "done" ? <CheckCircle2 /> : <Mail />}
        </span>
        <h1 style={{ fontSize: 24 }}>
          {state === "done"
            ? "You’re unsubscribed."
            : "A little less in your inbox?"}
        </h1>
        <p style={{ margin: "16px 0 24px" }}>
          {state === "done"
            ? "Your demo preference has been updated. You won’t receive marketing emails from Northstar Goods."
            : "You’re in control. Unsubscribe from marketing emails from Northstar Goods below."}
        </p>
        {state === "active" ? (
          <Button onClick={() => setState("done")}>
            Unsubscribe from marketing
          </Button>
        ) : (
          <p className="success-text">
            <ShieldCheck
              size={16}
              style={{ display: "inline", marginRight: 6 }}
            />{" "}
            Preference saved for this demo
          </p>
        )}
        <p className="helper muted" style={{ marginTop: 30 }}>
          Preview only · No real customer preference is changed.
        </p>
      </section>
    </main>
  );
}
