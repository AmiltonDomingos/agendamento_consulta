import { Elysia } from "elysia";
import { appointmentsRoutes } from "./appointments";

/**
 * Agrupamento central de todas as rotas da API.
 * Prefixo base: /api
 */
export const routes = new Elysia({ prefix: "/api" }).use(appointmentsRoutes);
