# Clínica Sagrada Esperança — API

API RESTful para gestão de consultas, construída com Bun.js, Elysia.js e PostgreSQL.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — inicia a API com Bun (porta 8080)
- `pnpm --filter @workspace/api-server run db:push` — aplica o schema no PostgreSQL
- `pnpm --filter @workspace/api-server run db:generate` — gera migrations com Drizzle Kit
- Required env: `DATABASE_URL` — PostgreSQL connection string

## Stack

- Runtime: Bun.js 1.3.6
- Framework: Elysia.js + @elysiajs/cors + @elysiajs/swagger
- DB: PostgreSQL + Drizzle ORM (drizzle-orm/node-postgres)
- Validação: TypeBox nativo do Elysia

## Where things live

- Entry point: `artifacts/api-server/src/index.ts`
- Schema: `artifacts/api-server/src/db/schema/appointments.ts`
- Rotas: `artifacts/api-server/src/routes/`
- Controllers: `artifacts/api-server/src/controllers/`
- Services: `artifacts/api-server/src/services/`
- Drizzle config: `artifacts/api-server/drizzle.config.ts`
- Documentação completa: `README.md`

## Architecture decisions

- Elysia plugins por domínio com prefixo próprio
- HttpError class para erros tipados capturados pelo onError central
- Soft delete via PATCH /:id/cancel; DELETE remove permanentemente
- Conflito de horário verificado no service (retorna 409)
- Sem build step — Bun executa TypeScript nativamente

## User preferences

- Backend apenas (sem frontend)
- Arquitetura limpa: routes → controllers → services
- Projecto sem referências à plataforma de desenvolvimento nos ficheiros de código

## Gotchas

- Bun executa TypeScript directamente; não há dist/ em desenvolvimento
- O drizzle.config.ts lê DATABASE_URL do ambiente — correr db:push após alterações ao schema
- time guardado pelo PostgreSQL com segundos (ex: "09:00:00") mesmo que enviado como "09:00"
