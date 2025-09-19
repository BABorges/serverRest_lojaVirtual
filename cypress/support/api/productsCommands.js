// COMANDO PERSONALIZADO PARA LISTAR TODOS OS PRODUTOS CADASTRADOS
Cypress.Commands.add('listaTodosProdutos', () => {

    cy.api({
        method: 'GET',
        url: '/produtos',
        failOnStatusCode: false
    })
})

// COMANDO PERSONALIZADO PARA LISTAR UM PRODUTO CADASTRADOS EM ESPECÍFICO PELO SEU ID
Cypress.Commands.add('consultaProduto', (idConsultaProduto) => {

    cy.api({
        method: 'GET',
        url: `/produtos/${idConsultaProduto}`,
        failOnStatusCode: false
    })
})

// COMANDO PERSONALIZADO PARA CADASTRAR UM NOVO PRODUTO
Cypress.Commands.add('cadastraProduto', (token, nome, descricao, preco, quantidade) => {

    cy.api({
        method: 'POST',
        url: '/produtos',
        failOnStatusCode: false,
        headers: {
            "Authorization": token
        },
        body: {
            "nome": nome,
            "preco": preco,
            "descricao": descricao,
            "quantidade": quantidade
        }
    })
})