// src/app/pages/games.$id.tsx
import * as React from "react";
import { useParams, Link } from "react-router";

type ApiJeu = {
  _id: string;
  titre: string;
  imageUrl?: string;
  developpeurs?: string[];
  anneeSortie?: number;
  resume?: { brut?: string };
};

export default function GameDetail() {
  const { id } = useParams();
  const [jeu, setJeu] = React.useState<ApiJeu | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!id) return;

    async function fetchJeu() {
      try {
        const resp = await fetch(`http://72.11.148.122/api/jeux/${id}`);
        const data = await resp.json();
        if (data.success && data.data) setJeu(data.data);
        else setError("Jeu introuvable.");
      } catch {
        setError("Erreur de connexion au serveur.");
      } finally {
        setLoading(false);
      }
    }
    fetchJeu();
  }, [id]);

  /* --- Chargement --- */
  if (loading)
    return (
      <div className="mx-auto max-w-5xl px-6 py-16 animate-pulse space-y-6">
        <div className="h-10 w-1/2 rounded bg-gray-200" />
        <div className="h-80 rounded-2xl bg-gray-200" />
      </div>
    );

  /* --- Erreur --- */
  if (error || !jeu)
    return (
      <div className="mx-auto max-w-5xl px-6 py-20 text-center">
        <p className="text-red-600 text-lg font-semibold">
          {error ?? "Jeu introuvable."}
        </p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-full bg-gray-900 px-6 py-3 text-white hover:bg-gray-800 transition"
        >
          ← Retour à l’accueil
        </Link>
      </div>
    );

  /* --- Contenu principal --- */
  return (
    <div className="min-h-[80vh] bg-gradient-to-b from-gray-50 to-gray-100">

      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 text-white shadow-lg">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between px-6 py-10">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-white/60">
              Fiche de jeu
            </p>
            <h1 className="text-4xl md:text-5xl font-black leading-tight mt-2">
              {jeu.titre}
            </h1>
            {jeu.anneeSortie && (
              <p className="mt-2 text-sm text-white/70">
                Année de sortie : {jeu.anneeSortie}
              </p>
            )}
          </div>

          <Link
            to="/"
            className="mt-6 md:mt-0 rounded-full bg-white/10 px-5 py-2 text-sm font-medium text-white hover:bg-white/20 transition"
          >
            ← Retour
          </Link>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="mx-auto max-w-6xl grid md:grid-cols-[1.4fr_0.6fr] gap-10 px-6 py-16">
     
        <div className="space-y-10">
  
          <div className="relative overflow-hidden rounded-3xl shadow-md bg-gray-200">
            {jeu.imageUrl ? (
              <img
                src={jeu.imageUrl}
                alt={jeu.titre}
                className="h-[400px] w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
              />
            ) : (
              <div className="flex h-[400px] items-center justify-center text-gray-400 italic">
                (Image à venir)
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-6 py-3">
              <p className="text-lg font-semibold text-white">
                {jeu.titre ?? "Jeu sans titre"}
              </p>
              <p className="text-sm text-white/70">
                {jeu.developpeurs?.[0] ?? "Développeur inconnu"}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="rounded-3xl bg-white p-8 shadow-sm hover:shadow-md transition">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Description
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {jeu.resume?.brut ||
                "Aucune description fournie pour ce jeu pour le moment."}
            </p>
            <p className="mt-5 text-xs text-gray-400">
              Source : base de données LUDOV
            </p>
          </div>
        </div>

        {/* Colonne droite */}
        <aside className="space-y-6">
          <div className="rounded-3xl bg-white p-6 shadow-sm hover:shadow-md transition">
            <p className="text-xs uppercase font-semibold text-gray-400">
              Développeur
            </p>
            <h3 className="text-xl font-bold text-gray-900 mt-2">
              {jeu.developpeurs?.[0] ?? "Inconnu"}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {jeu.anneeSortie ? `Projet ${jeu.anneeSortie}` : ""}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm hover:shadow-md transition">
            <p className="text-xs uppercase font-semibold text-gray-400">
              Informations
            </p>
            <ul className="mt-3 space-y-2 text-sm text-gray-700">
              <li className="flex justify-between border-b border-gray-100 pb-2">
                <span>ID en base</span>
                <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                  {jeu._id}
                </code>
              </li>
              {jeu.anneeSortie && (
                <li className="flex justify-between">
                  <span>Année</span>
                  <span>{jeu.anneeSortie}</span>
                </li>
              )}
            </ul>
          </div>

          <div className="rounded-3xl bg-slate-900 p-6 text-white shadow-md hover:bg-slate-800 transition">
            <h4 className="text-lg font-semibold">Besoin d’en voir plus ?</h4>
            <p className="text-sm text-white/70 mt-2 leading-relaxed">
              Les fiches complètes et médias seront intégrés dans les
              prochaines versions du site.
            </p>
            <Link
              to="/"
              className="mt-5 inline-block rounded-full bg-white/10 px-5 py-2 text-sm hover:bg-white/20 transition"
            >
              ← Retour aux jeux
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
