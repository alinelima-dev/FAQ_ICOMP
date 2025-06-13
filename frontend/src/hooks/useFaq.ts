import { useFaqContext } from "../contexts/FaqContext";

export const useFaq = () => {
  const { faqService } = useFaqContext();

  return {
    faqService,
  };
};
