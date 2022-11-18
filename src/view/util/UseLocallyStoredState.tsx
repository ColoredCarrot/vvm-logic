import React, {useEffect, useState} from "react";
import {useDebounced} from "./UseDebounced";

type LocallyStorable = string | number | object;

/**
 * Same as {@link useState} except that the state is stored in {@link localStorage}.
 *
 * Storing is debounced by {@link delay}, which defaults to 500ms.
 *
 * @param defaultValue The default value if no locally-stored state is found.
 *                     Can be a function that returns the default value instead.
 * @param key The key by which this state is identified in {@link localStorage}.
 *            Should be unique in the app.
 * @param delay Debounce delay in milliseconds.
 */
export function useLocallyStoredState<T extends readonly LocallyStorable[] | LocallyStorable>(
    defaultValue: (() => T) | T,
    key: string,
    delay?: number,
): [T, React.Dispatch<React.SetStateAction<T>>] {

    const [value, setValue] = useState(() => {
        const storedJson = localStorage.getItem(key);

        return storedJson !== null
            ? JSON.parse(storedJson)
            : (typeof defaultValue === "function" ? defaultValue() : defaultValue);
    });

    const debouncedValue = useDebounced(value, delay ?? 500);

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(debouncedValue));
    }, [key, debouncedValue]);

    return [value, setValue];
}
