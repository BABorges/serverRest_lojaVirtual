

// COMANDO PERSONALIZADO PARA LISTAR TODOS OS USUÁRIOS CADASTRADOS
Cypress.Commands.add('listaTodosUsuarios', () => {

    cy.api({
        method: 'GET',
        url: '/usuarios',
        failOnStatusCode: false
    })
})

// COMANDO PERSONALIZADO PARA LISTAR UM USUÁRIO CADASTRADOS EM ESPECÍFICO PELO SEU ID
Cypress.Commands.add('consultaUsuario', (idConsultaUsuario) => {

    cy.api({
        method: 'GET',
        url: `/usuarios/${idConsultaUsuario}`,
        failOnStatusCode: false
    })
})

// COMANDO PERSONALIZADO PARA CADASTRAR UM NOVO USUÁRIO
Cypress.Commands.add('cadastraUsuario', (nome, email, password, administrador) => {

    cy.api({
        method: 'POST',
        url: '/usuarios',
        failOnStatusCode: false,
        body: {
            "nome": nome,
            "email": email,
            "password": password,
            "administrador": administrador
        }
    })
})