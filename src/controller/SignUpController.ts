import { HttpRequest, HttpResponse } from '../types/Http';
import { badRequest, conflict, created } from '../utils/http';
import { database } from '~/db';
import { usersTable } from '~/db/schema';
import { eq } from 'drizzle-orm';
import { hash } from 'bcryptjs';
import { signUpSchema } from '~/schemas/signUpSchema';
import { signAccessToken } from '~/lib/jwt';
import { calculateGoals } from '~/lib/calculateGoals';

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

    const goals = calculateGoals({
      activityLevel: rest.activityLevel,
      birthDate: new Date(rest.birthDate),
      gender: rest.gender,
      goal: rest.goal,
      height: rest.height,
      weight: rest.weight,
    })

    const [user] = await database
      .insert(usersTable)
      .values({
        ...rest,
        ...account,
        ...goals,
        password: hashedPassword,
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
