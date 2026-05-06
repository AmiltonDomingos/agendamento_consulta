# Clínica Sagrada Esperança — API

API RESTful para gestão de consultas da Clínica Sagrada Esperança, desenvolvida com **Bun.js**, **Elysia.js**, **Drizzle ORM** e **PostgreSQL**.

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
├── drizzle.config.js
├── package.json
└── .env
```

**Arquitectura:** `routes → controller → service → repository → model`

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Runtime | Bun.js |
| Framework | Elysia.js |
| Base de Dados | PostgreSQL |
| ORM | Drizzle ORM |
| Validação | TypeBox (nativo Elysia) |
| Variáveis de ambiente | dotenv |

---

## Configuração local (VSCode)

### 1. Instalar o Bun.js

```bash
curl -fsSL https://bun.sh/install | bash
```

### 2. Clonar o repositório

```bash
git clone https://github.com/AmiltonDomingos/agendamento_consulta.git
cd agendamento_consulta/artifacts/api-server
```

### 3. Instalar dependências

```bash
bun install
```

### 4. Criar a base de dados PostgreSQL

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

> Ou usa o Drizzle para criar a tabela automaticamente (ver abaixo).

### 5. Configurar o ficheiro `.env`

Edita o ficheiro `.env` com os dados do teu PostgreSQL local:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=clinica_sagrada_esperanca
```

### 6. Migrations com Drizzle ORM (opcional)

```bash
# Aplica o schema directamente na BD (sem ficheiros de migration)
bun run db:push

# Gera ficheiros de migration em /drizzle
bun run db:generate
```

### 7. Iniciar o servidor

```bash
# Desenvolvimento (com hot reload)
bun run dev

# Produção
bun run start
```

O servidor inicia em: `http://localhost:3000`

Documentação Swagger: `http://localhost:3000/api/docs`

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
| `400` | Dados inválidos (validação TypeBox) |
| `404` | Compromisso não encontrado |
| `409` | Conflito de horário |
| `500` | Erro interno do servidor |

---

*Desenvolvido como projecto académico — Clínica Sagrada Esperança*
