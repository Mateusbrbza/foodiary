import { database } from '~/db';
import { HttpResponse, ProtectedHttpRequest } from '../types/Http';
import { badRequest, created } from '../utils/http';
import { mealsTable } from '~/db/schema';
import z from 'zod';

const schema = z.object({
  fileType: z.enum(['audio/m4a', 'image/jpeg']),
})

export class CreateMealController {
  static async handle({ userId, body }: ProtectedHttpRequest): Promise<HttpResponse> {
    const { success, error, data } = schema.safeParse(body)

    if (!success) {
      return badRequest({ errors: error.issues })
    }

    const [meal] = await database.insert(mealsTable).values({
      userId,
      status: 'uploading',
      inputFileKey: 'input_file_key',
      inputType: data.fileType === 'audio/m4a' ? 'audio' : 'image',
      name: '',
      icon: '',
      foods: [],
    }).returning({ id: mealsTable.id });

    return created({ mealId: meal.id });
  }
}
