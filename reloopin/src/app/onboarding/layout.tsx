import { Metadata } from "next";
import { Geist } from "next/font/google";
import "./onboarding.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-onboarding" });

export const metadata: Metadata = {
  title: "Merchant Onboarding | Reloopin",
  description:
    "Set up and launch your ecommerce loyalty program in under 10 minutes.",
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={`onboarding-root ${geist.variable}`}>{children}</div>;
}
