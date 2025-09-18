import { compare } from 'bcryptjs';
import { eq } from 'drizzle-orm';

import { usersTable } from '~/db/schema';
import { signInSchema } from '~/schemas/signInSchema';
import { HttpRequest, HttpResponse } from '../types/Http';
import { badRequest, ok, unauthorized } from '../utils/http';
import { database } from '~/db';
import { signAccessToken } from '~/lib/jwt';

export class SignInController {
  static async handle({ body }: HttpRequest): Promise<HttpResponse> {
    const { success, error, data } = signInSchema.safeParse(body);

    if (!success) {
      return badRequest({ errors: error.issues });
    }

    const user = await database.query.usersTable.findFirst({
      columns: {
        id: true,
        email: true,
        password: true
      },
      where: eq(usersTable.email, data.email),
    });

    if (!user) {
      return unauthorized({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await compare(data.password, user.password);

    if (!isPasswordValid) {
      return unauthorized({ message: 'Invalid credentials' });
    }

    const accessToken = signAccessToken(user.id);

    return ok({
      accessToken,
    });
  }
}
