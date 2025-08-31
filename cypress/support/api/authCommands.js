// COMANDO CUSTOMIZADO PARA REALIZAR O LOGIN VIA API
Cypress.Commands.add('realizaLoginAPI', (email = Cypress.env('email'), paswoord = Cypress.env('password')) => {

    cy.api({
        method: 'POST',
        url: '/login',
        failOnStatusCode: false,
        body: {
            "email": email,
            "password": paswoord
        }
    })
})