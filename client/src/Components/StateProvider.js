import React, { createContext, useContext, useReducer } from "react";

export const StateContext = createContext(); // Prepares the data layer

// Wrap our app and provide the Data layer to every component inside of our app
export const StateProvider = ({ reducer, initialState, children }) => (
    <StateContext.Provider value={useReducer(reducer, initialState)}>
        {/* children refers to the App component in index.js */}
        {children}
    </StateContext.Provider>
);

// Pull information from the data layer
export const useStateValue = () => useContext(StateContext);
