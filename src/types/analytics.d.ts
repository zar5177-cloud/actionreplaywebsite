export {};

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (command: "config" | "event" | "js", target: string | Date, params?: Record<string, unknown>) => void;
    clarity?: (...args: unknown[]) => void;
    posthog?: {
      capture: (eventName: string, properties?: Record<string, unknown>) => void;
      identify?: (id: string, properties?: Record<string, unknown>) => void;
    };
  }
}
