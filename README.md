Como executar o projeto

Instale as dependências:

npm install

Inicie o servidor:

npm run dev

A API ficará disponível em:

http://localhost:3000
Banco de Dados

Antes de iniciar a aplicação, execute o script SQL disponibilizado no projeto para criar as tabelas e inserir os dados de teste.

Verifique também se as credenciais do MySQL estão configuradas corretamente no arquivo de conexão.

Requisições de Teste

Os exemplos de requisição estão na pasta:

requisicoes/

Arquivos disponíveis:

get.rest
post.rest
put.rest
patch.rest
delete.rest
Utilizando REST Client

Caso utilize o VS Code, instale a extensão:

REST Client

Abra qualquer arquivo .rest e clique em Send Request para executar a requisição.

Utilizando Postman ou Insomnia

Os exemplos contidos nos arquivos .rest também podem ser copiados diretamente para o Postman ou Insomnia.

Endpoints
POST
POST /cadastrar_clientes
POST /cadastro_produto_v2
POST /cadastro_multiplos_produtos
PUT
PUT /produtos/:id
PUT /produto/:id
PUT /produto_preco/:id
PUT /produto_completo/:id
PATCH
PATCH /pessoa/:id
PATCH /produto/:id
PATCH /produto_categoria
PATCH /produto_desconto/:id
DELETE
DELETE /produto/:id
DELETE /pessoa/:id
DELETE /produto_categoria/:categoria