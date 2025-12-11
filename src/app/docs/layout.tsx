import { Outlet, Link } from "react-router";
import { Sidenav } from "~/components/sidenav";

export default function DocsLayout() {
  return (
    <div className="flex min-h-screen bg-white text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-20 w-64 border-r border-slate-200 bg-white p-6 overflow-y-auto">
        <div className="mb-8 font-bold text-xl">
          Documentation - Fiches culturelles
        </div>

        <nav className="space-y-6">
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Introduction
            </h3>
            <div className="flex flex-col space-y-2">
              <Link to="/docs" className="text-sm hover:text-blue-600">
                Général
              </Link>
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Utilisateur
            </h3>
            <div className="flex flex-col space-y-2">
              <Link
                to="/docs/utilisateur"
                className="text-sm hover:text-blue-600"
              >
                Guide
              </Link>
            </div>
          </div>
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Administrateur
            </h3>
            <div className="flex flex-col space-y-2">
              <Link
                to="/docs/administrateur"
                className="text-sm hover:text-blue-600"
              >
                Lien 1
              </Link>
            </div>
          </div>
        </nav>
      </aside>
      <main className="pl-64 w-full">
        <div className="mx-auto max-w-4xl px-8 py-12">
          <div className="prose prose-slate max-w-none prose-headings:font-semibold prose-a:text-blue-600">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
