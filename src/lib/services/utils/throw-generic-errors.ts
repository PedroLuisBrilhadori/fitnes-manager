import { ForbiddenError } from '@/lib/errors';

/**
 * A função procura e lança erros genéricos de acordo com o response passado
 *
 * erros lançados:
 *    403 - ForbbidenError
 *    400 - BadRequestError
 *    qualquer status diferente do `genericStatus` é tratado como erro inesperado.
 *
 * @param response response of request
 * @param genericStatus status expected. Default 200
 */
export const throwGenericErrors = async (
  response: Response,
  genericStatus: number = 200,
) => {
  if (response.status == 403) {
    throw new ForbiddenError({
      message: 'Email ou senha incorretos!',
      route: 'login',
    });
  }

  if (response.status == 400) {
    const body = await response.json();

    throw new Error(body['message'][0]);
  }

  if (response.status !== genericStatus) {
    throw new Error('Erro inesperado, tente novamente mais tarde!');
  }
};
