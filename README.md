# Clínica Sagrada Esperança — API

API RESTful para gestão de consultas da Clínica Sagrada Esperança, desenvolvida com **Node.js**, **Express.js** e **PostgreSQL**.

---

## Estrutura do Projeto

```
backend/
│
├── src/
│   ├── modules/
│   │   └── appointments/
│   │       ├── appointment.controller.js
│   │       ├── appointment.service.js
│   │       ├── appointment.repository.js
│   │       ├── appointment.routes.js
│   │       └── appointment.model.js
│
│   ├── config/
│   │   └── database.js
│
│   ├── app.js
│   └── server.js
│
├── package.json
└── .env
```

**Arquitectura:** `routes → controller → service → repository → model`

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Runtime | Node.js |
| Framework | Express.js |
| Base de Dados | PostgreSQL |
| Driver BD | pg (node-postgres) |
| Variáveis de ambiente | dotenv |

---

## Configuração local (VSCode)

### 1. Clonar o repositório

```bash
git clone https://github.com/AmiltonDomingos/agendamento_consulta.git
cd agendamento_consulta/artifacts/api-server
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Criar a base de dados PostgreSQL

Abre o teu cliente PostgreSQL (psql, pgAdmin, DBeaver, etc.) e executa:

```sql
CREATE DATABASE clinica_sagrada_esperanca;

\c clinica_sagrada_esperanca

CREATE TABLE appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  service TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
```

### 4. Configurar o ficheiro `.env`

Edita o ficheiro `.env` com os dados do teu PostgreSQL local:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=clinica_sagrada_esperanca
```

### 5. Iniciar o servidor

```bash
# Desenvolvimento (com hot reload)
npm run dev

# Produção
npm start
```

O servidor inicia em: `http://localhost:3000`

---

## Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/healthz` | Health check |
| `GET` | `/api/appointments` | Listar compromissos |
| `GET` | `/api/appointments/:id` | Obter por ID |
| `POST` | `/api/appointments` | Criar compromisso |
| `PUT` | `/api/appointments/:id` | Atualizar compromisso |
| `PATCH` | `/api/appointments/:id/cancel` | Cancelar (soft delete) |
| `DELETE` | `/api/appointments/:id` | Remover permanentemente |

### Filtros disponíveis (GET /api/appointments)

```
?date=2026-05-20
?service=Pediatria
?status=scheduled
```

### Serviços disponíveis

```
Pediatria | Consulta geral | Ortopedia | Outros
```

---

## Exemplos de Uso

### Criar compromisso

```bash
curl -X POST http://localhost:3000/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "clientName": "João Silva",
    "service": "Pediatria",
    "date": "2026-05-20",
    "time": "09:00"
  }'
```

### Listar por serviço

```bash
curl "http://localhost:3000/api/appointments?service=Pediatria"
```

### Cancelar compromisso

```bash
curl -X PATCH http://localhost:3000/api/appointments/{id}/cancel
```

---

## Respostas de Erro

| Código | Situação |
|--------|----------|
| `400` | Dados inválidos |
| `404` | Compromisso não encontrado |
| `409` | Conflito de horário |
| `500` | Erro interno do servidor |

---

*Desenvolvido como projecto académico — Clínica Sagrada Esperança*
