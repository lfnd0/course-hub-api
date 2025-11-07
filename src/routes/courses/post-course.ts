import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../../database/client.ts";
import { courses } from "../../database/schema.ts";

export const postCourseRoute: FastifyPluginAsyncZod = async (server) => {
  server.post(
    "/courses",
    {
      schema: {
        tags: ["courses"],
        summary: "Create a new course",
        body: z.object({
          title: z.string().min(2, "title must have at least 2 characters"),
        }),
        response: {
          201: z
            .object({
              course: z.object({
                id: z.uuid(),
              }),
            })
            .describe("Created course"),
        },
      },
    },
    async (request, reply) => {
      const { title } = request.body;

      const createdCourse = await db
        .insert(courses)
        .values({
          title,
        })
        .returning();

      const { id } = createdCourse[0];
      return reply.status(201).send({ course: { id } });
    }
  );
};
