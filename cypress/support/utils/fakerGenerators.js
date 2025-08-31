import { faker } from '@faker-js/faker/locale/pt_BR'

// GERAR DADOS PARA CADASTRO DO USUÁRIO
export const gerarDadosUsuario = () => {
    return {
        nome: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        password: faker.internet.password(16, true, /[A-Za-z0-9]/)
    }
}