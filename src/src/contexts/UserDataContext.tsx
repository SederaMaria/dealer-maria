import React, { createContext } from "react";
interface UserDataProps {
    fullName?: string
}

export const UserDataContext = createContext<UserDataProps>({});

export default {UserDataContext};