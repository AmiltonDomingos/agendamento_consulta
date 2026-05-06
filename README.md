# Clínica Sagrada Esperança — API

API RESTful para gestão de consultas da Clínica Sagrada Esperança, desenvolvida com **Bun.js**, **Elysia.js** e **PostgreSQL**.

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Runtime | Bun.js 1.3.6 |
| Framework | Elysia.js |
| Base de Dados | PostgreSQL |
| ORM | Drizzle ORM |
| Validação | TypeBox (nativo do Elysia) |
| Documentação | Swagger UI |

---

## Estrutura do Projeto

```
src/
├── index.ts                          # Entry point — Elysia app
├── db/
│   ├── index.ts                      # Conexão PostgreSQL + Drizzle
│   └── schema/
│       └── appointments.ts           # Schema da tabela appointments
├── routes/
│   ├── index.ts                      # Agregador de rotas (/api)
│   └── appointments.ts               # Rotas de compromissos (Elysia plugin)
├── controllers/
│   └── appointments.controller.ts    # Handlers de request/response
├── services/
│   └── appointments.service.ts       # Lógica de negócio + queries Drizzle
└── middleware/
    └── error-handler.ts              # HttpError class para erros tipados
```

**Arquitectura:** `routes → controllers → services`

---

## Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/healthz` | Health check |
| `GET` | `/api/docs` | Documentação Swagger UI |
| `GET` | `/api/appointments` | Listar compromissos (filtros: `date`, `service`, `status`) |
| `GET` | `/api/appointments/:id` | Obter compromisso por ID |
| `POST` | `/api/appointments` | Criar compromisso |
| `PUT` | `/api/appointments/:id` | Atualizar compromisso |
| `PATCH` | `/api/appointments/:id/cancel` | Cancelar compromisso (soft delete) |
| `DELETE` | `/api/appointments/:id` | Remover permanentemente |

### Serviços disponíveis

```
Pediatria | Consulta geral | Ortopedia | Outros
```

---

## Respostas de Erro

| Código | Situação |
|--------|----------|
| `400` | Dados inválidos / compromisso já cancelado |
| `404` | Compromisso não encontrado |
| `409` | Conflito de horário (mesma data e hora) |
| `500` | Erro interno do servidor |

---

## Instalação e Execução

### Pré-requisitos

- [Bun](https://bun.sh) >= 1.3.6
- PostgreSQL

### Variáveis de ambiente

```env
DATABASE_URL=postgresql://user:password@host:5432/database
PORT=8080
```

### Comandos

```bash
# Instalar dependências
bun install

# Iniciar em desenvolvimento (com hot reload)
bun run --watch src/index.ts

# Aplicar schema na base de dados
bunx drizzle-kit push

# Gerar migrations
bunx drizzle-kit generate
```

---

## Exemplo de Uso

### Criar compromisso

```bash
curl -X POST http://localhost:8080/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "clientName": "João Silva",
    "service": "Pediatria",
    "date": "2026-05-15",
    "time": "09:00"
  }'
```

### Listar compromissos por serviço

```bash
curl "http://localhost:8080/api/appointments?service=Pediatria"
```

### Cancelar compromisso

```bash
curl -X PATCH http://localhost:8080/api/appointments/{id}/cancel
```

---

## Decisões de Arquitectura

- **Elysia plugins** — cada domínio é um `new Elysia({ prefix })` reutilizável
- **HttpError class** — erros HTTP tipados lançados nos controllers e capturados centralmente pelo `onError`
- **Soft delete** — `PATCH /:id/cancel` preserva o histórico; `DELETE /:id` remove permanentemente
- **Detecção de conflitos** — verificada no service antes de criar/atualizar, retorna `409`
- **Sem build step** — Bun executa TypeScript nativamente

---

## Documentação Interativa

Após iniciar o servidor, acede ao Swagger UI em:

```
http://localhost:8080/api/docs
```

---

*Desenvolvido como projecto académico — Clínica Sagrada Esperança*
