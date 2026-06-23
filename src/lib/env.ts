import { z } from "zod";

const envSchema = z.object({
  PERSPECTIVE_API_KEY: z.string().default(""),
  QWEN_API_KEY: z.string().default(""),
  UPSTASH_REDIS_REST_URL: z.string().default(""),
  UPSTASH_REDIS_REST_TOKEN: z.string().default(""),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

export const env = envSchema.parse({
  PERSPECTIVE_API_KEY: process.env.PERSPECTIVE_API_KEY,
  QWEN_API_KEY: process.env.QWEN_API_KEY,
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
  NODE_ENV: process.env.NODE_ENV,
});
