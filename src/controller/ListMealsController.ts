import { database } from '~/db';
import { HttpResponse, ProtectedHttpRequest } from '../types/Http';
import { badRequest, ok } from '../utils/http';
import z from 'zod';
import { eq } from 'drizzle-orm';
import { mealsTable } from '~/db/schema';

const schema = z.object({
  date: z.iso.date().transform(dateStr => new Date(dateStr)),
})

export class ListMealsController {
  static async handle({
    userId, queryParams
  }: ProtectedHttpRequest): Promise<HttpResponse> {
    const { success, error, data } = schema.safeParse(queryParams)

    if (!success) {
      return badRequest({ errors: error.issues })
    }

    const meals = await database.query.mealsTable.findMany({
      columns: {
        id: true,
        foods: true,
        createdAt: true,
        icon: true,
        name: true,
      },
      where: eq(mealsTable.userId, userId),
    });

    return ok({ meals });
  }
}
