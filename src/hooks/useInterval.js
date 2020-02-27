import { useEffect, useRef } from 'react';

export function useInterval(callback, delay) {
    
    // Reference the last callback.
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up interval.
    useEffect(() => {

        function tick() {
            savedCallback.current();
        }

        if (delay !== null) {
            const id = setInterval(tick, delay);
            return () => {
                clearInterval(id);
            };
        }

    }, [delay]);
}