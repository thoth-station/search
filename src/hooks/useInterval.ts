import { useEffect, useRef } from "react";

export const useInterval = (
    callback: undefined | (() => void),
    delay: number | null,
) => {
    const savedCallback = useRef<undefined | (() => void)>();

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        function tick() {
            if (savedCallback.current) {
                savedCallback.current();
            }
        }
        if (delay !== null) {
            const id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
};
