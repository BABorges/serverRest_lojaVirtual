// COMANDO PERSONALIZADO PARA LISTAR TODOS OS CARRINHOS CADASTRADOS
Cypress.Commands.add('listaTodosCarrinhos', () => {

    cy.api({
        method: 'GET',
        url: '/carrinhos',
        failOnStatusCode: false
    })
})