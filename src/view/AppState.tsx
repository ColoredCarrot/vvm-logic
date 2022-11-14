import React from "react";
import {ExecutionError} from "../exec/ExecutionError";

/**
 * Global application state, _excluding_ the state of the Virtual Machine.
 */
export interface AppState {
    /**
     * string if an internal exception occurred
     */
    readonly lastExecutionError: ExecutionError | string | null;
}

type AppStateAndSetter = [AppState, (_: AppState) => void];

export const AppStateContext = React.createContext<AppStateAndSetter>([{
    lastExecutionError: null,
}, _ => {
    /* Do nothing */
}]);
