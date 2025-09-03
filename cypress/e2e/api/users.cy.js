import geraNumeroAleatorio from '../../support/utils/random'
import { gerarDadosUsuario } from '../../support/utils/fakerGenerators'

describe('Usuários', () => {

    context('Consulta de usuários', () => {
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
        it('Cadastro de usuário administrador com sucesso', () => {

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

        it('Cadastro de usuário comum com sucesso', () => {

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

        it('Cadastro de usuário com email já cadastrado', () => {

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

        it('Cadastro de usuário com email inválido', () => {

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

        it('Cadastro de usuário com nome já cadastrado', () => {

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

        it('Cadastro de usuário com campo faltando', () => {

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

            // COMANDO PERSONALIZADO PARA LISTAR TODOS OS USUÁRIOS CADASTRADOS
            cy.listaTodosUsuarios()
                .then((response) => {
                    const resultado = response.body
                    const numFinal = resultado.quantidade
                    cy.log(`Atualmente existem cadastrados ${numFinal} usuários!`)

                    // CHAMA A FUNÇÃO QUE GERA UM NÚMERO ALEATÓRIO PASSANDO A QUANTIDADE DE USUÁRIOS COMO LIMITE
                    const numIdUsuario = geraNumeroAleatorio(numFinal)

                    // ARMAZENA OS DADOS DO USUÁRIO
                    const dadosUsuarioConsultado = {
                        nomeAtual: resultado.usuarios[numIdUsuario].nome,
                        emailAtual: resultado.usuarios[numIdUsuario].email,
                        passwordAtual: resultado.usuarios[numIdUsuario].password,
                        administradorAtual: resultado.usuarios[numIdUsuario].administrador,
                        idAatual: resultado.usuarios[numIdUsuario]._id
                    }

                    cy.log(`Nome do usuário consultado: ${dadosUsuarioConsultado.nomeAtual}`)
                    cy.log(`Email do usuário consultado: ${dadosUsuarioConsultado.emailAtual}`)
                    cy.log(`Password do usuário cadastrado: ${dadosUsuarioConsultado.passwordAtual}`)
                    cy.log(`ID do usuário consultado: ${dadosUsuarioConsultado.idAatual}`)

                    // ARMAZENA OS DADOS DO BODY PARA EDIÇÃO
                    let dadosBodyRequest = {
                        nome: resultado.usuarios[numIdUsuario].nome,
                        email: resultado.usuarios[numIdUsuario].email,
                        password: resultado.usuarios[numIdUsuario].password,
                        administrador: resultado.usuarios[numIdUsuario].administrador
                    }

                    const idEditaUsuario = dadosUsuarioConsultado.idAatual

                    // GERA E ARMAZENA OS DADOS DO NOVO USUÁRIO
                    const novoUsuario = gerarDadosUsuario()

                    dadosBodyRequest.nome = novoUsuario.nome

                    // COMANDO PERSONALIZADO PARA EDITAR UM USUÁRIO CADASTRADOS PELO SEU ID
                    cy.editaUsuario(idEditaUsuario, dadosBodyRequest)
                        .then((response) => {
                            expect(response.status).to.eq(200)
                            const resultado = response.body
                            expect(resultado).to.be.an('object')
                            expect(resultado.message).to.not.be.empty
                            expect(resultado.message).to.eq('Registro alterado com sucesso')

                            const idConsultaUsuario = idEditaUsuario

                            cy.consultaUsuario(idConsultaUsuario)
                                .then((response) => {
                                    expect(response.body.nome).not.to.eq(dadosUsuarioConsultado.nomeAtual)
                                    expect(response.body.email).to.eq(dadosUsuarioConsultado.emailAtual)
                                    expect(response.body.password).to.eq(dadosUsuarioConsultado.passwordAtual)
                                    expect(response.body.administrador).to.eq(dadosUsuarioConsultado.administradorAtual)
                                    expect(response.body._id).to.eq(dadosUsuarioConsultado.idAatual)

                                    cy.log(`Nome: ${response.body.nome}`)
                                    cy.log(`Email: ${response.body.email}`)
                                    cy.log(`Password: ${response.body.password}`)
                                    cy.log(`ID: ${response.body._id}`)
                                })
                        })
                })
        })

        it('Edita o campo email com sucesso', () => {

            // COMANDO PERSONALIZADO PARA LISTAR TODOS OS USUÁRIOS CADASTRADOS
            cy.listaTodosUsuarios()
                .then((response) => {
                    const resultado = response.body
                    const numFinal = resultado.quantidade
                    cy.log(`Atualmente existem cadastrados ${numFinal} usuários!`)

                    // CHAMA A FUNÇÃO QUE GERA UM NÚMERO ALEATÓRIO PASSANDO A QUANTIDADE DE USUÁRIOS COMO LIMITE
                    const numIdUsuario = geraNumeroAleatorio(numFinal)

                    // ARMAZENA OS DADOS DO USUÁRIO
                    const dadosUsuarioConsultado = {
                        nomeAtual: resultado.usuarios[numIdUsuario].nome,
                        emailAtual: resultado.usuarios[numIdUsuario].email,
                        passwordAtual: resultado.usuarios[numIdUsuario].password,
                        administradorAtual: resultado.usuarios[numIdUsuario].administrador,
                        idAatual: resultado.usuarios[numIdUsuario]._id
                    }

                    cy.log(`Nome do usuário consultado: ${dadosUsuarioConsultado.nomeAtual}`)
                    cy.log(`Email do usuário consultado: ${dadosUsuarioConsultado.emailAtual}`)
                    cy.log(`Password do usuário cadastrado: ${dadosUsuarioConsultado.passwordAtual}`)
                    cy.log(`ID do usuário consultado: ${dadosUsuarioConsultado.idAatual}`)

                    // ARMAZENA OS DADOS DO BODY PARA EDIÇÃO
                    let dadosBodyRequest = {
                        nome: resultado.usuarios[numIdUsuario].nome,
                        email: resultado.usuarios[numIdUsuario].email,
                        password: resultado.usuarios[numIdUsuario].password,
                        administrador: resultado.usuarios[numIdUsuario].administrador
                    }

                    const idEditaUsuario = dadosUsuarioConsultado.idAatual

                    // GERA E ARMAZENA OS DADOS DO NOVO USUÁRIO
                    const novoUsuario = gerarDadosUsuario()

                    dadosBodyRequest.email = novoUsuario.email

                    // COMANDO PERSONALIZADO PARA EDITAR UM USUÁRIO CADASTRADOS PELO SEU ID
                    cy.editaUsuario(idEditaUsuario, dadosBodyRequest)
                        .then((response) => {
                            expect(response.status).to.eq(200)
                            const resultado = response.body
                            expect(resultado).to.be.an('object')
                            expect(resultado.message).to.not.be.empty
                            expect(resultado.message).to.eq('Registro alterado com sucesso')

                            const idConsultaUsuario = idEditaUsuario

                            cy.consultaUsuario(idConsultaUsuario)
                                .then((response) => {
                                    expect(response.body.nome).to.eq(dadosUsuarioConsultado.nomeAtual)
                                    expect(response.body.email).not.to.eq(dadosUsuarioConsultado.emailAtual)
                                    expect(response.body.password).to.eq(dadosUsuarioConsultado.passwordAtual)
                                    expect(response.body.administrador).to.eq(dadosUsuarioConsultado.administradorAtual)
                                    expect(response.body._id).to.eq(dadosUsuarioConsultado.idAatual)

                                    cy.log(`Nome: ${response.body.nome}`)
                                    cy.log(`Email: ${response.body.email}`)
                                    cy.log(`Password: ${response.body.password}`)
                                    cy.log(`ID: ${response.body._id}`)
                                })
                        })
                })
        })

        it('Edita o campo password com sucesso', () => {

            // COMANDO PERSONALIZADO PARA LISTAR TODOS OS USUÁRIOS CADASTRADOS
            cy.listaTodosUsuarios()
                .then((response) => {
                    const resultado = response.body
                    const numFinal = resultado.quantidade
                    cy.log(`Atualmente existem cadastrados ${numFinal} usuários!`)

                    // CHAMA A FUNÇÃO QUE GERA UM NÚMERO ALEATÓRIO PASSANDO A QUANTIDADE DE USUÁRIOS COMO LIMITE
                    const numIdUsuario = geraNumeroAleatorio(numFinal)

                    // ARMAZENA OS DADOS DO USUÁRIO
                    const dadosUsuarioConsultado = {
                        nomeAtual: resultado.usuarios[numIdUsuario].nome,
                        emailAtual: resultado.usuarios[numIdUsuario].email,
                        passwordAtual: resultado.usuarios[numIdUsuario].password,
                        administradorAtual: resultado.usuarios[numIdUsuario].administrador,
                        idAatual: resultado.usuarios[numIdUsuario]._id
                    }

                    cy.log(`Nome do usuário consultado: ${dadosUsuarioConsultado.nomeAtual}`)
                    cy.log(`Email do usuário consultado: ${dadosUsuarioConsultado.emailAtual}`)
                    cy.log(`Password do usuário cadastrado: ${dadosUsuarioConsultado.passwordAtual}`)
                    cy.log(`ID do usuário consultado: ${dadosUsuarioConsultado.idAatual}`)

                    // ARMAZENA OS DADOS DO BODY PARA EDIÇÃO
                    let dadosBodyRequest = {
                        nome: resultado.usuarios[numIdUsuario].nome,
                        email: resultado.usuarios[numIdUsuario].email,
                        password: resultado.usuarios[numIdUsuario].password,
                        administrador: resultado.usuarios[numIdUsuario].administrador
                    }

                    const idEditaUsuario = dadosUsuarioConsultado.idAatual

                    // GERA E ARMAZENA OS DADOS DO NOVO USUÁRIO
                    const novoUsuario = gerarDadosUsuario()

                    dadosBodyRequest.password = novoUsuario.password

                    // COMANDO PERSONALIZADO PARA EDITAR UM USUÁRIO CADASTRADOS PELO SEU ID
                    cy.editaUsuario(idEditaUsuario, dadosBodyRequest)
                        .then((response) => {
                            expect(response.status).to.eq(200)
                            const resultado = response.body
                            expect(resultado).to.be.an('object')
                            expect(resultado.message).to.not.be.empty
                            expect(resultado.message).to.eq('Registro alterado com sucesso')

                            const idConsultaUsuario = idEditaUsuario

                            cy.consultaUsuario(idConsultaUsuario)
                                .then((response) => {
                                    expect(response.body.nome).to.eq(dadosUsuarioConsultado.nomeAtual)
                                    expect(response.body.email).to.eq(dadosUsuarioConsultado.emailAtual)
                                    expect(response.body.password).not.to.eq(dadosUsuarioConsultado.passwordAtual)
                                    expect(response.body.administrador).to.eq(dadosUsuarioConsultado.administradorAtual)
                                    expect(response.body._id).to.eq(dadosUsuarioConsultado.idAatual)

                                    cy.log(`Nome: ${response.body.nome}`)
                                    cy.log(`Email: ${response.body.email}`)
                                    cy.log(`Password: ${response.body.password}`)
                                    cy.log(`ID: ${response.body._id}`)
                                })
                        })
                })

        })

        it('Edita o campo administrador com sucesso', () => {

            // COMANDO PERSONALIZADO PARA LISTAR TODOS OS USUÁRIOS CADASTRADOS
            cy.listaTodosUsuarios()
                .then((response) => {
                    const resultado = response.body
                    const numFinal = resultado.quantidade
                    cy.log(`Atualmente existem cadastrados ${numFinal} usuários!`)

                    // CHAMA A FUNÇÃO QUE GERA UM NÚMERO ALEATÓRIO PASSANDO A QUANTIDADE DE USUÁRIOS COMO LIMITE
                    const numIdUsuario = geraNumeroAleatorio(numFinal)

                    // ARMAZENA OS DADOS DO USUÁRIO
                    const dadosUsuarioConsultado = {
                        nomeAtual: resultado.usuarios[numIdUsuario].nome,
                        emailAtual: resultado.usuarios[numIdUsuario].email,
                        passwordAtual: resultado.usuarios[numIdUsuario].password,
                        administradorAtual: resultado.usuarios[numIdUsuario].administrador,
                        idAatual: resultado.usuarios[numIdUsuario]._id
                    }

                    cy.log(`Nome do usuário consultado: ${dadosUsuarioConsultado.nomeAtual}`)
                    cy.log(`Email do usuário consultado: ${dadosUsuarioConsultado.emailAtual}`)
                    cy.log(`Password do usuário cadastrado: ${dadosUsuarioConsultado.passwordAtual}`)
                    cy.log(`Perfil do usuário: ${dadosUsuarioConsultado.administradorAtual}`)
                    cy.log(`ID do usuário consultado: ${dadosUsuarioConsultado.idAatual}`)

                    // ARMAZENA OS DADOS DO BODY PARA EDIÇÃO
                    let dadosBodyRequest = {
                        nome: resultado.usuarios[numIdUsuario].nome,
                        email: resultado.usuarios[numIdUsuario].email,
                        password: resultado.usuarios[numIdUsuario].password,
                        administrador: resultado.usuarios[numIdUsuario].administrador
                    }

                    const idEditaUsuario = dadosUsuarioConsultado.idAatual

                    // VALIDA PERFIL DO USUÁRIO E ALTERA
                    if (dadosUsuarioConsultado.administradorAtual === 'true') {
                        dadosBodyRequest.administrador = 'false'
                    } else {
                        dadosBodyRequest.administrador = true
                    }

                    // COMANDO PERSONALIZADO PARA EDITAR UM USUÁRIO CADASTRADOS PELO SEU ID
                    cy.editaUsuario(idEditaUsuario, dadosBodyRequest)
                        .then((response) => {
                            expect(response.status).to.eq(200)
                            const resultado = response.body
                            expect(resultado).to.be.an('object')
                            expect(resultado.message).to.not.be.empty
                            expect(resultado.message).to.eq('Registro alterado com sucesso')

                            const idConsultaUsuario = idEditaUsuario

                            cy.consultaUsuario(idConsultaUsuario)
                                .then((response) => {
                                    expect(response.body.nome).to.eq(dadosUsuarioConsultado.nomeAtual)
                                    expect(response.body.email).to.eq(dadosUsuarioConsultado.emailAtual)
                                    expect(response.body.password).to.eq(dadosUsuarioConsultado.passwordAtual)
                                    expect(response.body.administrador).not.to.eq(dadosUsuarioConsultado.administradorAtual)
                                    expect(response.body._id).to.eq(dadosUsuarioConsultado.idAatual)

                                    cy.log(`Nome: ${response.body.nome}`)
                                    cy.log(`Email: ${response.body.email}`)
                                    cy.log(`Password: ${response.body.password}`)
                                    cy.log(`Administrador: ${response.body.administrador}`)
                                    cy.log(`ID: ${response.body._id}`)
                                })
                        })
                })
        })

        it('Edita todos os campos com sucesso', () => {

            // COMANDO PERSONALIZADO PARA LISTAR TODOS OS USUÁRIOS CADASTRADOS
            cy.listaTodosUsuarios()
                .then((response) => {
                    const resultado = response.body
                    const numFinal = resultado.quantidade
                    cy.log(`Atualmente existem cadastrados ${numFinal} usuários!`)

                    // CHAMA A FUNÇÃO QUE GERA UM NÚMERO ALEATÓRIO PASSANDO A QUANTIDADE DE USUÁRIOS COMO LIMITE
                    const numIdUsuario = geraNumeroAleatorio(numFinal)
                    const idEditaUsuario = resultado.usuarios[numIdUsuario]._id

                    // ARMAZENA OS CAMPOS DO BODY NO ARRAY
                    const campos = ['nome', 'email', 'password', 'administrador']

                    // LAÇO DE REPETIÇÃO DE ACORDO COM O ARRAY
                    campos.forEach((campoVazio) => {

                        // ARMAZENA OS DADOS DO BODY PARA EDIÇÃO
                        let dadosBodyRequest = {
                            nome: resultado.usuarios[numIdUsuario].nome,
                            email: resultado.usuarios[numIdUsuario].email,
                            password: resultado.usuarios[numIdUsuario].password,
                            administrador: resultado.usuarios[numIdUsuario].administrador
                        }

                        // CAMPO DO ARRAY EXECUTADO RECEBE VAZIO
                        dadosBodyRequest[campoVazio] = ''

                        // COMANDO PERSONALIZADO PARA EDITAR UM USUÁRIO CADASTRADOS PELO SEU ID
                        cy.editaUsuario(idEditaUsuario, dadosBodyRequest)
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
        it('Edita o campo email com um email inválido', () => {

            // COMANDO PERSONALIZADO PARA LISTAR TODOS OS USUÁRIOS CADASTRADOS
            cy.listaTodosUsuarios()
                .then((response) => {
                    const resultado = response.body
                    const numFinal = resultado.quantidade
                    cy.log(`Atualmente existem cadastrados ${numFinal} usuários!`)

                    // CHAMA A FUNÇÃO QUE GERA UM NÚMERO ALEATÓRIO PASSANDO A QUANTIDADE DE USUÁRIOS COMO LIMITE
                    const numIdUsuario = geraNumeroAleatorio(numFinal)

                    // ARMAZENA OS DADOS DO USUÁRIO
                    const dadosUsuarioConsultado = {
                        nomeAtual: resultado.usuarios[numIdUsuario].nome,
                        emailAtual: resultado.usuarios[numIdUsuario].email,
                        passwordAtual: resultado.usuarios[numIdUsuario].password,
                        administradorAtual: resultado.usuarios[numIdUsuario].administrador,
                        idAatual: resultado.usuarios[numIdUsuario]._id
                    }

                    cy.log(`Nome do usuário consultado: ${dadosUsuarioConsultado.nomeAtual}`)
                    cy.log(`Email do usuário consultado: ${dadosUsuarioConsultado.emailAtual}`)
                    cy.log(`Password do usuário cadastrado: ${dadosUsuarioConsultado.passwordAtual}`)
                    cy.log(`ID do usuário consultado: ${dadosUsuarioConsultado.idAatual}`)

                    // ARMAZENA OS DADOS DO BODY PARA EDIÇÃO
                    let dadosBodyRequest = {
                        nome: resultado.usuarios[numIdUsuario].nome,
                        email: resultado.usuarios[numIdUsuario].email,
                        password: resultado.usuarios[numIdUsuario].password,
                        administrador: resultado.usuarios[numIdUsuario].administrador
                    }

                    dadosBodyRequest.email = 'teste.com.br'

                    const idEditaUsuario = dadosUsuarioConsultado.idAatual

                    // COMANDO PERSONALIZADO PARA EDITAR UM USUÁRIO CADASTRADOS PELO SEU ID
                    cy.editaUsuario(idEditaUsuario, dadosBodyRequest)
                        .then((response) => {
                            expect(response.status).to.eq(400)
                            const resultado = response.body
                            expect(resultado).to.be.an('object')
                            expect(resultado.email).to.not.be.empty
                            expect(resultado.email).to.eq('email deve ser um email válido')


                        })
                })
        })

        it('Edita o campo email com um email já cadastrado', () => {

            // COMANDO PERSONALIZADO PARA LISTAR TODOS OS USUÁRIOS CADASTRADOS
            cy.listaTodosUsuarios()
                .then((response) => {
                    const resultado = response.body
                    const numFinal = resultado.quantidade
                    cy.log(`Atualmente existem cadastrados ${numFinal} usuários!`)

                    // CHAMA A FUNÇÃO QUE GERA UM NÚMERO ALEATÓRIO PASSANDO A QUANTIDADE DE USUÁRIOS COMO LIMITE
                    const numIdUsuario = geraNumeroAleatorio(numFinal)

                    // ARMAZENA OS DADOS DO USUÁRIO
                    const dadosUsuarioConsultado = {
                        nomeAtual: resultado.usuarios[numIdUsuario].nome,
                        emailAtual: resultado.usuarios[numIdUsuario].email,
                        passwordAtual: resultado.usuarios[numIdUsuario].password,
                        administradorAtual: resultado.usuarios[numIdUsuario].administrador,
                        idAatual: resultado.usuarios[numIdUsuario]._id
                    }

                    cy.log(`Nome do usuário consultado: ${dadosUsuarioConsultado.nomeAtual}`)
                    cy.log(`Email do usuário consultado: ${dadosUsuarioConsultado.emailAtual}`)
                    cy.log(`Password do usuário cadastrado: ${dadosUsuarioConsultado.passwordAtual}`)
                    cy.log(`ID do usuário consultado: ${dadosUsuarioConsultado.idAatual}`)

                    // ARMAZENA OS DADOS DO BODY PARA EDIÇÃO
                    let dadosBodyRequest = {
                        nome: resultado.usuarios[numIdUsuario].nome,
                        email: resultado.usuarios[numIdUsuario].email,
                        password: resultado.usuarios[numIdUsuario].password,
                        administrador: resultado.usuarios[numIdUsuario].administrador
                    }

                    // COMANDO PERSONALIZADO PARA LISTAR TODOS OS USUÁRIOS CADASTRADOS
                    cy.listaTodosUsuarios()
                        .then((response) => {
                            const resultado = response.body
                            const numFinal = resultado.quantidade

                            // CHAMA A FUNÇÃO QUE GERA UM NÚMERO ALEATÓRIO PASSANDO A QUANTIDADE DE USUÁRIOS COMO LIMITE
                            const numIdUsuario = geraNumeroAleatorio(numFinal)

                            dadosBodyRequest.email = response.body.usuarios[numIdUsuario].email

                            cy.log(`Email para atualização: ${response.body.usuarios[numIdUsuario].email}`)

                            const idEditaUsuario = dadosUsuarioConsultado.idAatual

                            // COMANDO PERSONALIZADO PARA EDITAR UM USUÁRIO CADASTRADOS PELO SEU ID
                            cy.editaUsuario(idEditaUsuario, dadosBodyRequest)
                                .then((response) => {
                                    expect(response.status).to.eq(400)
                                    const resultado = response.body
                                    expect(resultado).to.be.an('object')
                                    expect(resultado.message).to.not.be.empty
                                    expect(resultado.message).to.eq('Este email já está sendo usado')


                                })
                        })
                })
        })

        it('Edita o campo com campo faltando', () => {

            // COMANDO PERSONALIZADO PARA LISTAR TODOS OS USUÁRIOS CADASTRADOS
            cy.listaTodosUsuarios()
                .then((response) => {
                    const resultado = response.body
                    const numFinal = resultado.quantidade
                    cy.log(`Atualmente existem cadastrados ${numFinal} usuários!`)

                    // CHAMA A FUNÇÃO QUE GERA UM NÚMERO ALEATÓRIO PASSANDO A QUANTIDADE DE USUÁRIOS COMO LIMITE
                    const numIdUsuario = geraNumeroAleatorio(numFinal)

                    // ARMAZENA OS DADOS DO USUÁRIO
                    const dadosUsuarioConsultado = {
                        nomeAtual: resultado.usuarios[numIdUsuario].nome,
                        emailAtual: resultado.usuarios[numIdUsuario].email,
                        passwordAtual: resultado.usuarios[numIdUsuario].password,
                        administradorAtual: resultado.usuarios[numIdUsuario].administrador,
                        idAatual: resultado.usuarios[numIdUsuario]._id
                    }

                    cy.log(`Nome do usuário consultado: ${dadosUsuarioConsultado.nomeAtual}`)
                    cy.log(`Email do usuário consultado: ${dadosUsuarioConsultado.emailAtual}`)
                    cy.log(`Password do usuário cadastrado: ${dadosUsuarioConsultado.passwordAtual}`)
                    cy.log(`ID do usuário consultado: ${dadosUsuarioConsultado.idAatual}`)

                    // ARMAZENA OS DADOS DO BODY PARA EDIÇÃO
                    let dadosBodyRequest = {
                        nome: resultado.usuarios[numIdUsuario].nome,
                        email: resultado.usuarios[numIdUsuario].email,
                        password: resultado.usuarios[numIdUsuario].password,
                        administrador: resultado.usuarios[numIdUsuario].administrador
                    }

                    // COMANDO PERSONALIZADO PARA LISTAR TODOS OS USUÁRIOS CADASTRADOS
                    cy.listaTodosUsuarios()
                        .then((response) => {
                            const resultado = response.body
                            const numFinal = resultado.quantidade

                            // CHAMA A FUNÇÃO QUE GERA UM NÚMERO ALEATÓRIO PASSANDO A QUANTIDADE DE USUÁRIOS COMO LIMITE
                            const numIdUsuario = geraNumeroAleatorio(numFinal)

                            dadosBodyRequest.email = response.body.usuarios[numIdUsuario].email

                            cy.log(`Email para atualização: ${response.body.usuarios[numIdUsuario].email}`)

                            const idEditaUsuario = dadosUsuarioConsultado.idAatual

                            // COMANDO PERSONALIZADO PARA EDITAR UM USUÁRIO CADASTRADOS PELO SEU ID
                            cy.editaUsuario(idEditaUsuario, dadosBodyRequest)
                                .then((response) => {
                                    expect(response.status).to.eq(400)
                                    const resultado = response.body
                                    expect(resultado).to.be.an('object')
                                    expect(resultado.message).to.not.be.empty
                                    expect(resultado.message).to.eq('Este email já está sendo usado')


                                })
                        })
                })
        })

    })

    context('exclusão de usuário', () => {
        it('Exclui um usuário com sucesso', () => {

            // COMANDO PERSONALIZADO PARA LISTAR TODOS OS USUÁRIOS CADASTRADOS
            cy.listaTodosUsuarios()
                .then((response) => {
                    const resultado = response.body
                    const numFinal = resultado.quantidade
                    cy.log(`Atualmente existem cadastrados ${numFinal} usuários!`)

                    // CHAMA A FUNÇÃO QUE GERA UM NÚMERO ALEATÓRIO PASSANDO A QUANTIDADE DE USUÁRIOS COMO LIMITE
                    const numIdUsuario = geraNumeroAleatorio(numFinal)

                    // ARMAZENA OS DADOS DO USUÁRIO
                    const dadosUsuarioConsultado = {
                        nome: resultado.usuarios[numIdUsuario].nome,
                        email: resultado.usuarios[numIdUsuario].email,
                        password: resultado.usuarios[numIdUsuario].password,
                        administrador: resultado.usuarios[numIdUsuario].administrador,
                        id: resultado.usuarios[numIdUsuario]._id
                    }

                    cy.log(`Nome do usuário consultado: ${dadosUsuarioConsultado.nome}`)
                    cy.log(`Email do usuário consultado: ${dadosUsuarioConsultado.email}`)
                    cy.log(`Password do usuário cadastrado: ${dadosUsuarioConsultado.password}`)
                    cy.log(`ID do usuário consultado: ${dadosUsuarioConsultado.id}`)

                    const idConsultaUsuario = dadosUsuarioConsultado.id
                    // COMANDO PERSONALIZADO PARA DELETAR UM USUÁRIO CADASTRADOS EM ESPECÍFICO PELO SEU ID
                    cy.deletaUsuario(idConsultaUsuario)
                        .then((response) => {
                            expect(response.status).to.eq(200)
                            const resultado = response.body
                            expect(resultado).to.be.an('object')
                            expect(resultado.message).to.not.be.empty
                            expect(resultado.message).to.eq('Registro excluído com sucesso')

                            // COMANDO PERSONALIZADO PARA LISTAR UM USUÁRIO CADASTRADOS EM ESPECÍFICO PELO SEU ID
                            cy.consultaUsuario(idConsultaUsuario)
                                .then((response) => {
                                    expect(response.status).to.eq(400)
                                    expect(response.body.message).to.eq('Usuário não encontrado')
                                    cy.log(`O usuário ${dadosUsuarioConsultado.nome} de ID ${dadosUsuarioConsultado.id} foi excluído e não consta mais em nossa base.`)
                                })
                        })
                })
        })

        it('Exclui um usuário já excluído', () => {

            // COMANDO PERSONALIZADO PARA LISTAR TODOS OS USUÁRIOS CADASTRADOS
            cy.listaTodosUsuarios()
                .then((response) => {
                    const resultado = response.body
                    const numFinal = resultado.quantidade
                    cy.log(`Atualmente existem cadastrados ${numFinal} usuários!`)

                    // CHAMA A FUNÇÃO QUE GERA UM NÚMERO ALEATÓRIO PASSANDO A QUANTIDADE DE USUÁRIOS COMO LIMITE
                    const numIdUsuario = geraNumeroAleatorio(numFinal)

                    // ARMAZENA OS DADOS DO USUÁRIO
                    const dadosUsuarioConsultado = {
                        nome: resultado.usuarios[numIdUsuario].nome,
                        email: resultado.usuarios[numIdUsuario].email,
                        password: resultado.usuarios[numIdUsuario].password,
                        administrador: resultado.usuarios[numIdUsuario].administrador,
                        id: resultado.usuarios[numIdUsuario]._id
                    }

                    cy.log(`Nome do usuário consultado: ${dadosUsuarioConsultado.nome}`)
                    cy.log(`Email do usuário consultado: ${dadosUsuarioConsultado.email}`)
                    cy.log(`Password do usuário cadastrado: ${dadosUsuarioConsultado.password}`)
                    cy.log(`ID do usuário consultado: ${dadosUsuarioConsultado.id}`)

                    const idConsultaUsuario = dadosUsuarioConsultado.id

                    // COMANDO PERSONALIZADO PARA DELETAR UM USUÁRIO CADASTRADOS EM ESPECÍFICO PELO SEU ID
                    cy.deletaUsuario(idConsultaUsuario)
                        .then((response) => {
                            expect(response.status).to.eq(200)
                            const resultado = response.body
                            expect(resultado).to.be.an('object')
                            expect(resultado.message).to.not.be.empty
                            expect(resultado.message).to.eq('Registro excluído com sucesso')

                            // COMANDO PERSONALIZADO PARA DELETAR UM USUÁRIO CADASTRADOS EM ESPECÍFICO PELO SEU ID
                            cy.deletaUsuario(idConsultaUsuario)
                                .then((response) => {
                                    expect(response.status).to.eq(200)
                                    const resultado = response.body
                                    expect(resultado).to.be.an('object')
                                    expect(resultado.message).to.not.be.empty
                                    expect(resultado.message).to.eq('Nenhum registro excluído')
                                })
                        })
                })
        })

        it('Exclui um usuário inexistente', () => {

            const idConsultaUsuario = '123456789'

            // COMANDO PERSONALIZADO PARA DELETAR UM USUÁRIO CADASTRADOS EM ESPECÍFICO PELO SEU ID
            cy.deletaUsuario(idConsultaUsuario)
                .then((response) => {
                    expect(response.status).to.eq(200)
                    const resultado = response.body
                    expect(resultado).to.be.an('object')
                    expect(resultado.message).to.not.be.empty
                    expect(resultado.message).to.eq('Nenhum registro excluído')
                })
        })

        it('Excluir um usuário que possui itens no carrinho', () => {

        })
    })
})