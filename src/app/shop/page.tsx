import type { Metadata } from "next";
import { FloatingDropShowcase } from "@/components/floating-drop-showcase";
import { ShopExperience } from "@/components/shop-experience";
import { SecretCodeConsole } from "@/components/arg/secret-code-console";
import { UnlockAlertSignup } from "@/components/arg/unlock-alert-signup";
import { collections } from "@/lib/brand-data";
import { getCatalogProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Open the Action Replay product access mirror for AR-001 and locked archive files.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = searchParams ? await searchParams : {};
  const category =
    typeof params.category === "string" ? params.category : undefined;
  const products = await getCatalogProducts();

  return (
    <>
      <section className="shop-hero relative overflow-hidden border-b border-white/10 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1600px] min-w-0">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-blue-300">
            AR-001 / Shopify cart mirror
          </p>
          <h1 className="mt-3 break-words text-5xl font-black italic uppercase leading-[0.82] text-white sm:text-8xl lg:text-[9rem] 2xl:text-[11rem]">
            Mirror open
          </h1>
          <p className="mt-4 max-w-[20rem] break-words font-mono text-xs leading-6 text-zinc-300 sm:max-w-2xl sm:text-sm">
            AR-001 &quot;GALAXY&quot; tee is the only purchasable file. AR-002 remains
            locked. AR-003 is visible again because the bad print export kept
            showing up in the folder, but not as checkout.
          </p>
        </div>
      </section>

      <FloatingDropShowcase products={products} />

      <ShopExperience
        collections={collections}
        initialCategory={category}
        products={products}
      />

      <section className="border-t border-white/10 px-4 py-8 sm:px-6">
        <div className="mx-auto grid max-w-[1600px] gap-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(20rem,0.55fr)]">
          <SecretCodeConsole />
          <UnlockAlertSignup />
        </div>
      </section>
    </>
  );
}
