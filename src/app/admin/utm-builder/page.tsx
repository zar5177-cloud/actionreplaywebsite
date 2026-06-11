import type { Metadata } from "next";
import { UtmBuilder } from "@/components/admin/utm-builder";

export const metadata: Metadata = {
  title: "UTM Builder",
  description: "Internal Action Replay campaign link builder.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function UtmBuilderPage() {
  return <UtmBuilder />;
}
