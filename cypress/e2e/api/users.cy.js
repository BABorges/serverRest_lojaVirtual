import geraNumeroAleatorio from '../../support/utils/random'
import { gerarDadosUsuario } from '../../support/utils/fakerGenerators'

describe('Usuários', () => {

    context('Consulta de usuário', () => {
        it('Lista todos usuários cadastrados', () => {

            // COMANDO PERSONALIZADO PARA LISTAR TODOS OS USUÁRIOS CADASTRADOS
            cy.listaTodosUsuarios()
                .then((response) => {
                    expect(response.status).to.eq(200)

                    const resultado = response.body
                    expect(resultado).to.be.an('object')
                    expect(resultado).to.include.all.keys('quantidade', 'usuarios')
                    expect(resultado.quantidade).to.be.greaterThan(0)
                    expect(resultado.usuarios).to.not.be.empty
                    expect(resultado.usuarios[0].nome).to.not.be.empty
                    expect(resultado.usuarios[0].email).to.not.be.empty
                    expect(resultado.usuarios[0].password).to.not.be.empty
                    expect(resultado.usuarios[0].administrador).to.not.be.empty
                    expect(resultado.usuarios[0]._id).to.not.be.empty

                    cy.log(`Atualmente existem cadastrados ${resultado.quantidade} usuários!`)
                })
        })

        it('Consulta usuário por id válido', () => {

            // COMANDO PERSONALIZADO PARA LISTAR TODOS OS USUÁRIOS CADASTRADOS
            cy.listaTodosUsuarios()
                .then((response) => {
                    const numFinal = response.body.quantidade
                    cy.log(`Atualmente existem cadastrados ${numFinal} usuários!`)

                    // CHAMA A FUNÇÃO QUE GERA UM NÚMERO ALEATÓRIO PASSANDO A QUANTIDADE DE USUÁRIOS COMO LIMITE
                    const numIdUsuario = geraNumeroAleatorio(numFinal)

                    // ARMAZENA O ID DO USUÁRIO
                    const idConsultaUsuario = response.body.usuarios[numIdUsuario]._id

                    // COMANDO PERSONALIZADO PARA LISTAR UM USUÁRIO CADASTRADOS EM ESPECÍFICO PELO SEU ID
                    cy.consultaUsuario(idConsultaUsuario)
                        .then((response) => {
                            expect(response.status).to.eq(200)

                            const resultado = response.body
                            expect(resultado).to.be.an('object')
                            expect(resultado.nome).to.not.be.empty
                            expect(resultado.email).to.not.be.empty
                            expect(resultado.password).to.not.be.empty
                            expect(resultado.administrador).to.not.be.empty
                            expect(resultado._id).to.not.be.empty

                            cy.log(`O id ${idConsultaUsuario} corresponde ao usuário ${response.body.nome}`)
                        })
                })
        })

        it('Consulta usuário por id inválido', () => {

            // INSERE UM ID INVÁLIDO NA VARIÁVEL
            const idConsultaUsuario = 'AaBbCcDd11223344'

            // COMANDO PERSONALIZADO PARA LISTAR UM USUÁRIO CADASTRADOS EM ESPECÍFICO PELO SEU ID
            cy.consultaUsuario(idConsultaUsuario)
                .then((response) => {
                    expect(response.status).to.eq(400)
                    expect(response.body.message).to.eq('Usuário não encontrado')
                })
        })
    })

    context('Cadastro de usuário', () => {
        it('Cadastra usuário administrador com sucesso', () => {

            // INICIALIZAÇÃO DE VARIÁVEL
            const administrador = 'true'

            // COMANDO PERSONALIZADO PARA LISTAR TODOS OS USUÁRIOS CADASTRADOS
            cy.listaTodosUsuarios()
                .then((response) => {
                    const usuariosCadastrados = response.body.quantidade
                    cy.log(`Atualmente existem cadastrados ${usuariosCadastrados} usuários!`)

                    // GERA E ARMAZENA OS DADOS DO NOVO USUÁRIO
                    const novoUsuario = gerarDadosUsuario()
                    const nome = novoUsuario.nome
                    const email = novoUsuario.email
                    const password = novoUsuario.password

                    // COMANDO PERSONALIZADO PARA CADASTRAR UM NOVO USUÁRIO
                    cy.cadastraUsuario(nome, email, password, administrador)
                        .then((response) => {
                            const usuarioCriado = response.body
                            const idConsultaUsuario = usuarioCriado._id
                            expect(response.status).to.eq(201)
                            expect(usuarioCriado.message).to.eq('Cadastro realizado com sucesso')
                            expect(usuarioCriado._id).to.not.be.empty

                            // COMANDO PERSONALIZADO PARA LISTAR TODOS OS USUÁRIOS CADASTRADOS
                            cy.listaTodosUsuarios()
                                .then((response) => {
                                    const usuariosCadastradosAtualizados = response.body.quantidade
                                    expect(usuariosCadastradosAtualizados).to.eq(usuariosCadastrados + 1)
                                    cy.log(`O cadastro foi atualizado para ${usuariosCadastradosAtualizados} usuários!`)

                                    // COMANDO PERSONALIZADO PARA LISTAR UM USUÁRIO CADASTRADOS EM ESPECÍFICO PELO SEU ID
                                    cy.consultaUsuario(idConsultaUsuario)
                                        .then((response) => {
                                            let perfil = ''
                                            if (response.body.administrador === 'true') {
                                                perfil = 'Administrador'
                                            } else {
                                                perfil = 'Usuário Comum'
                                            }
                                            cy.log(`Nome: ${response.body.nome}`)
                                            cy.log(`Email: ${response.body.email}`)
                                            cy.log(`Password: ${response.body.password}`)
                                            cy.log(`Perfil: ${perfil}`)
                                            cy.log(`ID: ${response.body._id}`)
                                        })
                                })
                        })
                })
        })

        it('Cadastra usuário comum com sucesso', () => {

            // INICIALIZAÇÃO DE VARIÁVEL
            const administrador = 'false'

            // COMANDO PERSONALIZADO PARA LISTAR TODOS OS USUÁRIOS CADASTRADOS
            cy.listaTodosUsuarios()
                .then((response) => {
                    const usuariosCadastrados = response.body.quantidade
                    cy.log(`Atualmente existem cadastrados ${usuariosCadastrados} usuários!`)

                    // GERA E ARMAZENA OS DADOS DO NOVO USUÁRIO
                    const novoUsuario = gerarDadosUsuario()
                    const nome = novoUsuario.nome
                    const email = novoUsuario.email
                    const password = novoUsuario.password

                    // COMANDO PERSONALIZADO PARA CADASTRAR UM NOVO USUÁRIO
                    cy.cadastraUsuario(nome, email, password, administrador)
                        .then((response) => {
                            const usuarioCriado = response.body
                            const idConsultaUsuario = usuarioCriado._id
                            expect(response.status).to.eq(201)
                            expect(usuarioCriado.message).to.eq('Cadastro realizado com sucesso')
                            expect(usuarioCriado._id).to.not.be.empty

                            // COMANDO PERSONALIZADO PARA LISTAR TODOS OS USUÁRIOS CADASTRADOS
                            cy.listaTodosUsuarios()
                                .then((response) => {
                                    const usuariosCadastradosAtualizados = response.body.quantidade
                                    expect(usuariosCadastradosAtualizados).to.eq(usuariosCadastrados + 1)
                                    cy.log(`O cadastro foi atualizado para ${usuariosCadastradosAtualizados} usuários!`)

                                    // COMANDO PERSONALIZADO PARA LISTAR UM USUÁRIO CADASTRADOS EM ESPECÍFICO PELO SEU ID
                                    cy.consultaUsuario(idConsultaUsuario)
                                        .then((response) => {
                                            let perfil = ''
                                            if (response.body.administrador === 'true') {
                                                perfil = 'Administrador'
                                            } else {
                                                perfil = 'Usuário Comum'
                                            }
                                            cy.log(`Nome: ${response.body.nome}`)
                                            cy.log(`Email: ${response.body.email}`)
                                            cy.log(`Password: ${response.body.password}`)
                                            cy.log(`Perfil: ${perfil}`)
                                            cy.log(`ID: ${response.body._id}`)
                                        })
                                })
                        })
                })
        })

        it('Cadastra usuário com email já cadastrado', () => {

            // INICIALIZAÇÃO DE VARIÁVEL
            const administrador = 'false'

            // GERA E ARMAZENA OS DADOS DO NOVO USUÁRIO
            const novoUsuario = gerarDadosUsuario()
            const nome = novoUsuario.nome
            const email = novoUsuario.email
            const password = novoUsuario.password

            // COMANDO PERSONALIZADO PARA CADASTRAR UM NOVO USUÁRIO
            cy.cadastraUsuario(nome, email, password, administrador)
                .then((response) => {
                    const usuarioCriado = response.body
                    expect(response.status).to.eq(201)
                    expect(usuarioCriado.message).to.eq('Cadastro realizado com sucesso')
                    expect(usuarioCriado._id).to.not.be.empty

                    // COMANDO PERSONALIZADO PARA CADASTRAR UM NOVO USUÁRIO
                    cy.cadastraUsuario('Novo Nome', email, 'Novo Password', administrador)
                        .then((response) => {
                            expect(response.status).to.eq(400)
                            expect(response.body.message).to.eq('Este email já está sendo usado')
                            cy.log(`O email ${email} já foi cadastrado.`)
                        })
                })
        })

        it('Cadastra usuário com email inválido', () => {

            // INICIALIZAÇÃO DE VARIÁVEL
            const administrador = 'false'

            // GERA E ARMAZENA OS DADOS DO NOVO USUÁRIO
            const novoUsuario = gerarDadosUsuario()
            const nome = novoUsuario.nome
            const email = novoUsuario.email
            const password = novoUsuario.password
            const emailInvalido = 'teste.com'

            // COMANDO PERSONALIZADO PARA CADASTRAR UM NOVO USUÁRIO
            cy.cadastraUsuario(nome, emailInvalido, password, administrador)
                .then((response) => {
                    expect(response.status).to.eq(400)
                    expect(response.body.email).to.eq('email deve ser um email válido')
                    cy.log(`O email ${emailInvalido} não é um email válido.`)
                })
        })

        it('Cadastra usuário com nome já cadastrado', () => {

            // INICIALIZAÇÃO DE VARIÁVEL
            const administrador = 'false'

            // GERA E ARMAZENA OS DADOS DO NOVO USUÁRIO
            let novoUsuario = gerarDadosUsuario()
            const nome = novoUsuario.nome
            const email = novoUsuario.email
            const password = novoUsuario.password

            // COMANDO PERSONALIZADO PARA CADASTRAR UM NOVO USUÁRIO
            cy.cadastraUsuario(nome, email, password, administrador)
                .then((response) => {
                    const usuarioCriado = response.body
                    expect(response.status).to.eq(201)
                    expect(usuarioCriado.message).to.eq('Cadastro realizado com sucesso')
                    expect(usuarioCriado._id).to.not.be.empty

                    novoUsuario = gerarDadosUsuario()

                    // COMANDO PERSONALIZADO PARA CADASTRAR UM NOVO USUÁRIO
                    cy.cadastraUsuario(nome, novoUsuario.email, novoUsuario.password, administrador)
                        .then((response) => {
                            expect(response.status).to.eq(201)
                            expect(response.body.message).to.eq('Cadastro realizado com sucesso')
                            expect(response.body._id).to.not.be.empty
                        })
                })
        })

        it('Cadastra usuário com campo faltando', () => {

            const campos = ['nome', 'email', 'password', 'administrador']

            campos.forEach((campoVazio) => {

                // INICIALIZAÇÃO DE VARIÁVEL
                let administrador = 'false'

                // GERA E ARMAZENA OS DADOS DO NOVO USUÁRIO
                const novoUsuario = gerarDadosUsuario()

                if (campoVazio === 'administrador') {
                    administrador = ''
                } else {
                    // ENVIA VAZIO O CAMPO QUE ESTA SENDO TESTADO
                    novoUsuario[campoVazio] = ''
                }

                let campo = campoVazio

                // COMANDO PERSONALIZADO PARA CADASTRAR UM NOVO USUÁRIO
                cy.cadastraUsuario(novoUsuario.nome, novoUsuario.email, novoUsuario.password, administrador)
                    .then((response) => {
                        expect(response.status).to.eq(400)
                        if (campoVazio === 'administrador') {
                            expect(response.body.administrador).to.eq(`administrador deve ser 'true' ou 'false'`)
                        } else {
                            expect(response.body[campoVazio]).to.eq(`${campoVazio} não pode ficar em branco`)
                        }
                    })
            })
        })
    })

    context('edição de usuário', () => {
        it('Edita o campo nome com sucesso', () => {

        })

        it('Edita o campo email com sucesso', () => {

        })

        it('Edita o campo password com sucesso', () => {

        })

        it('Edita o campo administrador com sucesso', () => {

        })

        it('Edita todos os campos com sucesso', () => {

        })
        it('Edita o campo email com um email inválido', () => {

        })

        it('Edita o campo email com um email já cadastrado', () => {

        })

        it('Edita o campo com campo faltando', () => {

        })

    })

    context('exclusão de usuário', () => {
        it('Exclui um usuário com sucesso', () => {

        })

        it('Exclui um usuário já excluído', () => {

        })

        it('Exclui um usuário inexistente', () => {

        })
    })
})