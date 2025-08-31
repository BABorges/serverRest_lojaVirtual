Cenário: Cadastro de usuário com sucesso
Given que envio um requestBodyUsuarios válido
When realizo o cadastro
Then o usuário é criado com sucesso (cadastroComSucesso)

Cenário: Cadastro de usuário com e-mail já existente
Given que já existe um usuário com o mesmo emailFulano
When tento cadastrar novamente
Then recebo erro de e-mail já utilizado (errorEmailJaUtilizado)

Cenário: Consultar lista de usuários
Given que existem usuários cadastrados
When consulto getUsuarios
Then retorno a lista de usuários

Cenário: Consultar usuário por ID
Given que tenho um _idUsuario válido
When consulto getUsuariosId
Then retorno os dados do usuário correspondente

Cenário: Exclusão de usuário com carrinho ativo não permitida
Given que um usuário possui carrinho ativo
When tento excluí-lo
Then recebo erro (naoPermitidoExcluirUsuarioComCarrinho)