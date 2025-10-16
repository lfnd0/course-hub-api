import fastify from "fastify";
import { env } from "./env/index.ts";

const server = fastify();

server.get("/", (_, reply) => {
  return reply.send({
    message: "Welcome to Course Hub API",
  });
});

server
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log("Server is running on http://localhost:3333");
  });
