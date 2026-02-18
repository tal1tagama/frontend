# Frontend React + Backend Node.js

Este projeto é um **frontend em React** integrado ao backend em **Node.js + Express + MongoDB**.  
Ele implementa autenticação JWT, rotas privadas e funcionalidades como Login, Registro, Dashboard, Upload de Arquivos e Perfil de Usuário.

---

## 🚀 Funcionalidades
- **Login**: autenticação via JWT (`/api/auth/login`)
- **Registro**: criação de novos usuários (`/api/auth/register`)
- **Dashboard**: listagem de medições do usuário (`/api/measurements/minhas`)
- **Upload**: envio de arquivos para o servidor (`/api/files/upload`)
- **Perfil**: exibição dos dados do usuário logado (`/api/auth/me`)
- **Logout**: remoção do token e redirecionamento para Login
- **Rotas privadas**: proteção de páginas que exigem autenticação

---

## 📂 Estrutura do projeto

frontend-app/
src/
api/          → configuração do Axios
components/   → Navbar, PrivateRoute
pages/        → Login, Register, Dashboard, Upload, Profile
App.jsx
App.css
index.js


---

## 🛠️ Pré-requisitos
- Node.js (>= 18)
- npm (>= 9)
- Backend rodando em `http://localhost:5000/api`

---

## ⚙️ Como rodar o projeto

### 1. Clonar o repositório
```bash
git clone https://github.com/seuusuario/frontend-app.git
cd frontend-app
npm install
npm start


cd backend
npm install
npm run dev

🔗 Integração
O frontend consome diretamente os endpoints do backend:

POST /api/auth/login

POST /api/auth/register

GET /api/auth/me

GET /api/measurements/minhas

POST /api/files/upload