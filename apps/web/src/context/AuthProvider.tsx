import { useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes/routes";
import { AuthContext } from "./AuthContext";
import { useLogout } from "@/hooks/user.hook";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(
    localStorage.getItem("token")
  );
  const { mutate: userLogout } = useLogout();
  const navigate = useNavigate();

  const setToken = useCallback((newToken: string | null) => {
    if (newToken) localStorage.setItem("token", newToken);
    else localStorage.removeItem("token");
    setTokenState(newToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setTokenState(null);
    userLogout();
    navigate(ROUTES.LOGIN);
  }, [navigate]);

  useEffect(() => {
    const syncAuth = () => setTokenState(localStorage.getItem("token"));
    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  return (
    <AuthContext.Provider value={{ token, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
