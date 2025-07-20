/* eslint-disable no-unused-vars */
import { RouteLocationNormalized } from "vue-router";

export { isAuthenticated } from "./isAuthenticated";

export function combineMiddlewares(
  // eslint-disable-next-line no-unused-vars
  ...middlewares: Array<
    (to: RouteLocationNormalized, from: RouteLocationNormalized, next: (override?: string | false) => void) => void
  >
) {
  return (to: RouteLocationNormalized, from: RouteLocationNormalized, next: (override?: string | false) => void) => {
    let index = 0;

    function nextMiddleware(override?: string | false) {
      // Se `override` for uma string, significa redirecionar
      if (typeof override === "string") {
        next(override);
        return;
      }

      // Se `override` for `false`, interrompe a execução
      if (override === false) {
        return;
      }

      if (index < middlewares.length) {
        const middleware = middlewares[index];
        index++;
        middleware(to, from, nextMiddleware);
      } else {
        // Chamado no final da cadeia de middlewares
        next();
      }
    }

    nextMiddleware();
  };
}
