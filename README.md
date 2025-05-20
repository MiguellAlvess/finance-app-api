# Finance App API

API desenvolvida para o controle de finanças pessoais. Ela permite o gerenciamento de ganhos, gastos e investimentos, além do cálculo de saldo e organização financeira dos usuários.

## Tecnologias

- **Node.js** & Express.js – backend e rotas
- **PostgreSQL** – banco de dados relacional
- **Prisma ORM** – ORM para integração com o banco de dados
- **Docker** – containerização da aplicação
- **Zod** – validação de dados
- **JWT (JSON Web Token)** – autenticação com access e refresh tokens
- **Jest & Supertest** – testes automatizados
- **Swagger** – documentação interativa da API
- **GitHub Actions** – integração e entrega contínua (CI/CD)
- **Render** – deploy automático com Webhook a partir da branch master
- **ESLint & Prettier** – padronização e formatação de código
- **Husky & lint-staged** – gatilhos de pré-commit para garantir qualidade de código

## Rodando o projeto

O primeiro passo é subir o PostgresSQL rodando `docker-compose up -d` na pasta raíz do projeto.

```bash

# Instale as dependências
npm install

# Rode a aplicação
npm start
```

## Autenticação

A autenticação é baseada em **JWT**.

**Access Token**: token de curta duração enviado no cabeçalho da requisição HTTP Authorization no formato Bearer <token>. Usado para autenticar e autorizar o acesso às rotas protegidas.

**Refresh Token**: token de longa duração utilizado para obter um novo Access Token quando este expira, garantindo uma experiência de uso contínua sem necessidade de novo login.

## Deploy

A aplicação está configurada com pipeline de **CI/CD** para garantir deploys automáticos e seguros a cada atualização no repositório. O deploy está hospedado na plataforma **Render**, que gerencia a infraestrutura e mantém a aplicação disponível online 24/7.

## Testes automatizados

A aplicação conta tanto com **testes de integração** quanto com **testes e2e**, testando as principais funcionalidades do sistema e alcançando uma cobertura de mais de **90%**.

Para rodar, basta utilizar o comando `npm run test`

![Image](https://github.com/user-attachments/assets/c8803d81-5e50-405f-b82b-69c8d38eb3e2)

## Documentação com Swagger

A documentação completa da API pode ser acessada em `http://localhost:8080/docs`

![Image](https://github.com/user-attachments/assets/1fa8e228-a376-4a54-8fd4-1aee65fabb78)

![Image](https://github.com/user-attachments/assets/5e5f5fef-ddd6-4c56-beb3-a9e0cc4569a5)
