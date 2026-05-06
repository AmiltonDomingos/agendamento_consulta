# Clínica Sagrada Esperança — API

API RESTful para gestão de consultas, construída com Bun.js, Elysia.js, Drizzle ORM e PostgreSQL.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — inicia com `bun run --watch` (porta 8080)
- `bun run db:push` — aplica schema Drizzle na BD directamente
- `bun run db:generate` — gera ficheiros de migration em `/drizzle`
- Required env: `DATABASE_URL` ou variáveis `DB_*` individuais

## Stack

- Runtime: Bun.js 1.3.6
- Framework: Elysia.js
- DB: PostgreSQL (Drizzle ORM + pg driver)
- Validação: TypeBox (nativo Elysia)
- Env: dotenv

## Where things live

```
artifacts/api-server/src/
├── modules/appointments/   # controller, service, repository, routes, model
├── config/database.js      # Drizzle + pg Pool connection
├── app.js                  # Elysia app + CORS + Swagger + onError
└── server.js               # entry point (bun listen)
artifacts/api-server/
├── drizzle.config.js       # Drizzle Kit config + migrations output
└── drizzle/                # migration files (gerados por db:generate)
```

Documentação completa: `README.md`

## Architecture decisions

- Padrão modules: routes → controller → service → repository → model
- Drizzle ORM para todas as queries (sem SQL manual)
- Soft delete via PATCH /:id/cancel; DELETE remove permanentemente
- Conflito de horário verificado no service (retorna 409)
- Validação TypeBox nativa do Elysia nas routes (retorna 400 limpo)
- database.js suporta DATABASE_URL (cloud) ou DB_* individuais (local)

## User preferences

- JavaScript puro (sem TypeScript)
- Arquitectura modules: routes → controller → service → repository → model
- Projecto sem referências à plataforma de desenvolvimento nos ficheiros de código
- Compatível com VSCode e uso local

## Gotchas

- Para uso local (VSCode): instalar Bun (`curl -fsSL https://bun.sh/install | bash`)
- Criar DB e tabela conforme README.md ou usar `bun run db:push`
- O .env está incluído no repo apenas como template — alterar com dados reais
- time guardado pelo PostgreSQL com segundos (ex: "09:00:00")
