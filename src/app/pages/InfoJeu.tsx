import * as React from "react";
import { useParams, Link } from "react-router";

/** -------- Types & mini DB (placeholder) -------- */
type Game = {
  id: string;
  title: string;
  developer: string;
  description: string;
  genres: string[];
  cover?: string | null;
  developerLogo?: string | null;
};

const LOCAL_DB: Record<string, Game> = {
  fez: {
    id: "fez",
    title: "FEZ",
    developer: "Polytron",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ut arcu elit. Nullam quis scelerisque elit. Quisque sed mattis elit, et ullamcorper ex.",
    genres: ["Action Puzzle", "Indie"],
    cover: null,
    developerLogo: null,
  },
  tetards: {
    id: "tetards",
    title: "Têtards (1982)",
    developer: "Vincent Côté",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae.",
    genres: ["Aventure"],
    cover: null,
    developerLogo: null,
  },
  mimi: {
    id: "mimi",
    title: "Mimi la fourmi (1984)",
    developer: "Anne Bergeron",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae.",
    genres: ["Famille"],
    cover: null,
    developerLogo: null,
  },
  "fou-du-roi": {
    id: "fou-du-roi",
    title: "Le fou du roi (1989)",
    developer: "Loto-Québec",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae.",
    genres: ["Arcade"],
    cover: null,
    developerLogo: null,
  },
};

function getLocalGame(id?: string): Game {
  if (!id) {
    return {
      id: "unknown",
      title: "Jeu inconnu",
      developer: "—",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae.",
      genres: ["Indie"],
      cover: null,
      developerLogo: null,
    };
  }
  return (
    LOCAL_DB[id] ?? {
      id,
      title: id.replace(/-/g, " ").toUpperCase(),
      developer: "—",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae.",
      genres: ["Indie"],
      cover: null,
      developerLogo: null,
    }
  );
}

/** -------- UI petits éléments -------- */
function LudovBadge() {
  return (
    <aside className="sticky top-6 hidden md:flex h-[260px] w-12 items-center justify-center rounded-2xl bg-gray-300/90 shadow-inner">
      <div className="flex flex-col items-center gap-2">
        <div className="h-7 w-7 rotate-45 rounded-md bg-[--color-primary-blue]" />
        <div className="tracking-[0.25em] font-bold text-gray-800 [writing-mode:vertical-rl]">
          LUDOV
        </div>
      </div>
    </aside>
  );
}

function DevCard({
  developer,
  logo,
}: {
  developer: string;
  logo?: string | null;
}) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <h3 className="mb-3 font-semibold text-gray-900">Développeur:</h3>
      <div className="mx-auto mb-3 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
        {logo ? (
          <img
            src={logo}
            alt={developer}
            className="h-24 w-24 object-contain"
          />
        ) : (
          <span className="text-xs text-gray-400">logo</span>
        )}
      </div>
      <p className="text-2xl font-black">{developer}</p>
    </div>
  );
}

/** -------- Page InfoJeu -------- */
export default function InfoJeu({ id: idProp }: { id?: string }) {
  const { id: idParam } = useParams();
  const id = idProp ?? (idParam as string | undefined);
  const game = getLocalGame(id);

  return (
    <main className="min-h-[70vh] bg-gray-100">
      {/* Plus de bandeau nav ici */}

      {/* Contenu principal */}
      <section className="mx-auto max-w-5xl px-4 py-6">
        <div className="flex gap-6">
          <LudovBadge />

          <div className="flex-1">
            <h1 className="text-4xl font-black tracking-tight text-gray-900">
              {game.title}
            </h1>

            <div className="mt-3 grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="md:col-span-2 rounded-xl border bg-white p-3 shadow-sm">
                <div className="aspect-[16/9] w-full overflow-hidden rounded-lg bg-gray-200">
                  {game.cover ? (
                    <img
                      src={game.cover}
                      alt={game.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-gray-500">
                      (image à venir)
                    </div>
                  )}
                </div>
              </div>

              <DevCard developer={game.developer} logo={game.developerLogo} />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="md:col-span-2 rounded-xl border bg-white p-5 shadow-sm">
                <p className="text-gray-800">{game.description}</p>
                <p className="mt-4 text-gray-800">
                  Autres infos du word… (placeholder).
                </p>
              </div>

              <div className="rounded-xl border bg-white p-5 shadow-sm">
                <h3 className="mb-2 font-semibold text-gray-900">Genres:</h3>
                <ul className="list-disc pl-5 text-gray-800 space-y-1">
                  {game.genres.map((g) => (
                    <li key={g}>{g}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                to="/"
                className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-50"
              >
                ← Retour
              </Link>
              <a
                href="#"
                className="rounded-md bg-[--color-primary-blue] px-3 py-1.5 text-sm text-white hover:opacity-90"
              >
                Voir la fiche complète
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
