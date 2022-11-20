import React from "react";
import {ExecutionError} from "../exec/ExecutionError";
import Immutable from "immutable";
import {State} from "../model/State";
import * as ProgramText from "../model/ProgramText";
import {TextEditor} from "../model/text/TextEditor";

/**
 * Global application state, _excluding_ the state of the Virtual Machine.
 */
export interface AppState {

    readonly vmState: Immutable.List<State>;

    /**
     * string if an internal exception occurred
     */
    readonly lastExecutionError: ExecutionError | string | null;

    readonly autoStepEnabled: boolean;
}

type AppStateAndSetter = [AppState, (_: AppState) => void];

export const AppStateContext = React.createContext<AppStateAndSetter>([{
    vmState: Immutable.List(),
    lastExecutionError: null,
    autoStepEnabled: false,
}, _ => {
    /* Do nothing */
}]);

export interface ProgramTextFacade {

    readonly programText: ProgramText.Text;

    readonly editor: TextEditor;

    setEditor(editor: TextEditor): void;

}

export const ProgramTextContext = React.createContext<ProgramTextFacade>({

    programText: ProgramText.parseProgramText([""]),

    editor: TextEditor.create(),

    setEditor(_: TextEditor): void {
        // Do nothing
    },
});
