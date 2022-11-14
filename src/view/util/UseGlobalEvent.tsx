import React, {useEffect} from "react"; 

export function useGlobalEvent<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => void) {
    return useEffect(() => {
        document.addEventListener(type, listener);

        return () => void document.removeEventListener(type, listener);
    });
}
