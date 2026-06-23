import { useCallback, useRef } from "react";
import type { SessionData, PlaygroundMessage } from "@/types/playground";

const STORAGE_KEY = "emphra-playground-session";
const SESSION_TTL = 24 * 60 * 60 * 1000; // 24 hours

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
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const save = useCallback((session: SessionData) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      try {
        const storable = serializeSession(session);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(storable));
      } catch {
        // Storage full or unavailable — silent fail
      }
    }, 500);
  }, []);

  const load = useCallback((): SessionData | null => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const stored: StoredSession = JSON.parse(raw);
      if (Date.now() - stored.savedAt > SESSION_TTL) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return deserializeSession(stored);
    } catch {
      return null;
    }
  }, []);

  const clear = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { save, load, clear };
}
