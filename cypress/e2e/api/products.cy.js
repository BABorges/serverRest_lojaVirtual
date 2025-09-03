import { gerarDadosProduto } from '../../support/utils/fakerGenerators'
import {geraQuantidadeAleatorio} from '../../support/utils/random'

describe('Produtos', () => {

    context('Consulta de produtos', () => {

        it('Lista todos os produtos cadastrados', () => {

            // COMANDO PERSONALIZADO PARA LISTAR TODOS OS PRODUTOS CADASTRADOS
            cy.listaTodosProdutos()
                .then((response) => {
                    expect(response.status).to.eq(200)
                    const resultado = response.body
                    expect(resultado).to.be.an('object')
                    expect(resultado).to.include.all.keys('quantidade', 'produtos')
                    expect(resultado.quantidade).to.be.greaterThan(0)
                    expect(resultado.produtos).to.not.be.empty
                    expect(resultado.produtos[0].nome).to.not.be.empty
                    expect(resultado.produtos[0].preco).to.be.greaterThan(0)
                    expect(resultado.produtos[0].descricao).to.not.be.empty
                    expect(resultado.produtos[0].quantidade).to.be.greaterThan(0)
                    expect(resultado.produtos[0]._id).to.not.be.empty

                    cy.log(`Atualmente existem cadastrados ${resultado.quantidade} produtos!`)
                })
        })

        
    })

    context('Cadastro de produto', () => {

        it.only('Cadastro de produtos com sucesso', () => {

const novoProduto = gerarDadosProduto()

cy.log(novoProduto.productName)
cy.log(novoProduto.productDescrition)
cy.log(novoProduto.price)

const quantidade = geraQuantidadeAleatorio()
cy.log(quantidade)
        })
    })
})