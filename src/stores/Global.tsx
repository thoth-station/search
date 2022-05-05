import * as React from "react";

interface IGlobal {
    children?: JSX.Element;
}

export interface GlobalState {
    notifications?: string[];
    loading?: {
        [key: string]: {
            isLoading: boolean;
            total?: number;
            value?: number;
            text?: string;
        };
    };
}

export interface GlobalAction {
    type: string;
    payload: unknown;
}

type LoadingPayload = {
    name: string;
    isLoading: boolean;
    total?: number;
    value?: number;
    text?: string;
};

export const StateContext = React.createContext<GlobalState | undefined>(
    undefined,
);

function reducer(state: GlobalState, action: GlobalAction) {
    switch (action.type) {
        case "loading": {
            const input = action.payload as LoadingPayload;
            return {
                ...state,
                loading: {
                    ...state.loading,
                    [input.name]: {
                        isLoading: input.isLoading,
                        total: input.total,
                        value: input.value,
                        text: input.text,
                    },
                },
            };
        }
        default:
            return state;
    }
}
interface IActionMap {
    updateLoading: (
        name: string,
        text?: string,
        value?: number,
        total?: number,
    ) => void;
}

export const DispatchContext = React.createContext<IActionMap>({
    updateLoading: () => undefined,
});

const initState: GlobalState = {};

export default function Global({ children }: IGlobal) {
    // for state control
    const [state, dispatch] = React.useReducer(reducer, initState);

    const actionMap: IActionMap = React.useMemo(() => {
        return {
            updateLoading: (
                name: string,
                text?: string,
                value?: number,
                total?: number,
            ) => {
                if (!value || !total) {
                    dispatch({
                        type: "loading",
                        payload: {
                            name: name,
                            isLoading: false,
                            value: 0,
                            total: 1,
                            text: text,
                        },
                    });
                } else {
                    dispatch({
                        type: "loading",
                        payload: {
                            name: name,
                            isLoading: true,
                            value: value ?? 0,
                            total: total ? total : 1,
                            text: text,
                        },
                    });
                }
            },
        };
    }, []);

    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={actionMap}>
                {children}
            </DispatchContext.Provider>
        </StateContext.Provider>
    );
}
