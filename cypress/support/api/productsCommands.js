// COMANDO PERSONALIZADO PARA LISTAR TODOS OS PRODUTOS CADASTRADOS
Cypress.Commands.add('listaTodosProdutos', () => {

    cy.api({
        method: 'GET',
        url: '/produtos',
        failOnStatusCode: false
    })
})