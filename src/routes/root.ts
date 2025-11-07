import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

export const root: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/",
    {
      schema: {
        tags: ["root"],
        summary: "API root endpoint",
        response: {
          200: z.object({
            message: z.literal("Welcome to Course Hub API"),
          }),
        },
      },
    },
    async (_, reply) => {
      return reply.send({
        message: "Welcome to Course Hub API",
      });
    }
  );
};
