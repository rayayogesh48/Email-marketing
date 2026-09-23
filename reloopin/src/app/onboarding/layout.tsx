import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Merchant Onboarding | Reloopin",
  description: "Set up and launch your ecommerce loyalty program in under 10 minutes.",
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="onboarding-root">{children}</div>;
}

