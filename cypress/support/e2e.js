// ***********************************************************
// Import plugins
import 'cypress-plugin-api'
// Configurar locale para português (opcional)
import { faker } from '@faker-js/faker/locale/pt_BR'
// ***********************************************************
// Import commands.js using ES2015 syntax:
import './commands'
import'./api/authCommands'
import './api/usersCommands'
import './utils/random'
import './utils/fakerGenerators'