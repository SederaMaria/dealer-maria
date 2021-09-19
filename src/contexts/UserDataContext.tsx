import React, { createContext } from "react";

// this is the equivalent to the createStore method of Redux
// https://redux.js.org/api/createstore

export const fullName = createContext<Object | undefined>(undefined);

export default {fullName};