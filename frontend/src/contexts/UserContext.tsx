import React, { createContext, useContext, ReactNode } from "react";
import { useIoCContext } from "./IoCContext";
import { Types } from "../ioc/types";
import { IUserService } from "../services/IUserService";

interface UserContextValue {
  userService: IUserService;
}

const UserContext = createContext<UserContextValue>({} as UserContextValue);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { serviceContainer } = useIoCContext();
  const userService = serviceContainer.get<IUserService>(
    Types.User.IUserService
  );

  return (
    <UserContext.Provider value={{ userService }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within UserProvider");
  }
  return context;
};
