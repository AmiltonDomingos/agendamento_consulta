/**
 * Classe de erro HTTP personalizada.
 * Lançada nos controllers e capturada pelo handler global do Elysia.
 */
export class HttpError extends Error {
  public readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}
