import * as React from "react";

interface IGlobal {
    children?: JSX.Element;
}

export interface GlobalState {
    notifications?: string[];
}

export interface GlobalAction {
    type: string;
    payload: never;
}

export const StateContext = React.createContext<GlobalState | undefined>(
    undefined,
);

function reducer(state: GlobalState, action: GlobalAction) {
    switch (action.type) {
        default:
            return state;
    }
}

export const DispatchContext = React.createContext<
    React.Dispatch<GlobalAction> | undefined
>(undefined);

const initState: GlobalState = {};

export default function Global({ children }: IGlobal) {
    // for state control
    const [state, dispatch] = React.useReducer(reducer, initState);
    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>
                {children}
            </DispatchContext.Provider>
        </StateContext.Provider>
    );
}
