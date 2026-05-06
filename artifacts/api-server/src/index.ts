import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { routes } from "./routes";
import { HttpError } from "./middleware/error-handler";

const PORT = Number(process.env.PORT) || 8080;

/**
 * Aplicação principal — Clínica Sagrada Esperança API
 *
 * Stack: Bun.js + Elysia.js + PostgreSQL + Drizzle ORM
 * Arquitetura: routes → controllers → services
 */
const app = new Elysia()
  .use(cors())
  .use(
    swagger({
      documentation: {
        info: {
          title: "Clínica Sagrada Esperança — API",
          version: "1.0.0",
          description:
            "API RESTful para gestão de consultas da Clínica Sagrada Esperança. " +
            "Desenvolvida com Bun.js, Elysia.js e PostgreSQL (Drizzle ORM).",
          contact: {
            name: "Clínica Sagrada Esperança",
          },
        },
        tags: [
          {
            name: "Compromissos",
            description: "Operações CRUD para gestão de consultas agendadas",
          },
          {
            name: "Sistema",
            description: "Endpoints de sistema e monitorização",
          },
        ],
      },
      path: "/api/docs",
    }),
  )
  .onError(({ error, set }) => {
    if (error instanceof HttpError) {
      set.status = error.status;
      return {
        error: error.message,
        statusCode: error.status,
      };
    }

    if (error.message?.includes("validation")) {
      set.status = 400;
      return {
        error: "Dados inválidos. Verifique os campos enviados.",
        statusCode: 400,
        details: error.message,
      };
    }

    console.error("[ERRO INTERNO]", error);
    set.status = 500;
    return {
      error: "Erro interno do servidor. Tente novamente mais tarde.",
      statusCode: 500,
    };
  })
  .get(
    "/api/healthz",
    () => ({
      status: "ok",
      service: "Clínica Sagrada Esperança API",
      timestamp: new Date().toISOString(),
      runtime: "Bun " + Bun.version,
    }),
    {
      detail: {
        summary: "Health check",
        description: "Verifica se o servidor está em execução.",
        tags: ["Sistema"],
      },
    },
  )
  .use(routes)
  .listen(PORT);

console.log(`✅ Clínica Sagrada Esperança API iniciada na porta ${PORT}`);
console.log(`📋 Documentação disponível em: /api/docs`);
console.log(`🏥 Health check: /api/healthz`);

export type App = typeof app;
