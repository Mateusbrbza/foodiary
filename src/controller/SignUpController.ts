import { HttpRequest, HttpResponse } from '../types/Http';
import { badRequest, conflict, created } from '../utils/http';
import { database } from '~/db';
import { usersTable } from '~/db/schema';
import { eq } from 'drizzle-orm';
import { hash } from 'bcryptjs';
import { signUpSchema } from '~/schemas/signUpSchema';
import { signAccessToken } from '~/lib/jwt';

export class SignUpController {
  static async handle({ body }: HttpRequest): Promise<HttpResponse> {
    const { success, error, data } = signUpSchema.safeParse(body);

    if (!success) {
      return badRequest({ errors: error.issues });
    }

    const userAlreadyExists = await database.query.usersTable.findFirst({
      columns: { email: true },
      where: eq(usersTable.email, data.account.email),
    });

    if (userAlreadyExists) {
      return conflict({ message: 'Email is already in use.' });
    }

    const { account, ...rest } = data;

    const hashedPassword = await hash(account.password, 8);

    const [user] = await database
      .insert(usersTable)
      .values({
        ...rest,
        ...account,
        password: hashedPassword,
        calories: 0,
        proteins: 0,
        carbohydrates: 0,
        fats: 0,
      })
      .returning({
        id: usersTable.id,
      });

    const accessToken = signAccessToken(user.id);

    return created({
      accessToken
    });
  }
}
