import z from 'zod';
import { HttpRequest, HttpResponse } from '../types/Http';
import { badRequest, conflict, created } from '../utils/http';
import { database } from '~/db';
import { usersTable } from '~/db/schema';
import { eq } from 'drizzle-orm';

const schema = z.object({
  goal: z.enum(['lose', 'maintain', 'gain']),
  gender: z.enum(['male', 'female']),
  birthDate: z.iso.date(),
  height: z.number(),
  weight: z.number(),
  activityLevel: z.number().min(1).max(5),
  account: z.object({
    name: z.string().min(2).max(40),
    email: z.email(),
    password: z.string().min(6).max(20),
  }),
});

export class SignUpController {
  static async handle({ body }: HttpRequest): Promise<HttpResponse> {
    const { success, error, data } = schema.safeParse(body);

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

    const [user] = await database
      .insert(usersTable)
      .values({
        ...rest,
        ...account,
        calories: 0,
        proteins: 0,
        carbohydrates: 0,
        fats: 0,
      })
      .returning({
        id: usersTable.id,
      });

    return created({
      userId: user.id,
    });
  }
}
