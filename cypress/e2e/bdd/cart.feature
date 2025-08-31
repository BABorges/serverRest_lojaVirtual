Cenário: Criação de carrinho com sucesso
Given que tenho um arrayProduto válido
When envio requestBodyCarrinho
Then carrinho é criado com sucesso (cadastroComSucesso)

Cenário: Consultar lista de carrinhos
Given que tenho carrinhos cadastrados
When consulto getCarrinhos
Then retorno a lista de carrinhos

Cenário: Consultar carrinho por ID
Given que possuo getCarrinhosId
When faço consulta
Then recebo dados do carrinho específico