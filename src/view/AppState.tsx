import React from "react";
import {ExecutionError} from "../exec/ExecutionError";
import Immutable from "immutable";
import {State} from "../model/State";

/**
 * Global application state, _excluding_ the state of the Virtual Machine.
 */
export interface AppState {

    readonly vmState: Immutable.List<State>;

    /**
     * string if an internal exception occurred
     */
    readonly lastExecutionError: ExecutionError | string | null;
}

type AppStateAndSetter = [AppState, (_: AppState) => void];

export const AppStateContext = React.createContext<AppStateAndSetter>([{
    vmState: Immutable.List(),
    lastExecutionError: null,
}, _ => {
    /* Do nothing */
}]);
