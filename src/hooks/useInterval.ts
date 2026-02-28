import { useEffect, useRef } from 'react';

type IntervalCallback = () => void;

export function useInterval(callback: IntervalCallback, delay: number | null) {
    // Reference the last callback.
    const savedCallback = useRef<IntervalCallback>(() => {});

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up interval.
    useEffect(() => {
        if (delay === null) return;

        const tick = () => {
            savedCallback.current();
        };

        const id = window.setInterval(tick, delay);
        return () => {
            window.clearInterval(id);
        };
    }, [delay]);
}