const appConfig = {
  api: {
    url: import.meta.env.VITE_API_URL, //URL base da API
    timeout: 10000,
  },
  appName: "FAQIcomp",
  environment: import.meta.env.MODE || "development",
};

export default appConfig;
