import z from "zod";

const envSchema = z.object({
  PORT: z.coerce.number(),
  DATABASE_URL: z.url(),
});

const envSchemaSafeParse = envSchema.safeParse(process.env);
if (!envSchemaSafeParse.success) {
  throw new Error("invalid environment");
}

const { data } = envSchemaSafeParse;
export const env = data;
