import { HttpRequest, HttpResponse } from '../types/Http';

export class SignUpController {
  static async handle(request: HttpRequest): Promise<HttpResponse> {
    return {
      statusCode: 201,
      body: {
        accessToken: 'signup - token de acesso',
      },
    }
  }
}
