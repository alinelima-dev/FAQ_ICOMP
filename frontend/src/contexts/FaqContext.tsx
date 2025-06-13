import React, { createContext, useContext, ReactNode } from "react";
import { useIoCContext } from "./IoCContext";
import { Types } from "../ioc/types";
import { IFaqService } from "../services/IFaqService";

interface FaqContextValue {
  faqService: IFaqService;
}

const FaqContext = createContext<FaqContextValue>({} as FaqContextValue);

export const FaqProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { serviceContainer } = useIoCContext();
  const faqService = serviceContainer.get<IFaqService>(Types.Faq.IFaqService);

  return (
    <FaqContext.Provider value={{ faqService }}>{children}</FaqContext.Provider>
  );
};

export const useFaqContext = () => {
  const context = useContext(FaqContext);
  if (!context) {
    throw new Error("useFaqContext must be used within FaqProvider");
  }
  return context;
};
