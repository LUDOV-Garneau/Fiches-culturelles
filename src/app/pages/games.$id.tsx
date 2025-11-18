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

  if (loading)
    return (
      <div className="mx-auto max-w-5xl px-6 py-16 animate-pulse space-y-6">
        <div className="h-10 w-1/2 rounded bg-gray-200" />
        <div className="h-80 rounded-2xl bg-gray-200" />
      </div>
    );

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

  return (
    <div className="min-h-[80vh] bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Bandeau supérieur — BOUTON RETIRÉ */}
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

          {/* (Rien ici, le bouton Retour a été supprimé) */}
          <div />
        </div>
      </div>

      {/* Contenu principal */}
      <div className="mx-auto max-w-6xl grid md:grid-cols-[1.4fr_0.6fr] gap-10 px-6 py-16">
        {/* Colonne gauche */}
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
          <div className="rounded-3xl bg-white p-7 shadow-sm hover:shadow-md transition">
            <p className="text-xs uppercase font-semibold text-gray-400 tracking-wide">
              Développeur
            </p>
            <h3 className="text-2xl font-bold text-gray-900 mt-3">
              {jeu.developpeurs?.[0] ?? "Inconnu"}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {jeu.anneeSortie ? `Projet ${jeu.anneeSortie}` : "Année inconnue"}
            </p>

            <div className="mt-5 h-px bg-gray-100" />

            <p className="mt-4 text-sm text-gray-500">
              Cette fiche présente un jeu québécois archivé dans LUDOV.
            </p>
          </div>
        </aside>
      </div>

      {/* Retour en bas */}
      <div className="mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-3xl bg-slate-900 p-6 text-white shadow-md hover:bg-slate-800 transition flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-lg font-semibold">
              Vous voulez voir plus de jeux ?
            </h4>
            <p className="text-sm text-white/70 mt-1">
              Revenez à la collection pour consulter les autres titres.
            </p>
          </div>
          <Link
            to="/"
            className="inline-block rounded-full bg-white/10 px-5 py-2 text-sm hover:bg-white/20 transition"
          >
            ← Retour aux jeux
          </Link>
        </div>
      </div>
    </div>
  );
}
