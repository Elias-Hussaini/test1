"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError, errorMessage } from "@/lib/api";

type ApiState<T> = { data: T | null; error: string | null; errorStatus: number | null; loading: boolean };

/**
 * خواندن داده از API با لغو درخواست قبلی، حالت خطا و بارگذاری دوباره.
 * با تغییر `deps` درخواست جدید زده می‌شود و درخواست قبلی نادیده گرفته می‌شود.
 */
export function useApi<T>(fetcher: (signal: AbortSignal) => Promise<T>, deps: readonly unknown[]) {
  const [state, setState] = useState<ApiState<T>>({ data: null, error: null, errorStatus: null, loading: true });
  const [tick, setTick] = useState(0);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  useEffect(() => {
    const controller = new AbortController();
    setState((previous) => ({ ...previous, loading: true, error: null, errorStatus: null }));

    fetcherRef
      .current(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setState({ data, error: null, errorStatus: null, loading: false });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        if (error instanceof DOMException && error.name === "AbortError") return;
        setState((previous) => ({
          ...previous,
          loading: false,
          error: errorMessage(error),
          errorStatus: error instanceof ApiError ? error.statusCode : null,
        }));
      });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);

  const reload = useCallback(() => setTick((value) => value + 1), []);
  const setData = useCallback(
    (updater: (current: T) => T) =>
      setState((previous) => (previous.data === null ? previous : { ...previous, data: updater(previous.data) })),
    [],
  );

  return { ...state, reload, setData };
}

/** مقدار را با تأخیر برمی‌گرداند؛ برای جستجوی هنگام تایپ. */
export function useDebouncedValue<T>(value: T, delay = 350): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}
