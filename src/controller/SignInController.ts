import { HttpRequest, HttpResponse } from '../types/Http';

export class SignInController {
  static async handle(request: HttpRequest): Promise<HttpResponse> {
    return {
      statusCode: 200,
      body: {
        accessToken: 'token de acesso',
      },
    }
  }
}
