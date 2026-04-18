"use client";
import { REST_API } from "@/constants";
import { createContext, useEffect, useState, useMemo, ReactNode, Dispatch, SetStateAction } from "react";
import { AppLoading } from "@/components";
import { socket } from "@/lib/socket";
import { User } from "@/types";

// --- Define Types for Contexts ---
type ContextState<T> = [T, Dispatch<SetStateAction<T>>];

interface SocketContextType {
  socket: typeof socket;
  isConnected: boolean;
}

// ---  Initialize Contexts with correct types ---
export const SocketContext = createContext<SocketContextType | null>(null);

// Use Type Assertions to satisfy TypeScript's strict checking
export const UserContext = createContext<ContextState<User>>([{} as User, () => {}]);
export const UserTypeContext = createContext<ContextState<string>>(["", () => {}]);
export const LoggedInContext = createContext<ContextState<boolean>>([false, () => {}]);
export const AppLoadingContext = createContext<ContextState<boolean>>([true, () => {}]);

export default function AppContext({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>({
    user_id: "",
    first_name: "",
    last_name: "",
    email: "",
    sex: "",
    country: "",
    school: "",
    department: "",
    phoneNumber: "",
    role: "student",
    avatar: ""
  });
  
  const [userType, setUserType] = useState("");
  const [appLoading, setAppLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const authenticateUser = async () => {
      try {
        const response = await fetch(
          `${REST_API}/auth_session/76543b590e84a2512f45c9247413009d`,
          {
            method: "get",
            headers: { "content-Type": "application/json" },
            credentials: "include",
          },
        );
        const res = await response.json();

        if (res?.user_id) {
          setUser(res);
          setUserType(res.role);
          setLoggedIn(true);

          if (!socket.connected) socket.connect();
        }
      } catch (error) {
        console.error("Auth failed:", error);
      } finally {
        setAppLoading(false);
      }
    };

    authenticateUser();

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  useEffect(() => {
    if (isConnected && user?.user_id) {
      socket.emit("AddUserToActive", {
        userId: user.user_id,
        role: user.role,
      });
    }
  }, [isConnected, user]);

  const socketValue = useMemo(() => ({ socket, isConnected }), [isConnected]);

  return (
    <SocketContext.Provider value={socketValue}>
      <LoggedInContext.Provider value={[loggedIn, setLoggedIn]}>
        <AppLoadingContext.Provider value={[appLoading, setAppLoading]}>
          <UserContext.Provider value={[user, setUser]}>
            <UserTypeContext.Provider value={[userType, setUserType]}>
              {appLoading ? <AppLoading /> : children}
            </UserTypeContext.Provider>
          </UserContext.Provider>
        </AppLoadingContext.Provider>
      </LoggedInContext.Provider>
    </SocketContext.Provider>
  );
}