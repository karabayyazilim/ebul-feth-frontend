import { loginAPI, myAccountAPI } from "@/api/web/auth";
import { setSession } from "@/utils/jwt";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface IAuthContext {
  login: (code: string) => Promise<any>;
  logout: () => void;
  user: IUser | null;

  isInitializing: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<IAuthContext>({
  async login(code: string) {},
  logout() {},
  user: null,
  isInitializing: true,
  isAuthenticated: false,
});

export const useAuthContext = () => useContext(AuthContext);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (code: string) => {
    try {
      const { token, user } = await loginAPI(code);

      setSession(token);
      authenticated(user);
    } catch (error) {
      console.log(error);
      reset();
      setSession(null);
    }
  };

  const logout = () => {
    console.log("reset");
    reset();
  };

  const authenticated = (user: IUser) => {
    setUser(user);
    setIsInitializing(false);
    setIsAuthenticated(true);
  };

  const reset = () => {
    setSession(null);
    setUser(null);
    setIsInitializing(false);
    setIsAuthenticated(false);
  };

  const initialize = useCallback(async (token: string) => {
    try {
      setSession(token);
      const user = await myAccountAPI();
      authenticated(user);
    } catch (error) {
      reset();
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      if (!token) {
        reset();
      } else {
        initialize(token);
      }
    }
  }, [initialize]);

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        user,
        isAuthenticated,
        isInitializing,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
