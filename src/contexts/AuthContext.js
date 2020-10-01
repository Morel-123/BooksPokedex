import React, { createContext, useState } from "react";
import User from "../entities/User";

const AuthContext = createContext();

function AuthContextProvider({ children }) {
  const [user, setUser] = useState(User());

  function completeRegistration(user) {
    console.log(`user: ${user}`);
    setUser(user);
  }
  function cancelRegistration() {
    setUser(null);
  }

  const defaultContext = {
    user,
    completeRegistration,
    cancelRegistration,
  };

  return (
    <AuthContext.Provider value={defaultContext}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthContextProvider };
