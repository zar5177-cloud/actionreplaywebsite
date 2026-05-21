import type { Metadata } from "next";
import { ShareableUnlockCard } from "@/components/arg/shareable-unlock-card";
import { cheatCodes, normalizeCode } from "@/data/config/cheat-codes";
import { residueSecretRouteBySlug, residueSecretRoutes } from "@/data/residue";

type SecretCodePageProps = {
  params: Promise<{ code: string }>;
};

export function generateStaticParams() {
  return [
    ...cheatCodes.map((code) => ({
      code: code.code.toLowerCase(),
    })),
    ...residueSecretRoutes.map((route) => ({
      code: route.slug,
    })),
  ];
}

export async function generateMetadata({
  params,
}: SecretCodePageProps): Promise<Metadata> {
  const { code } = await params;
  const normalizedCode = normalizeCode(code);
  const match = cheatCodes.find((cheatCode) => cheatCode.code === normalizedCode);
  const residueRoute = residueSecretRouteBySlug[code.trim().toLowerCase()];

  return {
    title: match
      ? `${match.label} Unlock`
      : residueRoute
        ? residueRoute.title
        : "Unindexed Unlock",
    description:
      match || residueRoute
        ? "A damaged Action Replay unlock mirror."
        : "An unindexed Action Replay mirror.",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function SecretCodePage({ params }: SecretCodePageProps) {
  const { code } = await params;

  return (
    <section className="px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <ShareableUnlockCard code={code} />
      </div>
    </section>
  );
}
