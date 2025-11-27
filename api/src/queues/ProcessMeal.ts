import { eq } from 'drizzle-orm';
import { database } from '~/db';
import { mealsTable } from '~/db/schema';

export class ProcessMeal {
  static async process({ fileKey }: { fileKey: string }) {
    const meal = await database.query.mealsTable.findFirst({
      where: eq(mealsTable.inputFileKey, fileKey),
    });

    if (!meal) {
      throw new Error(`Meal ${fileKey} not found`);
    }

    if (meal.status === 'failed' || meal.status === 'success') {
      return;
    }

    await database
      .update(mealsTable)
      .set({ status: 'processing' })
      .where(eq(mealsTable.id, meal.id));

    try {
      // chamada de ia (?)

      await database
        .update(mealsTable)
        .set({
          // response based on ia call
          status: 'success',
          name: 'Processed name',
          icon: 'emoji',
          foods: [
            {
              name: 'pao',
              quantity: '2 fatias',
              calories: 100,
              proteins: 200,
              carbohydrates: 300,
              fats: 400,
            },
          ],
        })
        .where(eq(mealsTable.id, meal.id));
    } catch {
      await database
        .update(mealsTable)
        .set({ status: 'failed' })
        .where(eq(mealsTable.id, meal.id));
    }
  }
}
