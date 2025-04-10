// import "dotenv/config";
// import type { Config } from "drizzle-kit";

// export default {
//   schema: "./db/schema.ts",
//   out: "./drizzle",
//   driver: "pg",
//   dbCredentials: {
//     connectionString: process.env.DATABASE_URL!,
//   },
// } satisfies Config;

import "dotenv/config";
import type { Config } from "drizzle-kit";

export default {
  schema: "./db/schema.ts", // or wherever your schema is
  out: "./drizzle",
  dialect: "postgresql", //✅ required for 0.30.1
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
} satisfies Config;
