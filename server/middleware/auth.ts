import { createBasicAuthMiddleware } from "h3-basic-auth";

export default defineEventHandler(async (event) => {
  if(event.path.startsWith("/api/_hub")) {
    return
  }
  const { sessionSecret, username, password } = useRuntimeConfig(event).auth;
  return createBasicAuthMiddleware({
    sessionSecret,
    username,
    password,
  })(event);
});
