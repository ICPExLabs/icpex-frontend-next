import { useEffect, useRef } from 'react';

export function useExecuteOnce(callback: () => void) {
    const hasExecuted = useRef(false);
    const callbackRef = useRef(callback);

    useEffect(() => {
        callbackRef.current = callback;
    });

    useEffect(() => {
        if (!hasExecuted.current) {
            hasExecuted.current = true;
            callbackRef.current();
        }
    }, []);
}
