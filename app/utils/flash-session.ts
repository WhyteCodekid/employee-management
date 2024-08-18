// app/sessions.ts
import { createCookieSessionStorage } from "@remix-run/node"; // or cloudflare/deno

type SessionData = {
  userId: string;
};

type SessionFlashData = {
  message: {
    title: string;
    description?: string;
    status: string;
  };
};

const secret = "asfafasfasjfhasf";
if (!secret) {
  throw new Error("No session secret provided");
}

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    cookie: {
      name: "__falsh_session",
      httpOnly: true,
      maxAge: 1,
      path: "/",
      sameSite: "lax",
      secrets: [secret],
    },
  });

const getFlashSession = getSession;
const commitFlashSession = commitSession;
const destroyFlashSession = destroySession;
export { getFlashSession, commitFlashSession, destroyFlashSession };
