import fastifySwagger from "@fastify/swagger";
import fastifyApiReference from "@scalar/fastify-api-reference";
import fastify from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { env } from "./env/index.ts";
import { getCourseByIdRoute } from "./routes/courses/get-course-by-id.ts";
import { getCoursesRoute } from "./routes/courses/get-courses.ts";
import { postCourseRoute } from "./routes/courses/post-course.ts";
import { root } from "./routes/root.ts";

const server = fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
}).withTypeProvider<ZodTypeProvider>();

server.setSerializerCompiler(serializerCompiler);
server.setValidatorCompiler(validatorCompiler);

if (env.NODE_ENV === "development") {
  server.register(fastifySwagger, {
    openapi: {
      info: {
        title: "Course Hub API",
        description: "API for managing courses",
        version: "1.0.0",
      },
    },
    transform: jsonSchemaTransform,
  });

  server.register(fastifyApiReference, {
    routePrefix: "/docs",
  });
}

server.register(root);
server.register(postCourseRoute);
server.register(getCoursesRoute);
server.register(getCourseByIdRoute);

server
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log("🔥 Server is running!");
  });
