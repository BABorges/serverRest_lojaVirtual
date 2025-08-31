Cenário: Login realizado com sucesso
Given que tenho email e password válidos
When faço login com requestBodyLogin
Then recebo token e status de sucesso (loginComSucesso)

Cenário: Login com email inválido
Given que informo credenciais incorretas (email inválido, password)
When tento logar
Then recebo erro de credenciais (errorEmailPasswordInvalidos)

Cenário: Login com password inválido
Given que informo credenciais incorretas (email, password inválida)
When tento logar
Then recebo erro de credenciais (errorEmailPasswordInvalidos)

Cenário: Login sem email
Given que não informo o email (password)
When tento logar
Then recebo erro de credenciais (errorEmailEmBranco)

Cenário: Login com password inválido
Given que não informo o password (email, password inválida)
When tento logar
Then recebo erro de credenciais (errorPasswordEmBranco)