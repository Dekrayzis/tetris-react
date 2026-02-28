import { useEffect, useRef } from 'react';

type UseInactivityTimeoutOptions = {
  enabled: boolean;
  delayMs: number;
  elementId: string;
  onInactive: () => void;
  onActivity?: () => void;
  events?: string[];
};

const defaultEvents = [
  'mousemove',
  'mousedown',
  'keypress',
  'DOMMouseScroll',
  'mousewheel',
  'touchmove',
  'MSPointerMove',
];

const useLatestRef = <T,>(value: T) => {
  const ref = useRef(value);
  ref.current = value;
  return ref;
};

export const useInactivityTimeout = ({
  enabled,
  delayMs,
  elementId,
  onInactive,
  onActivity,
  events = defaultEvents,
}: UseInactivityTimeoutOptions) => {
  const timeoutIdRef = useRef<number | null>(null);
  const onInactiveRef = useLatestRef(onInactive);
  const onActivityRef = useLatestRef(onActivity);

  useEffect(() => {
    if (!enabled) {
      if (timeoutIdRef.current != null) {
        window.clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }
      return undefined;
    }

    const el = document.getElementById(elementId);
    if (!el) {
      return undefined;
    }

    const armTimer = () => {
      if (timeoutIdRef.current != null) {
        window.clearTimeout(timeoutIdRef.current);
      }
      timeoutIdRef.current = window.setTimeout(() => {
        onInactiveRef.current();
      }, delayMs);
    };

    const onAnyInput = () => {
      if (onActivityRef.current) {
        onActivityRef.current();
      }
      armTimer();
    };

    events.forEach((eventName) => {
      el.addEventListener(eventName, onAnyInput, false);
    });

    armTimer();

    return () => {
      events.forEach((eventName) => {
        el.removeEventListener(eventName, onAnyInput, false);
      });

      if (timeoutIdRef.current != null) {
        window.clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }
    };
  }, [delayMs, elementId, enabled, events]);
};
