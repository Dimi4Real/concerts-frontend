'use client'

import { createContext, useContext, useReducer } from "react";

const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
};

export const authAction = {
    LOGIN: "LOGIN",
    LOGOUT: "LOGOUT",
};

const authContext = createContext();

const authReducer = (state, action) => {
    switch (action.type) {
        case authAction.LOGIN:
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                isAuthenticated: true,
            };
        case authAction.LOGOUT:
            return initialState;
        default:
            return state;
    }
};

const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    return (
        <authContext.Provider value={{ state, dispatch }}>
            {children}
        </authContext.Provider>
    );
};

const useAuth = () => {
    const context = useContext(authContext);

    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
};

export { AuthProvider, useAuth };