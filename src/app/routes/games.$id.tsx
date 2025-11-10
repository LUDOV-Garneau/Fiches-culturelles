// src/app/pages/games.$id.tsx
import * as React from "react";
import { useParams, Link } from "react-router";

type ApiJeu = {
  _id: string;
  titre: string;
  imageUrl?: string;
  developpeurs?: string[];
  anneeSortie?: number;
  resume?: {
    brut?: string;
  };
};

export default function GameDetail() {
  const { id } = useParams(); // ex: 6901382A8C356899DA460B62
  const [jeu, setJeu] = React.useState<ApiJeu | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!id) return;

    async function fetchJeu() {
      try {
  
        const resp = await fetch(`http://72.11.148.122/api/jeux/${id}`);

      

        const data = await resp.json();
        if (data.success && data.data) {
          setJeu(data.data);
        } else {
          setError("Jeu introuvable.");
        }
      } catch (err) {
        console.error(err);
        setError("Erreur de connexion au serveur.");
      } finally {
        setLoading(false);
      }
    }

    fetchJeu();
  }, [id]);


  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-6">
        <p>Chargement du jeu…</p>
      </div>
    );
  }

  if (error || !jeu) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-6">
        <p className="text-red-500">{error ?? "Jeu introuvable."}</p>
        <Link
          to="/"
          className="mt-4 inline-block rounded-md bg-gray-900 px-4 py-2 text-white"
        >
          ← Retour à l’accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      {/* petites pills comme avant */}
      <div className="mb-4 flex flex-wrap gap-2">
        {["Accueil", "Selection", "Publication", "Revue", "Carte", "Participer"].map(
          (t) => (
            <span
              key={t}
              className="rounded-full bg-gray-200 px-3 py-1 text-sm dark:bg-gray-800"
            >
              {t}
            </span>
          )
        )}
      </div>

      <h1 className="text-4xl font-black tracking-tight">
        {jeu.titre ?? "Jeu sans titre"}
      </h1>

      <div className="mt-4 grid gap-6 md:grid-cols-[1fr_320px]">
        {/* Colonne gauche */}
        <div>
          <div className="aspect-[16/9] w-full overflow-hidden rounded-xl bg-gray-200 dark:bg-gray-800">
            {jeu.imageUrl ? (
              <img
                src={jeu.imageUrl}
                alt={jeu.titre}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-gray-500">
                (image à venir)
              </div>
            )}
          </div>

          <p className="mt-4 text-gray-700 dark:text-gray-300">
         
            {jeu.resume?.brut
              ? jeu.resume.brut
              : "Aucune description fournie pour ce jeu."}
          </p>

          <p className="mt-4 text-gray-700 dark:text-gray-300">
            {jeu.anneeSortie ? `Année de sortie : ${jeu.anneeSortie}` : null}
          </p>

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
            <span className="text-center text-sm text-gray-500">
              {jeu.developpeurs?.[0] ?? "Inconnu"}
            </span>
          </div>

          <div className="mt-6">
            <p className="text-sm font-semibold">Genres:</p>
            <ul className="mt-1 list-disc pl-5 text-sm text-gray-700 dark:text-gray-300">
              {/* si ya pa de genre jai mis un fallback */}
              <li>Indie</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
