import { useState, useCallback } from "react";
import { getSessions, addSession as addSessionToStorage, clearAllData } from "../utils/storage";


export function useQuizStorage() {
  const [sessions, setSessions] = useState(() => getSessions());

  const addSession = useCallback((session) => {
    const updated = addSessionToStorage(session);
    setSessions(updated);
    return updated;
  }, []);

  const clearAll = useCallback(() => {
    clearAllData();
    setSessions([]);
  }, []);

  const refresh = useCallback(() => {
    setSessions(getSessions());
  }, []);

  return { sessions, addSession, clearAll, refresh };
}
