import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GrowthCommandCenter } from "@/components/operator/growth-command-center";

export const metadata: Metadata = {
  title: "Operator Console",
  description:
    "Internal Action Replay growth archive operating system and daily runbook.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function OperatorPage() {
  if (process.env.ENABLE_OPERATOR_CONSOLE !== "true") {
    notFound();
  }

  return <GrowthCommandCenter />;
}
