import { useCallback } from "react";

export function useShareableUrl() {
  const encode = useCallback((scenarioId: string): string => {
    if (typeof window === "undefined") return "";
    const url = new URL(window.location.href);
    url.searchParams.set("scenario", scenarioId);
    return url.toString();
  }, []);

  const decode = useCallback((): string | null => {
    if (typeof window === "undefined") return null;
    const params = new URLSearchParams(window.location.search);
    return params.get("scenario");
  }, []);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }, []);

  return { encode, decode, copyToClipboard };
}
