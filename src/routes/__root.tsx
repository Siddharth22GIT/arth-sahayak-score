import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Arth AI — Credit, redefined for India" },
      { name: "description", content: "AI-powered alternative credit scoring for India's 300M+ credit-invisible. Get your Arth Score in seconds." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "Arth AI — Credit, redefined for India" },
      { name: "twitter:title", content: "Arth AI — Credit, redefined for India" },
      { property: "og:description", content: "AI-powered alternative credit scoring for India's 300M+ credit-invisible. Get your Arth Score in seconds." },
      { name: "twitter:description", content: "AI-powered alternative credit scoring for India's 300M+ credit-invisible. Get your Arth Score in seconds." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/340a8c06-686b-46d5-bee7-9215783cf233/id-preview-3651ce09--af7a2678-c0ea-4dfe-a74c-9e7bd8fcae12.lovable.app-1776665500092.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/340a8c06-686b-46d5-bee7-9215783cf233/id-preview-3651ce09--af7a2678-c0ea-4dfe-a74c-9e7bd8fcae12.lovable.app-1776665500092.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
