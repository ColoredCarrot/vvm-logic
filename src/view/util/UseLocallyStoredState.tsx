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
 *
 * @param key The key by which this state is identified in {@link localStorage}.
 *            Should be unique in the app.
 *
 * @param delay Debounce delay in milliseconds.
 *
 * @param serializer Functor used to serialize values of type `T`. Defaults to {@link JSON.stringify}.
 *
 * @param deserializer Functor used to deserialize values to type `T`. Defaults to {@link JSON.parse}.
 */
export function useLocallyStoredState<T extends readonly LocallyStorable[] | LocallyStorable>(
    defaultValue: (() => T) | T,
    key: string,
    {delay, serializer, deserializer}: {
        delay?: number,
        serializer?: (_: T) => string,
        deserializer?: (_: string) => T,
    },
): [T, React.Dispatch<React.SetStateAction<T>>] {

    const [value, setValue] = useState(() => {
        const storedJson = localStorage.getItem(key);
        
        if (storedJson === null) {
            return typeof defaultValue === "function" ? defaultValue() : defaultValue;
        }
        
        return deserializer !== undefined ? deserializer(storedJson) : JSON.parse(storedJson);
    });

    const debouncedValue = useDebounced(value, delay ?? 500);

    useEffect(() => {
        localStorage.setItem(key, serializer !== undefined ? serializer(debouncedValue) : JSON.stringify(debouncedValue));
    }, [key, debouncedValue, serializer]);

    return [value, setValue];
}
