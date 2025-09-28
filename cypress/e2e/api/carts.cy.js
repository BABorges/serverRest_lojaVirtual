describe('Carrinhos', () => {

    let token

    before(() => {
        cy.realizaLoginAPI()
            .then((response) => {
                token = response.body.authorization
            })
    })

    context('Consulta de carrinhos', () => {

        it('Lista todos os carrinhos cadastrados', () => {

            // COMANDO PERSONALIZADO PARA LISTAR TODOS OS CARRINHOS CADASTRADOS
            cy.listaTodosCarrinhos()
        })
    })

    context('Cadastro de carrinho', () => {


    })

    context('Exclusão de carrinhos', () => {


    })
})