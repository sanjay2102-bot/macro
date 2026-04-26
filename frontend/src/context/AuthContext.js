import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

import { api } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem("token")
      .then((stored) => {
        setToken(stored);
        if (stored) return api.me().then(({ user: current }) => setUser(current));
      })
      .finally(() => setBooting(false));
  }, []);

  async function authenticate(mode, payload) {
    const result = mode === "signup" ? await api.signup(payload) : await api.login(payload);
    await AsyncStorage.setItem("token", result.token);
    setToken(result.token);
    setUser(result.user);
  }

  async function logout() {
    await AsyncStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }

  const value = useMemo(() => ({ token, user, setUser, booting, authenticate, logout }), [token, user, booting]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

