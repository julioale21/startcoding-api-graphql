import { createConnection } from "typeorm";
import path from "path";

export async function connect() {
  await createConnection({
    type: "postgres",
    port: 5432,
    username: "postgres",
    password: "123456",
    database: "nodejs-course",
    entities: [
      path.join(__dirname, "../entity/**/**.ts")
    ],
    synchronize: true,
  })
  console.log("Database connected")
}