Cenário: Cadastro de produto com sucesso (administrador)
Given que sou administrador (administrador = true)
When envio requestBodyProduto válido
Then produto é cadastrado com sucesso (cadastroComSucesso)

Cenário: Cadastro de produto com nome duplicado
Given que já existe nomeProduto1
When tento cadastrar novamente
Then recebo erro (existeProdutoComEsseNome)

Cenário: Consultar lista de produtos
Given que tenho produtos cadastrados
When consulto getProdutos
Then recebo a lista de produtos

Cenário: Consultar produto por ID
Given que possuo _idProduto1
When consulto getProdutosId
Then recebo dados do produto correspondente

Cenário: Alteração de produto realizada com sucesso
Given que sou administrador
When altero um produto existente
Then recebo sucesso (alteradoComSucesso)

Cenário: Exclusão de produto vinculado a carrinho não permitida
Given que o produto faz parte de um carrinho ativo
When tento excluí-lo
Then recebo erro (naoPermitidoExcluirProdutoDeCarrinho)