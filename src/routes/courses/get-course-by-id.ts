import { eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../../database/client.ts";
import { courses } from "../../database/schema.ts";

export const getCourseByIdRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/courses/:id",
    {
      schema: {
        tags: ["courses"],
        summary: "List a course by ID",
        params: z.object({
          id: z.uuid("invalid course ID"),
        }),
        response: {
          200: z.object({
            course: z.object({
              id: z.uuid(),
              title: z.string(),
              description: z.string().nullable(),
            }),
          }),
          404: z.undefined().describe("Course not found"),
        },
      },
    },
    async (request, reply) => {
      const courseId = request.params.id;

      const coursesList = await db
        .select()
        .from(courses)
        .where(eq(courses.id, courseId));

      if (coursesList.length) {
        const course = coursesList[0];
        return reply.send({ course });
      }

      return reply.status(404).send();
    }
  );
};
