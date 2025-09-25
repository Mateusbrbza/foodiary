import { database } from '~/db';
import { HttpResponse, ProtectedHttpRequest } from '../types/Http';
import { ok } from '../utils/http';
import { eq } from 'drizzle-orm';
import { usersTable } from '~/db/schema';

export class GetMeController {
  static async handle({ userId }: ProtectedHttpRequest): Promise<HttpResponse> {
    const user = await database.query.usersTable.findFirst({
      columns: {
        id: true,
        email: true,
        name: true,
        calories: true,
        proteins: true,
        carbohydrates: true,
        fats: true,
      },
      where: eq(usersTable.id, userId),
    })

    return ok({ user })
  }
}
