import { useCallback, useRef } from "react";
import type { SessionData, PlaygroundMessage } from "@/types/playground";

// Use sessionStorage instead of localStorage - automatically cleared on tab close or page refresh
const STORAGE_KEY = "emphra-playground-session";

// Force clear sessionStorage on module load to ensure no cache persists across refreshes
try {
  sessionStorage.removeItem(STORAGE_KEY);
} catch {}

interface StoredSession {
  data: SessionData;
  savedAt: number;
}

function serializeSession(session: SessionData): StoredSession {
  return {
    data: {
      ...session,
      messages: session.messages.map((m) => ({
        ...m,
        timestamp: m.timestamp.toISOString(),
      })) as unknown as PlaygroundMessage[],
    },
    savedAt: Date.now(),
  };
}

function deserializeSession(stored: StoredSession): SessionData {
  return {
    ...stored.data,
    messages: stored.data.messages.map((m: any) => ({
      ...m,
      timestamp: new Date(m.timestamp),
    })) as PlaygroundMessage[],
  };
}

export function useSessionPersistence() {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const save = useCallback((session: SessionData) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      try {
        const storable = serializeSession(session);
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(storable));
      } catch {
        // Storage full or unavailable — silent fail
      }
    }, 500);
  }, []);

  const load = useCallback((): SessionData | null => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const stored: StoredSession = JSON.parse(raw);
      return deserializeSession(stored);
    } catch {
      return null;
    }
  }, []);

  const clear = useCallback(() => {
    // Cancel any pending save to avoid re-saving after clearing
    if (debounceRef.current) clearTimeout(debounceRef.current);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Storage unavailable — silent fail
    }
  }, []);

  return { save, load, clear };
}
