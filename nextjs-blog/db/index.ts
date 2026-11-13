import { drizzle } from "drizzle-orm/postgres-js"
import * as dotenv from "dotenv"
import { users, blogs, readingList } from "./schema"

dotenv.config({ path: ".env.local", quiet: true })

export const db = drizzle(process.env.DATABASE_URL!, {
  schema: { users, blogs, readingList },
})
