import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import {
  json,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { Toaster, toast } from "sonner";
import moment from "moment";
import { ThemeProvider } from "next-themes";
import { NextUIProvider } from "@nextui-org/react";
import styles from "./tailwind.css";
import { commitFlashSession, getFlashSession } from "./utils/flash-session";
import { useEffect } from "react";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export default function App() {
  const { message } = useLoaderData<typeof loader>();

  useEffect(() => {
    if (message) {
      switch (message.status) {
        case "success":
          toast.success(message.title, {
            description: `${
              message.description ? " " + message.description + " - " : ""
            } ${moment().format("dddd, MMMM D, YYYY [at] h:mm A")} `,
          });
          break;
        case "error":
          toast.error(message.title, {
            description: `${
              message.description ? " " + message.description + " - " : ""
            } ${moment().format("dddd, MMMM D, YYYY [at] h:mm A")} `,
          });
          break;
        default:
          break;
      }
    }
  }, [message]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <NextUIProvider>
          <ThemeProvider attribute="class" defaultTheme="light">
            <Toaster position="bottom-right" richColors />
            <Outlet />
            <ScrollRestoration />
            <Scripts />
            <LiveReload />
          </ThemeProvider>
        </NextUIProvider>
      </body>
    </html>
  );
}

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getFlashSession(request.headers.get("Cookie"));
  const message = session.get("message") || null;

  return json(
    { message },
    {
      headers: {
        "Set-Cookie": await commitFlashSession(session),
      },
    }
  );
};
