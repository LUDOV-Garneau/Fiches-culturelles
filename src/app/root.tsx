import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import { Sidenav } from "~/components/sidenav";
import type { Route } from "./+types/root";
import "./app.css";


export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <div className="app-layout">
      <header className="bg-gray-800 text-white p-4">
        <nav className="flex gap-4 justify-end-safe">
          <a href="/">Home</a>
          <a href="/admin">Admin</a>
          <a href="#">Contact</a>
          <a
            href="/login"
            className="btn-primary"
          >
            Login
          </a>
        </nav>
        <Sidenav/>
      </header>

      <main className="p-6">
        <Outlet />
      </main>

      <footer className="bg-white-100 text-center p-4">
        <p className="max-w-6xl mx-auto px-4 py-8 text-sm text-gray-600">
          © Copyright {new Date().getFullYear()} LUDOV (Laboratoire
          universitaire de documentation et d’observation vidéoludiques) – Tous
          droits réservés
        </p>
      </footer>
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
