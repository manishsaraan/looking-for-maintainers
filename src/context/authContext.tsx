import React, { createContext } from "react";

const AuthContext = createContext(null);

export const Provider = AuthContext.Provider;
export const Consumer = AuthContext.Consumer;
export default AuthContext;
