import express from "express";
import { ApolloServer } from "apollo-server-express";

export async function startServer() {
  const app = express();
  return app;
};