import { createContext, useContext, useState } from "react";
import { STORAGE_KEYS } from "../constants/storage";
import { ROLE_PREFIX } from "../constants/roles";

const AuthContext = createContext(null);

function getInitialToken() {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
}

function getInitialUsername() {
  return localStorage.getItem(STORAGE_KEYS.USERNAME);
}

function getInitialRoles() {
  const savedRoles = localStorage.getItem(STORAGE_KEYS.ROLES);
  if (!savedRoles) return [];
  try {
    return JSON.parse(savedRoles);
  } catch {
    return [];
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getInitialToken());
  const [username, setUsername] = useState(() => getInitialUsername());
  const [roles, setRoles] = useState(() => getInitialRoles());

  const login = (newToken, newUsername, rolesArray) => {
    setToken(newToken);
    setUsername(newUsername);
    setRoles(rolesArray) || [];

    localStorage.setItem(STORAGE_KEYS.TOKEN, newToken);
    localStorage.setItem(STORAGE_KEYS.USERNAME, newUsername);
    localStorage.setItem(STORAGE_KEYS.ROLES, JSON.stringify(rolesArray || []));
  };

  const logout = () => {
    setToken(null);
    setUsername(null);
    setRoles([]);

    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USERNAME);
    localStorage.removeItem(STORAGE_KEYS.ROLES);
  };

  const isAuthenticated = !!token;

  const hasRole = (roleName) => {
    if (!roles) return false;
    return roles.some(
      (r) =>
        r === roleName ||
        r === `${ROLE_PREFIX}${roleName}` ||
        r.endsWith(roleName)
    );
  };

  const value = {
    token,
    username,
    roles,
    isAuthenticated,
    login,
    logout,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
