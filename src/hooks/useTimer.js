import { useState, useEffect, useRef, useCallback, useMemo } from "react";

/**
 * Countdown timer hook
 * @param {number} seconds - initial countdown seconds
 * @param {Function} onExpire - callback when timer reaches 0
 */
export function useTimer(seconds, onExpire) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const onExpireRef = useRef(onExpire);

  // Keep the callback ref current
  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  const clear = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const start = useCallback(() => {
    clear();
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clear();
          setIsRunning(false);
          onExpireRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const stop = useCallback(() => {
    clear();
    setIsRunning(false);
  }, []);

  const reset = useCallback((newSeconds) => {
    clear();
    const s = newSeconds ?? seconds;
    setTimeLeft(s);
    setIsRunning(false);
  }, [seconds]);

  const restart = useCallback((newSeconds) => {
    const s = newSeconds ?? seconds;
    setTimeLeft(s);
    clear();
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clear();
          setIsRunning(false);
          onExpireRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [seconds]);

  useEffect(() => () => clear(), []);

  // ✅ Use useMemo instead of reading ref in render
  const progress = useMemo(() => {
    return (timeLeft / seconds) * 100;
  }, [timeLeft, seconds]);

  return { timeLeft, isRunning, progress, start, stop, reset, restart };
}
