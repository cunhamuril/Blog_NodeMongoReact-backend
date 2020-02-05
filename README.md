# Blog - Backend

Backend de um exemplo de blog onde o público tem acesso restrito apenas as postagens e categorias publicadas pelo administradores.

# 💻 Funcionalidades
#### Público
- Visualizar e pesquisar todas postagens e categorias
- Ler postagem
- Criar usuário administrador
#### Administração
- Visualizar e pesquisar todas postagens e categorias
- Criar, editar e apagar postagens e categorias
- Editar informações de usuário

# 🚀 Tecnologias utilizadas
- [NodeJS](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [JWT](https://jwt.io/)
- [MongoDB](https://www.mongodb.com/)

# 📝 Licença
Esse projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE.md) para mais detalhes.

# 🔗 REST endpoints
## Público
##### /posts/search?value=<nome da postagem>
- **Função**: Pesquisar postagem pelo nome
- **Método**: `GET`
- **Requisição**: Param

##### /categories/<slug-da-categoria>?page=1
- **Função**: Pesquisar postagens pela categoria, informando a página que por padrão é 1
- **Método**: `GET`
- **Requisição**: Param

##### /admin/categories?page=1
- **Função**: Listar categorias por página que por padrão é 1
- **Método**: `GET`

##### /admin/categories/all
- **Função**: Listar todas as categorias
- **Método**: `GET`

##### /admin/posts?page=1
- **Função**: Listar postagens por página que por padrão é 1
- **Método**: `GET`

##### /posts/<slug-da-postagem>
- **Função**: Visualizar uma postagem
- **Método**: `GET`

## Administração
- **Header**: `Authorization: Bearer <token>`
### Categorias
##### /admin/categories/<id>
- **Função**: Buscar apenas uma categoria
- **Método**: `GET`

##### /admin/categories
- **Função**: Criar categoria
- **Método**: `POST`
- **Requisição**: Body
- **Corpo da requisição**: 
~~~
{
	"name": "React Native",
	"slug": "react-native"
}
~~~

##### /admin/categories/<id>
- **Função**: Editar categoria
- **Método**: `PUT`
- **Requisição**: Body
- **Corpo da requisição**: 
~~~
{
	"name": "React Native",
	"slug": "react-native"
}
~~~

##### /admin/categories/<id>
- **Função**: Excluir categoria
- **Método**: `DELETE`
- **Restrição**: Categoria não poderá ser excluída se tiver uma postagem registrada nela.

### Postagens
##### /admin/posts/<id>
- **Função**: Buscar apenas uma postagem
- **Método**: `GET`

##### /admin/posts
- **Função**: Criar postagem
- **Método**: `POST`
- **Requisição**: Multipart Form
- **Corpo da requisição**: 
~~~
title: REST API com NodeJS e Express
slug: rest-api-com-nodejs-e-express
description: Aprenda a desenvolver uma REST API com NodeJS e Express
content: <conteúdo>
category: <id da categoria>
thumbnail: <arquivo de imagem>
~~~

##### /admin/posts/<id>
- **Função**: Editar postagem
- **Método**: `PATCH`
- **Requisição**: Multipart Form
- **Corpo da requisição**: 
~~~
title: REST API com NodeJS e Express
slug: rest-api-com-nodejs-e-express
description: Aprenda a desenvolver uma REST API com NodeJS e Express
content: <conteúdo>
category: <id da categoria>
thumbnail: <arquivo de imagem>
~~~

##### /admin/posts/<id>
- **Função**: Excluir postagem
- **Método**: `DELETE`

### Usuários
##### /admin/users/<id>
- **Função**: Buscar apenas um usuário
- **Método**: `GET`

##### /admin/users
- **Função**: Criar usuário
- **Método**: `POST`
- **Requisição**: Body
- **Corpo da requisição**: 
~~~
{
	"name": "test",
	"username": "test",
	"email": "test@test.com",
	"password": "1234",
	"confirmPassword": "1234"
}
~~~

##### /admin/users/<id>
- **Função**: Editar usuário
- **Método**: `PATCH`
- **Requisição**: Body
- **Corpo da requisição**: 
~~~
{
	"name": "test",
	"username": "test",
	"email": "test@test.com",
	"password": "1234",
	"confirmPassword": "1234"
}
~~~

##### /admin/users/<id>
- **Função**: Excluir usuário
- **Método**: `DELETE`
- **Requisição**: Body
- **Corpo da requisição**: 
~~~
{
	"password": "<senha>"
}
~~~

### Autenticação
##### /admin/signin
- **Função**: Realizar login para gerar token de autenticação
- **Método**: `POST`
- **Requisição**: Body
- **Corpo da requisição**: 
~~~
{	
	"username": "test",
	"password": "1234"
}
~~~

##### /admin/verifytoken
- **Função**: Verificar se o token é válido
- **Método**: `POST`
- **Requisição**: Header

# 👨‍💻 Desenvolvimento
- Copiar tudo do arquivo `env_file.txt`, criar e colar tudo no arquivo arquivo `.env`.

- Executar `yarn` para instalar todas as dependências, depois executar `yarn start`. O servidor de desenvolvimento deverá iniciar em `https://localhost:3333`.