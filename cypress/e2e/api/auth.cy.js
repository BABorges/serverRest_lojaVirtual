describe('Login', () => {
  it('Login com sucesso via API', () => {
    cy.realizaLoginAPI()
      .then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('object')
        expect(response.body).to.include.all.keys('message', 'authorization')
        expect(response.body.message).to.eq('Login realizado com sucesso')
        expect(response.body.authorization).to.include('Bearer')
        expect(response.body.authorization).to.not.be.empty
      })
  })

  context('Falha no login via API', () => {

    context('Dados incorretos', () => {

      it('Falha no login informando o email incorreto', () => {
        cy.realizaLoginAPI('emailIncoreto@teste.com')
          .then((response) => {
            expect(response.status).to.eq(401)
            expect(response.body.message).to.eq('Email e/ou senha inválidos')
            expect(response.body).to.not.include.key('autorization')
          })
      })

      it('Falha no login informando a senha incorreta', () => {
        cy.realizaLoginAPI(Cypress.env('email'), '1234')
          .then((response) => {
            expect(response.status).to.eq(401)
            expect(response.body.message).to.eq('Email e/ou senha inválidos')
            expect(response.body).to.not.include.key('autorization')
          })
      })
    })

    context('Dados não informados', () => {

      it('Falha no login não informando o email', () => {
        cy.realizaLoginAPI('')
          .then((response) => {
            expect(response.status).to.eq(400)
            expect(response.body.email).to.eq('email não pode ficar em branco')
            expect(response.body).to.not.include.keys('message', 'autorization')
          })
      })

      it('Falha no login não informando a senha', () => {
        cy.realizaLoginAPI(Cypress.env('email'), '')
          .then((response) => {
            expect(response.status).to.eq(400)
            expect(response.body.password).to.eq('password não pode ficar em branco')
            expect(response.body).to.not.include.keys('message', 'autorization')
          })
      })
    })
  })
})