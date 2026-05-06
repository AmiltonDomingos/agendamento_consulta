# Clínica Sagrada Esperança — API

API RESTful para gestão de consultas da Clínica Sagrada Esperança, construída com Bun.js, Elysia.js e PostgreSQL.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — inicia a API com Bun (porta 8080)
- `pnpm --filter @workspace/api-server run db:push` — aplica o schema no PostgreSQL
- `pnpm --filter @workspace/api-server run db:generate` — gera migrations com Drizzle Kit
- `pnpm run typecheck` — typecheck completo de todos os packages
- Required env: `DATABASE_URL` — PostgreSQL connection string

## Stack

- Runtime: Bun.js 1.3.6
- Framework: Elysia.js (com @elysiajs/cors e @elysiajs/swagger)
- DB: PostgreSQL + Drizzle ORM (drizzle-orm/node-postgres)
- Validação: TypeBox nativo do Elysia (t.Object, t.Union, t.Literal)
- Documentação: Swagger UI em /api/docs

## Where things live

```
artifacts/api-server/
├── src/
│   ├── index.ts                         # Entry point — Elysia app
│   ├── db/
│   │   ├── index.ts                     # Conexão PostgreSQL + Drizzle
│   │   └── schema/
│   │       └── appointments.ts          # Schema da tabela appointments
│   ├── routes/
│   │   ├── index.ts                     # Agregador de rotas (/api)
│   │   └── appointments.ts             # Rotas de compromissos (Elysia plugin)
│   ├── controllers/
│   │   └── appointments.controller.ts  # Handlers de request/response
│   ├── services/
│   │   └── appointments.service.ts     # Lógica de negócio + queries Drizzle
│   └── middleware/
│       └── error-handler.ts            # HttpError class para erros tipados
└── drizzle.config.ts                    # Config do Drizzle Kit
```

## Architecture decisions

- **Elysia plugins** — cada domínio é um `new Elysia({ prefix })` reutilizável, montado em `src/routes/index.ts`
- **HttpError class** — permite lançar erros HTTP tipados nos controllers, capturados centralmente pelo `onError` do Elysia
- **Soft delete** — cancelamento via `PATCH /:id/cancel` preserva o histórico; `DELETE /:id` remove permanentemente
- **Conflito de horário** — verificado no service antes de criar/atualizar, retorna 409 com mensagem clara
- **Sem build step** — Bun executa TypeScript nativamente; sem esbuild ou compilação intermédia

## Product

- `GET /api/appointments` — listar compromissos (filtros: date, service, status)
- `GET /api/appointments/:id` — obter por ID
- `POST /api/appointments` — criar compromisso (valida campos, deteta conflito)
- `PUT /api/appointments/:id` — atualizar compromisso
- `PATCH /api/appointments/:id/cancel` — cancelar (soft delete)
- `DELETE /api/appointments/:id` — remover permanentemente
- `GET /api/healthz` — health check com versão do Bun
- `GET /api/docs` — Swagger UI com documentação interativa

## User preferences

- Backend apenas (sem frontend)
- Arquitetura limpa: routes → controllers → services
- Projeto deve parecer desenvolvido em VS Code (sem referências a Replit nos ficheiros)

## Gotchas

- Bun executa TypeScript directamente; não há `dist/` em desenvolvimento
- O drizzle.config.ts lê DATABASE_URL do ambiente — correr `db:push` após alterações ao schema
- `time` guardado pelo PostgreSQL com segundos (ex: "09:00:00") mesmo que enviado como "09:00"

## Pointers

- Swagger UI: http://localhost/api/docs
- Health check: http://localhost/api/healthz
