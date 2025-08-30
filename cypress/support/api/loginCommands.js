// COMANDO CUSTOMIZADO PARA REALIZAR O LOGIN VIA API
Cypress.Commands.add('realizaLoginAPI', (email = Cypress.env('email'), paswoord = Cypress.env('password')) => {

    cy.request({
        method: 'POST',
        url: `https://serverest.dev/login`,
        failOnStatusCode: false,
        body: {
            "email": email,
            "password": paswoord
        }
    })
})