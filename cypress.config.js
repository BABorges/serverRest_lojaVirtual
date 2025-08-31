const { defineConfig } = require("cypress");

module.exports = defineConfig({

  // CONFIGURA O TAMANHO DA TELA
  /* viewportWidth: 1920,
  viewportHeight: 1080, */

  e2e: {
    env: {
      // Configurações do cypress-plugin-api
      hideCredentials: true,     // OCulta dados sensíveis
      requestMode: true,         // Modo visual para APIs
      snapshotOnly: false,       // Mostra detalhes completos
    },
    // BASEURL
    baseUrl: 'https://serverest.dev',
    // DESATIVA O WEBCHROME
    chromeWebSecurity: false,

    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
