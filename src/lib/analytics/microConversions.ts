import { trackEvent } from "./events";

export function trackArchiveUnlockClick(fileId: string, location: string) {
  trackEvent({ name: "archive_unlock_click", file_id: fileId, location });
}

export function trackHiddenCodeAttempt(code: string, success: boolean) {
  trackEvent({ name: "hidden_code_attempt", code, success });
}

export function trackSizeGuideOpen(productId: string) {
  trackEvent({ name: "size_guide_open", product_id: productId });
}

export function trackProductImageClick(productId: string, imageIndex: number) {
  trackEvent({
    name: "product_image_click",
    product_id: productId,
    image_index: imageIndex,
  });
}
