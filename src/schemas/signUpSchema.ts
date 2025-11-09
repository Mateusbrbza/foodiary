import z from 'zod';

export const signUpSchema = z.object({
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
