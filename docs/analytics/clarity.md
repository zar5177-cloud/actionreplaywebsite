# Microsoft Clarity

Internal Action Replay HQ doc.

Best path:

1. Install Microsoft Clarity through the Shopify App Store.
2. Toggle the Clarity app embed on in Shopify.
3. Add `CLARITY_PROJECT_ID` to the custom storefront env if the Next app should also load the snippet.
4. Verify recordings for:
   - homepage,
   - product page,
   - archive page,
   - replay club page,
   - cart/extraction queue,
   - checkout entry where Shopify allows.

The official Shopify app is preferred for Shopify checkout/post-checkout coverage. The Next snippet is env-gated and non-blocking.
