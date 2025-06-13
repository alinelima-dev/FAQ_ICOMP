import React, { ReactNode, createContext, useContext } from "react";
import { interfaces } from "inversify";

import { appIocContainer } from "../ioc";

// Este código cria um contexto de IoC (Inversão de Controle) usando a biblioteca "inversify" e o React.Context.
// Ele fornece um provedor IoCContext que injeta um serviço IoCContainer em um contexto de React e um hook personalizado
// useIoCContext que pode ser usado para acessar o contêiner em outros componentes.

export interface IIoCContext {
  serviceContainer: interfaces.Container;
}

const IoCContext = createContext<IIoCContext>({} as IIoCContext);

const IoCProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <IoCContext.Provider value={{ serviceContainer: appIocContainer }}>
      {children}
    </IoCContext.Provider>
  );
};

const useIoCContext = (): IIoCContext => {
  const context = useContext(IoCContext);
  if (!Object.keys(context).length) {
    throw new Error(
      "useIoCContext deve ser utilizado dentro de um IoCProvider"
    );
  }
  return context;
};

export { useIoCContext, IoCProvider };
