const appConfig = {
  api: {
    url: "http://localhost:3002/api", // URL base da sua API
    timeout: 10000, // Timeout padrão das requisições (em milissegundos)
  },
  // Outras configurações da aplicação podem ser adicionadas aqui
  appName: "FAQIcomp",
  environment: process.env.NODE_ENV || "development",
};

export default appConfig;
