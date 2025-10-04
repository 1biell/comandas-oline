# 🍣 Sistema de Comanda Online

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)
![npm](https://img.shields.io/badge/npm-CB3837?style=flat&logo=npm&logoColor=white)

Sistema de pedidos online desenvolvido para restaurantes, substituindo o uso de papel e evitando confusões com pedidos errados ou quantidades incorretas.

---

## 🛠 Tecnologias Utilizadas

- **Frontend:** React.js, HTML, CSS  
- **Backend:** Node.js, Express  
- **Banco de Dados:** PostgreSQL  
- **Gerenciamento de Pacotes:** npm  
- **Hospedagem do Banco:** Render  

---

## ⚡ Funcionalidades

### 🧑‍🍳 Menu do Garçom
- Adicionar múltiplos itens em um único pedido (ex: Temaki, Hosomaki, Sashimi).  
- Editar quantidade de cada item antes de enviar.  
- Enviar pedidos para a cozinha.  
- Visualizar pedidos recentes primeiro.  
- Paginação de pedidos (5 por página).

### 🍳 Menu da Cozinha
- Visualizar pedidos recebidos.  
- Alterar status do pedido: **Pendente → Em Preparo → Concluído**.  
- Destaque visual por status (cores diferentes).  
- Paginação de pedidos (5 por página).

### 📜 Histórico de Pedidos
- Consultar pedidos já concluídos.  
- Visualização de mesa, itens e horário.  
- Paginação de pedidos (3 por página).

---

## 📦 Estrutura do Projeto

Sushi-Pedidos/
├─ backend/
│ ├─ controllers/
│ ├─ models/
│ ├─ routes/
│ ├─ .env # Contém variáveis sensíveis do banco de dados
│ └─ server.js
├─ frontend/
│ ├─ src/
│ └─ package.json
├─ .gitignore
└─ README.md

---

## ⚙️ Configuração do Backend e Front End

```bash

- ⚙️ Configuração do Backend

1. Instalar dependências:

cd backend
npm install

2. Criar arquivo .env com suas credenciais:
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_HOST=host_do_banco
DB_NAME=nome_do_banco
DB_PORT=5432

3. Rodar o servidor:
node server.js

- ⚙️ Configuração do Frontend

1. Instalar dependências:

cd frontend
npm install

2. Rodar o frontend:
npm run dev

🔒 Segurança

Credenciais do banco de dados estão protegidas pelo .env e não devem ser versionadas.

O .gitignore já exclui o arquivo .env do Git.

📌 Observações

Todos os horários dos pedidos são exibidos no fuso horário America/Sao_Paulo.

Os pedidos mais recentes sempre aparecem primeiro.

Sistema pronto para uso em qualquer restaurante que queira substituir papel por comanda online.