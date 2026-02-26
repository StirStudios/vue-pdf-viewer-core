import { defineEventHandler } from "h3";

export default defineEventHandler(async () => {
  // Keep the request pending so the viewer remains in loading state.
  await new Promise(() => {});
  return null;
});
