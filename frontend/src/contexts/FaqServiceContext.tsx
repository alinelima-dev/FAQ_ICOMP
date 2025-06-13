import React, { createContext, useContext } from "react";
import { IFaqService } from "../services/IFaqService";
import { appIocContainer } from "../ioc";
import { Types } from "../ioc/types";

const faqServiceInstance = appIocContainer.get<IFaqService>(
  Types.Faq.IFaqService
);

const FaqServiceContext = createContext<IFaqService | null>(null);

export const FaqServiceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <FaqServiceContext.Provider value={faqServiceInstance}>
      {children}
    </FaqServiceContext.Provider>
  );
};

export const useFaqService = (): IFaqService => {
  const context = useContext(FaqServiceContext);
  if (!context)
    throw new Error("useFaqService must be used within FaqServiceProvider");
  return context;
};
