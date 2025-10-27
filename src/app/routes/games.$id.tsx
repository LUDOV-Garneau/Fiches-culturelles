// src/my-app/app/routes/games.$id.tsx
import type { Route } from "./+types/games.$id";
import { useParams, Link } from "react-router";




type Game = {
  id: string;
  title: string;
  developer: string;
  description: string;
  genres: string[];
  cover?: string | null; // null => placeholder
};

// mini "fake DB" pour l'instant
const DB: Record<string, Game> = {
  fez: {
    id: "fez",
    title: "FEZ",
    developer: "Polytron",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ut arcu elit. Nullam quis scelerisque elit. Quisque sed mattis elit, et ullamcorper ex.",
    genres: ["Action Puzzle", "Indie"],
    cover: null,
  },
  tetards: {
    id: "tetards",
    title: "Têtards (1982)",
    developer: "Vincent Côté",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae.",
    genres: ["Aventure"],
    cover: null,
  },
  mimi: {
    id: "mimi",
    title: "Mimi la fourmi (1984)",
    developer: "Anne Bergeron",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae.",
    genres: ["Famille"],
    cover: null,
  },
  "fou-du-roi": {
    id: "fou-du-roi",
    title: "Le fou du roi (1989)",
    developer: "Loto-Québec",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae.",
    genres: ["Arcade"],
    cover: null,
  },
};

// fallback si l'id n'est pas dans DB
function getGame(id?: string): Game {
  if (!id) {
    return {
      id: "unknown",
      title: "Jeu inconnu",
      developer: "—",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae.",
      genres: ["Indie"],
      cover: null,
    };
  }
  return DB[id] ?? {
    id,
    title: id.replace(/-/g, " ").toUpperCase(),
    developer: "—",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae.",
    genres: ["Indie"],
    cover: null,
  };
}

export function meta({ params }: Route.MetaArgs) {
  const game = getGame(params.id);
  return [{ title: `${game.title} – LUDOV` }];
}

export default function GameDetail() {
  const { id } = useParams();
  const game = getGame(id);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      {/* petites “pills” de navigation (visuelles) */}
      <div className="mb-4 flex flex-wrap gap-2">
        {["Accueil", "Selection", "Publication", "Revue", "Carte", "Participer"].map((t) => (
          <span
            key={t}
            className="rounded-full bg-gray-200 px-3 py-1 text-sm dark:bg-gray-800"
          >
            {t}
          </span>
        ))}
      </div>

      <h1 className="text-4xl font-black tracking-tight">{game.title}</h1>

      <div className="mt-4 grid gap-6 md:grid-cols-[1fr_320px]">
        {/* Colonne gauche */}
        <div>
          {/* cover */}
          <div className="aspect-[16/9] w-full overflow-hidden rounded-xl bg-gray-200 dark:bg-gray-800">
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

          {/* description */}
          <p className="mt-4 text-gray-700 dark:text-gray-300">
            {game.description}
          </p>

          <p className="mt-4 text-gray-700 dark:text-gray-300">
            Autres infos du word…
          </p>

          {/* retour */}
          <div className="mt-6">
            <Link
              to="/"
              className="inline-block rounded-md bg-gray-900 px-4 py-2 text-white dark:bg-gray-100 dark:text-gray-900"
            >
              ← Retour à l’accueil
            </Link>
          </div>
        </div>

        {/* Colonne droite */}
        <aside className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-950">
          <p className="text-sm font-semibold">Développeur:</p>
          <div className="mt-2 grid h-40 place-items-center rounded-lg border bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
            {/* <img src={logo} alt="Logo développeur" className="h-20" /> */}
          </div>

          <div className="mt-6">
            <p className="text-sm font-semibold">Genres:</p>
            <ul className="mt-1 list-disc pl-5 text-sm text-gray-700 dark:text-gray-300">
              {game.genres.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
