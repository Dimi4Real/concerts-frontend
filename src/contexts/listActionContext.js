'use client'

import { createContext, useContext, useReducer } from "react";
import listAction from "@/core/listAction";

const initialState = {
    type: null,
    row: {},
    reload: false
}

const listActionContext = createContext();

const listActionReducer = (state, action) => {
    switch (action.type) {
        case listAction.RELOAD:
            return { ...state, reload: !state.reload };
        case listAction.UPDATE:
            return { ...state, row: action.payload, type: listAction.UPDATE };
        case listAction.DELETE:
            return { ...state, row: action.payload, type: listAction.DELETE };
        case listAction.CREATE:
            return { ...state, type: listAction.CREATE };
        case listAction.RESET:
            return {
                ...state,
                type: null,
                row: {}
            };
        default:
            return state;
    }
};

const ListActionProvider = ({ children }) => {
    const [state, dispatch] = useReducer(listActionReducer, initialState);
    return (
        <listActionContext.Provider value={{ state, dispatch }}>
            {children}
        </listActionContext.Provider>
    );
};

const useListActions = () => {
    const context = useContext(listActionContext);
    if (context === undefined) {
        throw new Error('useListActions must be used within a ListActionProvider');
    }
    return context;
};

export { ListActionProvider, useListActions };