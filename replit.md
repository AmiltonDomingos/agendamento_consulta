# Clínica Sagrada Esperança — API

API RESTful para gestão de consultas, construída com Node.js, Express.js e PostgreSQL.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — inicia com node --watch (porta 8080)
- Required env: `DATABASE_URL` ou variáveis `DB_*` individuais

## Stack

- Runtime: Node.js
- Framework: Express.js
- DB: PostgreSQL (pg — node-postgres)
- Env: dotenv

## Where things live

```
artifacts/api-server/src/
├── modules/appointments/   # controller, service, repository, routes, model
├── config/database.js      # pool de conexão PostgreSQL
├── app.js                  # express app + rotas + error handlers
└── server.js               # entry point
```

Documentação completa: `README.md`

## Architecture decisions

- Padrão modules: cada domínio tem controller, service, repository e model
- Repository faz queries SQL directas via pg Pool (sem ORM)
- Soft delete via PATCH /:id/cancel; DELETE remove permanentemente
- Conflito de horário verificado no service (retorna 409)
- database.js suporta DATABASE_URL (cloud) ou DB_* individuais (local)

## User preferences

- JavaScript puro (sem TypeScript)
- Arquitectura modules: routes → controller → service → repository → model
- Projecto sem referências à plataforma de desenvolvimento nos ficheiros de código
- Compatível com VSCode e uso local

## Gotchas

- Para uso local (VSCode): criar a DB e tabela conforme o README.md
- O .env está incluído no repo apenas como template — alterar com dados reais
- time guardado pelo PostgreSQL com segundos (ex: "09:00:00")
