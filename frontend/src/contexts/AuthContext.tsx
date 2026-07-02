import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { getProfile } from "@/api/auth";

interface User {
  first_name: string;
  last_name: string;
  email: string;
  business_name?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const profile = await getProfile();
      console.log(profile);
      setUser(profile.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
        const token = localStorage.getItem("access_token");

        if (token) {
            refreshUser();
        } else {
            setLoading(false);
        }
        }, []);

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
    window.location.href = "/auth/signin";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext)!;
