import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL!;

// Use postgres.js which is serverless-friendly
const client = postgres(connectionString, {
    ssl: process.env.NODE_ENV === "production" ? "require" : false,
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
});

export const db = drizzle(client, { schema });
