import { gerarDadosProduto } from '../../support/utils/fakerGenerators'
import geraNumeroAleatorio from '../../support/utils/random'
import { geraQuantidadeAleatorio } from '../../support/utils/random'

describe('Produtos', () => {

    let token

    before(() => {
        cy.realizaLoginAPI()
            .then((response) => {
                token = response.body.authorization
            })
    })

    context('Consulta de produtos', () => {

        it('Lista todos os produtos cadastrados', () => {

            // COMANDO PERSONALIZADO PARA LISTAR TODOS OS PRODUTOS CADASTRADOS
            cy.listaTodosProdutos()
                .then((response) => {
                    expect(response.status).to.eq(200)
                    const resultado = response.body
                    expect(resultado).to.be.an('object')
                    expect(resultado).to.include.all.keys('quantidade', 'produtos')
                    expect(resultado.quantidade).to.be.at.least(0)
                    expect(resultado.produtos).to.not.be.empty
                    expect(resultado.produtos[0].nome).to.not.be.empty
                    expect(resultado.produtos[0].preco).to.be.at.least(0)
                    expect(resultado.produtos[0].descricao).to.not.be.empty
                    expect(resultado.produtos[0].quantidade).to.be.at.least(0)
                    expect(resultado.produtos[0]._id).to.not.be.empty

                    cy.log(`Atualmente existem cadastrados ${resultado.quantidade} produtos!`)
                })
        })

        it('Consulta produto por id válido', () => {

            // COMANDO PERSONALIZADO PARA LISTAR TODOS OS PRODUTOS CADASTRADOS
            cy.listaTodosProdutos()
                .then((response) => {
                    const qtdTotalProtudos = response.body.quantidade
                    cy.log(`Atualmente existem cadastrados ${qtdTotalProtudos} produtos!`)

                    // CHAMA A FUNÇÃO QUE GERA UM NÚMERO ALEATÓRIO PASSANDO A QUANTIDADE DE PRODUTOS COMO LIMITE
                    const numProdutoAleatorio = geraNumeroAleatorio(qtdTotalProtudos)

                    // ARMAZENA O ID DO USUÁRIO
                    const idConsultaProduto = response.body.produtos[numProdutoAleatorio]._id

                    // COMANDO PERSONALIZADO PARA LISTAR UM PRODUTO CADASTRADOS EM ESPECÍFICO PELO SEU ID
                    cy.consultaProduto(idConsultaProduto)
                        .then((response) => {
                            expect(response.status).to.eq(200)

                            const resultado = response.body
                            expect(resultado).to.be.an('object')
                            expect(resultado.nome).to.not.be.empty
                            expect(resultado.preco).to.be.at.least(0)
                            expect(resultado.descricao).to.not.be.empty
                            expect(resultado.quantidade).to.be.at.least(0)
                            expect(resultado._id).to.not.be.empty

                            cy.log(`O id ${idConsultaProduto} corresponde ao produto ${response.body.nome}`)
                        })
                })
        })

        it('Consulta produto por id inválido', () => {

            // INSERE UM ID INVÁLIDO NA VARIÁVEL
            const idConsultaProduto = 'AaBbCcDd11223344'

            // COMANDO PERSONALIZADO PARA LISTAR UM PRODUTO CADASTRADOS EM ESPECÍFICO PELO SEU ID
            cy.consultaProduto(idConsultaProduto)
                .then((response) => {
                    expect(response.status).to.eq(400)
                    expect(response.body.message).to.eq('Produto não encontrado')
                })
        })
    })

    context('Cadastro de produto', () => {

        it('Cadastro de produtos com sucesso', () => {

            // GERA DADOS DO NOVO PRODUTO
            const novoProduto = gerarDadosProduto()
            const nome = novoProduto.productName
            const descricao = novoProduto.productDescrition
            const preco = parseInt(novoProduto.price, 10)
            const quantidade = geraQuantidadeAleatorio()

            // COMANDO PERSONALIZADO PARA CADASTRAR UM NOVO PRODUTO
            cy.cadastraProduto(token, nome, descricao, preco, quantidade)
                .then((response) => {
                    const produtoCriado = response.body
                    const idConsultaProduto = produtoCriado._id
                    expect(response.status).to.eq(201)
                    expect(produtoCriado.message).to.eq('Cadastro realizado com sucesso')
                    expect(produtoCriado._id).to.not.be.empty

                    // COMANDO PERSONALIZADO PARA LISTAR TODOS OS PRODUTOS CADASTRADOS
                    cy.listaTodosProdutos()
                        .then((response) => {
                            expect(response.status).to.eq(200)
                            const resultado = response.body

                            cy.log(`Atualmente existem cadastrados ${resultado.quantidade} produtos!`)

                            // COMANDO PERSONALIZADO PARA LISTAR UM PRODUTO CADASTRADOS EM ESPECÍFICO PELO SEU ID
                            cy.consultaProduto(idConsultaProduto)
                                .then((response) => {
                                    expect(response.status).to.eq(200)
                                    const resultado = response.body

                                    cy.log(`Nome: ${resultado.nome}`)
                                    cy.log(`Preço: ${resultado.preco}`)
                                    cy.log(`Descrição: ${resultado.descricao}`)
                                    cy.log(`Quantidade: ${resultado.quantidade}`)
                                })
                        })
                })
        })

        it('Cadastro de produto com nome já cadastrado', () => {

            // COMANDO PERSONALIZADO PARA LISTAR TODOS OS PRODUTOS CADASTRADOS
            cy.listaTodosProdutos()
                .then((response) => {
                    const qtdTotalProtudos = response.body.quantidade
                    cy.log(`Atualmente existem cadastrados ${qtdTotalProtudos} produtos!`)

                    // CHAMA A FUNÇÃO QUE GERA UM NÚMERO ALEATÓRIO PASSANDO A QUANTIDADE DE PRODUTOS COMO LIMITE
                    const numProdutoAleatorio = geraNumeroAleatorio(qtdTotalProtudos)

                    // GERA DADOS DO NOVO PRODUTO
                    const novoProduto = gerarDadosProduto()
                    const nome = response.body.produtos[numProdutoAleatorio].nome
                    const descricao = novoProduto.productDescrition
                    const preco = parseInt(novoProduto.price, 10)
                    const quantidade = geraQuantidadeAleatorio()

                    // COMANDO PERSONALIZADO PARA CADASTRAR UM NOVO PRODUTO
                    cy.cadastraProduto(token, nome, descricao, preco, quantidade)
                        .then((response) => {
                            expect(response.status).to.eq(400)
                            expect(response.body.message).to.eq('Já existe produto com esse nome')
                        })
                })
        })

        it('Cadastra produto com preço não inteiro', () => {

            // GERA DADOS DO NOVO PRODUTO
            const novoProduto = gerarDadosProduto()
            const nome = novoProduto.productName
            const descricao = novoProduto.productDescrition
            const preco = novoProduto.price
            const quantidade = geraQuantidadeAleatorio()

            // COMANDO PERSONALIZADO PARA CADASTRAR UM NOVO PRODUTO
            cy.cadastraProduto(token, nome, descricao, preco, quantidade)
                .then((response) => {
                    expect(response.status).to.eq(400)
                    expect(response.body.preco).to.eq('preco deve ser um inteiro')
                })
        })

        it('Cadastra produto com quantidade não inteiro', () => {

            // GERA DADOS DO NOVO PRODUTO
            const novoProduto = gerarDadosProduto()
            const nome = novoProduto.productName
            const descricao = novoProduto.productDescrition
            const preco = parseInt(novoProduto.price, 10)
            const quantidade = 10.5

            // COMANDO PERSONALIZADO PARA CADASTRAR UM NOVO PRODUTO
            cy.cadastraProduto(token, nome, descricao, preco, quantidade)
                .then((response) => {
                    expect(response.status).to.eq(400)
                    expect(response.body.quantidade).to.eq('quantidade deve ser um inteiro')
                })
        })

        it('Cadastra produto com token ausente, inválido ou expirado', () => {

            cy.then(() => {

                // GERA DADOS DO NOVO PRODUTO
                const novoProduto = gerarDadosProduto()
                const nome = novoProduto.productName
                const descricao = novoProduto.productDescrition
                const preco = parseInt(novoProduto.price, 10)
                const quantidade = geraQuantidadeAleatorio()

                // COMANDO PERSONALIZADO PARA CADASTRAR UM NOVO PRODUTO
                cy.cadastraProduto("", nome, descricao, preco, quantidade)
                    .then((response) => {
                        expect(response.status).to.eq(401)
                        expect(response.body.message).to.eq('Token de acesso ausente, inválido, expirado ou usuário do token não existe mais')
                    })
            })
        })
    })

    context('Edição de produto', () => {

        it('Edita o campo nome com sucesso', () => {

            // COMANDO PERSONALIZADO PARA LISTAR TODOS OS PRODUTOS CADASTRADOS
            cy.listaTodosProdutos()
                .then((response) => {
                    const qtdTotalProtudos = response.body.quantidade
                    cy.log(`Atualmente existem cadastrados ${qtdTotalProtudos} produtos!`)

                    // CHAMA A FUNÇÃO QUE GERA UM NÚMERO ALEATÓRIO PASSANDO A QUANTIDADE DE PRODUTOS COMO LIMITE
                    const numProdutoAleatorio = geraNumeroAleatorio(qtdTotalProtudos)

                    // ARMAZENA O ID DO USUÁRIO
                    const idConsultaProduto = response.body.produtos[numProdutoAleatorio]._id
                    const descricao = response.body.produtos[numProdutoAleatorio].descricao
                    const preco = response.body.produtos[numProdutoAleatorio].preco
                    const quantidade = response.body.produtos[numProdutoAleatorio].quantidade

                    // GERA DADOS DO NOVO PRODUTO
                    const novoProduto = gerarDadosProduto()
                    const nome = novoProduto.productName

                    // COMANDO PERSONALIZADO PARA CADASTRAR UM NOVO PRODUTO
                    cy.atualizaProduto(token, idConsultaProduto, nome, descricao, preco, quantidade)
                        .then((response) => {
                            const produtoAtualizado = response.body
                            expect(response.status).to.eq(200)
                            expect(produtoAtualizado.message).to.eq('Registro alterado com sucesso')

                            // COMANDO PERSONALIZADO PARA LISTAR TODOS OS PRODUTOS CADASTRADOS
                            cy.listaTodosProdutos()
                                .then((response) => {
                                    expect(response.status).to.eq(200)
                                    const resultado = response.body

                                    cy.log(`Atualmente existem cadastrados ${resultado.quantidade} produtos!`)

                                    cy.log(idConsultaProduto)
                                    // COMANDO PERSONALIZADO PARA LISTAR UM PRODUTO CADASTRADOS EM ESPECÍFICO PELO SEU ID
                                    cy.consultaProduto(idConsultaProduto)
                                        .then((response) => {
                                            cy.log(idConsultaProduto)
                                            expect(response.status).to.eq(200)
                                            const resultado = response.body

                                            cy.log(`Nome: ${resultado.nome}`)
                                            cy.log(`Preço: ${resultado.preco}`)
                                            cy.log(`Descrição: ${resultado.descricao}`)
                                            cy.log(`Quantidade: ${resultado.quantidade}`)
                                        })
                                })
                        })
                })

        })

        it('Edita o campo descrição com sucesso', () => {

            // COMANDO PERSONALIZADO PARA LISTAR TODOS OS PRODUTOS CADASTRADOS
            cy.listaTodosProdutos()
                .then((response) => {
                    const qtdTotalProtudos = response.body.quantidade
                    cy.log(`Atualmente existem cadastrados ${qtdTotalProtudos} produtos!`)

                    // CHAMA A FUNÇÃO QUE GERA UM NÚMERO ALEATÓRIO PASSANDO A QUANTIDADE DE PRODUTOS COMO LIMITE
                    const numProdutoAleatorio = geraNumeroAleatorio(qtdTotalProtudos)

                    // ARMAZENA O ID DO USUÁRIO
                    const idConsultaProduto = response.body.produtos[numProdutoAleatorio]._id
                    const nome = response.body.produtos[numProdutoAleatorio].nome
                    const preco = response.body.produtos[numProdutoAleatorio].preco
                    const quantidade = response.body.produtos[numProdutoAleatorio].quantidade

                    // GERA DADOS DO NOVO PRODUTO
                    const novoProduto = gerarDadosProduto()
                    const descricao = novoProduto.productDescrition

                    // COMANDO PERSONALIZADO PARA CADASTRAR UM NOVO PRODUTO
                    cy.atualizaProduto(token, idConsultaProduto, nome, descricao, preco, quantidade)
                        .then((response) => {
                            const produtoAtualizado = response.body
                            expect(response.status).to.eq(200)
                            expect(produtoAtualizado.message).to.eq('Registro alterado com sucesso')

                            // COMANDO PERSONALIZADO PARA LISTAR TODOS OS PRODUTOS CADASTRADOS
                            cy.listaTodosProdutos()
                                .then((response) => {
                                    expect(response.status).to.eq(200)
                                    const resultado = response.body

                                    cy.log(`Atualmente existem cadastrados ${resultado.quantidade} produtos!`)

                                    cy.log(idConsultaProduto)
                                    // COMANDO PERSONALIZADO PARA LISTAR UM PRODUTO CADASTRADOS EM ESPECÍFICO PELO SEU ID
                                    cy.consultaProduto(idConsultaProduto)
                                        .then((response) => {
                                            cy.log(idConsultaProduto)
                                            expect(response.status).to.eq(200)
                                            const resultado = response.body

                                            cy.log(`Nome: ${resultado.nome}`)
                                            cy.log(`Preço: ${resultado.preco}`)
                                            cy.log(`Descrição: ${resultado.descricao}`)
                                            cy.log(`Quantidade: ${resultado.quantidade}`)
                                        })
                                })
                        })
                })

        })

        it('Edita o campo preço com sucesso', () => {

            // COMANDO PERSONALIZADO PARA LISTAR TODOS OS PRODUTOS CADASTRADOS
            cy.listaTodosProdutos()
                .then((response) => {
                    const qtdTotalProtudos = response.body.quantidade
                    cy.log(`Atualmente existem cadastrados ${qtdTotalProtudos} produtos!`)

                    // CHAMA A FUNÇÃO QUE GERA UM NÚMERO ALEATÓRIO PASSANDO A QUANTIDADE DE PRODUTOS COMO LIMITE
                    const numProdutoAleatorio = geraNumeroAleatorio(qtdTotalProtudos)

                    // ARMAZENA O ID DO USUÁRIO
                    const idConsultaProduto = response.body.produtos[numProdutoAleatorio]._id
                    const descricao = response.body.produtos[numProdutoAleatorio].descricao
                    const nome = response.body.produtos[numProdutoAleatorio].nome
                    const quantidade = response.body.produtos[numProdutoAleatorio].quantidade

                    // GERA DADOS DO NOVO PRODUTO
                    const novoProduto = gerarDadosProduto()
                    const preco = parseInt(novoProduto.price, 10)

                    // COMANDO PERSONALIZADO PARA CADASTRAR UM NOVO PRODUTO
                    cy.atualizaProduto(token, idConsultaProduto, nome, descricao, preco, quantidade)
                        .then((response) => {
                            const produtoAtualizado = response.body
                            expect(response.status).to.eq(200)
                            expect(produtoAtualizado.message).to.eq('Registro alterado com sucesso')

                            // COMANDO PERSONALIZADO PARA LISTAR TODOS OS PRODUTOS CADASTRADOS
                            cy.listaTodosProdutos()
                                .then((response) => {
                                    expect(response.status).to.eq(200)
                                    const resultado = response.body

                                    cy.log(`Atualmente existem cadastrados ${resultado.quantidade} produtos!`)

                                    cy.log(idConsultaProduto)
                                    // COMANDO PERSONALIZADO PARA LISTAR UM PRODUTO CADASTRADOS EM ESPECÍFICO PELO SEU ID
                                    cy.consultaProduto(idConsultaProduto)
                                        .then((response) => {
                                            cy.log(idConsultaProduto)
                                            expect(response.status).to.eq(200)
                                            const resultado = response.body

                                            cy.log(`Nome: ${resultado.nome}`)
                                            cy.log(`Preço: ${resultado.preco}`)
                                            cy.log(`Descrição: ${resultado.descricao}`)
                                            cy.log(`Quantidade: ${resultado.quantidade}`)
                                        })
                                })
                        })
                })

        })

        it('Edita o campo preço com sucesso', () => {

            // COMANDO PERSONALIZADO PARA LISTAR TODOS OS PRODUTOS CADASTRADOS
            cy.listaTodosProdutos()
                .then((response) => {
                    const qtdTotalProtudos = response.body.quantidade
                    cy.log(`Atualmente existem cadastrados ${qtdTotalProtudos} produtos!`)

                    // CHAMA A FUNÇÃO QUE GERA UM NÚMERO ALEATÓRIO PASSANDO A QUANTIDADE DE PRODUTOS COMO LIMITE
                    const numProdutoAleatorio = geraNumeroAleatorio(qtdTotalProtudos)

                    // ARMAZENA O ID DO USUÁRIO
                    const idConsultaProduto = response.body.produtos[numProdutoAleatorio]._id
                    const descricao = response.body.produtos[numProdutoAleatorio].descricao
                    const nome = response.body.produtos[numProdutoAleatorio].nome
                    const preco = response.body.produtos[numProdutoAleatorio].preco

                    // GERA DADOS DO NOVO PRODUTO
                    const quantidade = geraQuantidadeAleatorio()

                    // COMANDO PERSONALIZADO PARA CADASTRAR UM NOVO PRODUTO
                    cy.atualizaProduto(token, idConsultaProduto, nome, descricao, preco, quantidade)
                        .then((response) => {
                            const produtoAtualizado = response.body
                            expect(response.status).to.eq(200)
                            expect(produtoAtualizado.message).to.eq('Registro alterado com sucesso')

                            // COMANDO PERSONALIZADO PARA LISTAR TODOS OS PRODUTOS CADASTRADOS
                            cy.listaTodosProdutos()
                                .then((response) => {
                                    expect(response.status).to.eq(200)
                                    const resultado = response.body

                                    cy.log(`Atualmente existem cadastrados ${resultado.quantidade} produtos!`)

                                    // COMANDO PERSONALIZADO PARA LISTAR UM PRODUTO CADASTRADOS EM ESPECÍFICO PELO SEU ID
                                    cy.consultaProduto(idConsultaProduto)
                                        .then((response) => {
                                            cy.log(idConsultaProduto)
                                            expect(response.status).to.eq(200)
                                            const resultado = response.body

                                            cy.log(`Nome: ${resultado.nome}`)
                                            cy.log(`Preço: ${resultado.preco}`)
                                            cy.log(`Descrição: ${resultado.descricao}`)
                                            cy.log(`Quantidade: ${resultado.quantidade}`)
                                        })
                                })
                        })
                })

        })
    })

    context('Exclusão de produtos', () => {

        it('Excluir um produto com sucesso', () => {

            // COMANDO PERSONALIZADO PARA LISTAR TODOS OS PRODUTOS CADASTRADOS
            cy.listaTodosProdutos()
                .then((response) => {
                    const qtdTotalProtudos = response.body.quantidade
                    cy.log(`Atualmente existem cadastrados ${qtdTotalProtudos} produtos!`)

                    // CHAMA A FUNÇÃO QUE GERA UM NÚMERO ALEATÓRIO PASSANDO A QUANTIDADE DE PRODUTOS COMO LIMITE
                    const numProdutoAleatorio = geraNumeroAleatorio(qtdTotalProtudos)

                    // ARMAZENA O ID DO USUÁRIO
                    const produtoResponse = {
                        idConsultaProduto: response.body.produtos[numProdutoAleatorio]._id,
                        nome: response.body.produtos[numProdutoAleatorio].nome,
                        descricao: response.body.produtos[numProdutoAleatorio].descricao,
                        preco: response.body.produtos[numProdutoAleatorio].preco,
                        quantidade: response.body.produtos[numProdutoAleatorio].quantidade
                    }

                    cy.log(`ID do Produto: ${produtoResponse.idConsultaProduto}`)
                    cy.log(`Produto: ${produtoResponse.nome}`)
                    cy.log(`Descrição: ${produtoResponse.descricao}`)
                    cy.log(`Preço: ${produtoResponse.preco}`)
                    cy.log(`Quantidade: ${produtoResponse.quantidade}`)

                    // COMANDO PERSONALIZADO PARA DELETAR UM PRODUTO
                    cy.delelaProduto(token, produtoResponse.idConsultaProduto)
                        .then((response) => {
                            expect(response.status).to.eq(200)
                            const resultado = response.body
                            expect(resultado).to.be.an('object')
                            expect(resultado.message).to.not.be.empty
                            expect(resultado.message).to.eq('Registro excluído com sucesso')

                            // COMANDO PERSONALIZADO PARA LISTAR UM PRODUTO CADASTRADOS EM ESPECÍFICO PELO SEU ID
                            cy.consultaProduto(produtoResponse.idConsultaProduto)
                                .then((response) => {
                                    expect(response.status).to.eq(400)
                                    expect(response.body.message).to.eq('Produto não encontrado')
                                    cy.log(`O produto ${produtoResponse.nome} de ID ${produtoResponse.idConsultaProduto} foi excluído e não consta mais em nossa base.`)
                                })
                        })
                })
        })

        it('Excluir um produto que consta em um carrinho', () => {

        })

        it('Excluir um produto como usuário comum', () => {

        })

        it('Excluir um produto com token ausente, inválido ou expirado', () => {

            // COMANDO PERSONALIZADO PARA LISTAR TODOS OS PRODUTOS CADASTRADOS
            cy.listaTodosProdutos()
                .then((response) => {
                    const qtdTotalProtudos = response.body.quantidade
                    cy.log(`Atualmente existem cadastrados ${qtdTotalProtudos} produtos!`)

                    // CHAMA A FUNÇÃO QUE GERA UM NÚMERO ALEATÓRIO PASSANDO A QUANTIDADE DE PRODUTOS COMO LIMITE
                    const numProdutoAleatorio = geraNumeroAleatorio(qtdTotalProtudos)

                    // ARMAZENA O ID DO USUÁRIO
                    const produtoResponse = {
                        idConsultaProduto: response.body.produtos[numProdutoAleatorio]._id,
                        nome: response.body.produtos[numProdutoAleatorio].nome,
                        descricao: response.body.produtos[numProdutoAleatorio].descricao,
                        preco: response.body.produtos[numProdutoAleatorio].preco,
                        quantidade: response.body.produtos[numProdutoAleatorio].quantidade
                    }

                    cy.log(`ID do Produto: ${produtoResponse.idConsultaProduto}`)
                    cy.log(`Produto: ${produtoResponse.nome}`)
                    cy.log(`Descrição: ${produtoResponse.descricao}`)
                    cy.log(`Preço: ${produtoResponse.preco}`)
                    cy.log(`Quantidade: ${produtoResponse.quantidade}`)

                    // COMANDO PERSONALIZADO PARA DELETAR UM PRODUTO
                    cy.delelaProduto("", produtoResponse.idConsultaProduto)
                        .then((response) => {
                        expect(response.status).to.eq(401)
                        expect(response.body.message).to.eq('Token de acesso ausente, inválido, expirado ou usuário do token não existe mais')
                    })
                })
        })
    })
})