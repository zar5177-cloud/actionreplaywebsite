# Shopify shipping remediation

Last checked: 2026-05-21

The storefront code, DNS, Vercel deployment, Storefront API cart creation, and
`REPLAY15` discount are working. The remaining live checkout blocker is Shopify
shipping configuration for the poster outside the United States.

## Evidence

Run:

```bash
npm run verify:shipping
```

Current result:

- US tee: shipping options returned.
- US poster: shipping options returned.
- US tee + poster: shipping option returned and `REPLAY15` applies.
- CA, NL, GB, AU, IE, HK tee: shipping options returned.
- CA, NL, GB, AU, IE, HK poster: no shipping options returned.
- CA, NL, GB, AU, IE, HK tee + poster: no shipping options returned.

The poster is the blocker. A customer outside the US can select the poster and
reach Shopify checkout, but checkout has no delivery option for the poster, so
the order cannot reliably complete.

## Shopify-agent prompt

Paste this into the Shopify agent:

```text
Critical live checkout blocker for Action Replay.

Store: store.shopactionreplay.com
Product: Action Replay 2026 Promo Poster / AR-003 corrupted promo poster
Variant: 24 x 36

The headless storefront is live and working, but international checkout is blocked for the poster. Storefront API cart deliveryGroups returns zero deliveryOptions for the poster and for tee+poster carts in CA, NL, GB, AU, IE, and HK. The Galaxy Tee alone returns shipping options in those countries. US poster shipping works.

Please fix Shopify shipping, not storefront code:
1. Go to Settings -> Shipping and delivery -> Shipping profiles.
2. Find the shipping profile that contains the Action Replay 2026 Promo Poster.
3. In that profile, open the International shipping zone that includes Canada, Netherlands, United Kingdom, Australia, Ireland, and Hong Kong.
4. Add a manual fallback shipping rate that applies to the poster internationally. Use a flat/manual rate, not only carrier-calculated rates. Name it "Standard International".
5. Make sure the rate has no restrictive order-price or weight condition that excludes a single poster or a tee+poster cart.
6. Keep the existing US Standard/Express poster rates.
7. Do not change the Galaxy Tee variant IDs, product handle, discount code, markets, or Vercel env vars.

After saving, tell me the exact profile name, zone name, rate name, price, and countries covered. Then I will rerun:
npm run verify:shipping
npm run go-live:check
```

## Manual Shopify path

Use this direct admin link:

https://admin.shopify.com/store/action-replay-3262/settings/shipping

Then:

1. Open the shipping profile containing the poster.
2. Find the International zone.
3. Add a manual rate named `Standard International`.
4. Cover at least: Canada, Netherlands, United Kingdom, Australia, Ireland, Hong Kong.
5. Avoid conditions unless the condition clearly includes a single poster and a
   tee + poster cart.
6. Save.

## Verification after fix

Run:

```bash
npm run verify:shipping
npm run go-live:check
```

Do not run the Vercel production deploy workflow until both commands pass.
