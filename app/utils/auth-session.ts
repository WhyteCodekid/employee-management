// app/sessions.ts
import { createCookieSessionStorage } from "@remix-run/node"; // or cloudflare/deno

type AuthSessionInterface = {
  token: string;
};

const secret = "rtfgyuij67890";
if (!secret) {
  throw new Error("No session secret provided");
}

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<AuthSessionInterface>({
    cookie: {
      name: "__auth_session",
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 5,
      path: "/",
      sameSite: "lax",
      secrets: [secret],
    },
  });

export { getSession, commitSession, destroySession };
