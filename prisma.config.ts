import { defineConfig } from "@prisma/config";
import dotenv from "dotenv";

// Force load the .env file variables into process.env
dotenv.config();

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
