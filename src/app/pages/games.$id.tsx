// src/app/pages/games.$id.tsx
import * as React from "react";
import { useParams, Link } from "react-router";
import { FaSteam, FaXbox, FaPlaystation, FaItchIo } from "react-icons/fa";
import { SiEpicgames, SiGogdotcom, SiNintendoswitch } from "react-icons/si";

const PlatformIcon = ({ platformName }: { platformName: any }) => {
  const nameStr = String(platformName || "");
  const lower = nameStr.toLowerCase();

  let icon = null;
  let color = "text-gray-500";

  if (lower.includes("steam")) {
    icon = <FaSteam />;
    color = "text-blue-900";
  } else if (lower.includes("epic")) {
    icon = <SiEpicgames />;
    color = "text-gray-900";
  } else if (lower.includes("gog")) {
    icon = <SiGogdotcom />;
    color = "text-purple-700";
  } else if (lower.includes("switch") || lower.includes("nintendo")) {
    icon = <SiNintendoswitch />;
    color = "text-red-600";
  } else if (lower.includes("xbox")) {
    icon = <FaXbox />;
    color = "text-green-600";
  } else if (
    lower.includes("playstation") ||
    lower.includes("ps4") ||
    lower.includes("ps5")
  ) {
    icon = <FaPlaystation />;
    color = "text-blue-700";
  } else if (lower.includes("itch")) {
    icon = <FaItchIo />;
    color = "text-red-500";
  } else {
    if (lower.includes("[object")) return null;
    return (
      <span className="text-xs bg-gray-200 px-2 py-1 rounded">{nameStr}</span>
    );
  }

  return (
    <span className={`text-2xl ${color}`} title={nameStr}>
      {icon}
    </span>
  );
};

type SourceItem = {
  titre?: string;
  url?: string;
};

type GenreItem = {
  type?: string;
  valeur?: string;
};

type ApiJeu = {
  _id: string;
  titreComplet: {
    principal: string;
    sousTitre?: string;
  };
  titre?: string;
  imageUrl?: string;
  developpeurs?: string[];
  anneeSortie?: number;
  plateformes?: string | string[];
  langue?: string | null;
  villeDeveloppement?: string | null;
  editeurs?: string[];
  lieuPublication?: string | null;
  editeurPrincipal?: string | null;

  genres?: GenreItem[];
  recompenses?: string[];
  autresRemarques?: string | null;
  ressourcesLudov?: SourceItem[];
  documentsReference?: SourceItem[];
  critiques?: SourceItem[];
  paratextes?: SourceItem[];
  autresSources?: SourceItem[];

  resume: {
    brut?: string;
    fr?: string | null;
    en?: string | null;
    notes?: {
      credits?: string | null;
      autresEditions?: string | null;
      etiquettesGeneriques?: string[];
      liensQuebec?: string | null;
    };
  };
};

export default function GameDetail() {
  const { id } = useParams();
  const [jeu, setJeu] = React.useState<ApiJeu | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!id) return;

    async function fetchJeuAndSiblings() {
      try {
        const respOne = await fetch(`http://72.11.148.122/api/jeux/${id}`);
        const dataOne = await respOne.json();

        if (!dataOne.success || !dataOne.data) {
          setError("Jeu introuvable.");
          setLoading(false);
          return;
        }

        const currentGame: ApiJeu = dataOne.data;

        const respAll = await fetch(`http://72.11.148.122/api/jeux`);
        const dataAll = await respAll.json();

        let mergedPlatforms: string[] = [];

        if (dataAll.success && Array.isArray(dataAll.data)) {
          const siblings = dataAll.data.filter(
            (g: ApiJeu) =>
              g.titreComplet.principal === currentGame.titreComplet.principal &&
              g.anneeSortie === currentGame.anneeSortie
          );

          const setPlats = new Set<string>();
          siblings.forEach((s: any) => {
            const p = s.plateformes;
            if (Array.isArray(p)) p.forEach((item) => setPlats.add(item));
            else if (p) setPlats.add(p);
          });

          mergedPlatforms = Array.from(setPlats);
        } else {
          const p = currentGame.plateformes;
          mergedPlatforms = Array.isArray(p) ? p : p ? [p] : [];
        }

        setJeu({ ...currentGame, plateformes: mergedPlatforms });
      } catch (err) {
        console.error(err);
        setError("Erreur de connexion au serveur.");
      } finally {
        setLoading(false);
      }
    }

    fetchJeuAndSiblings();
  }, [id]);

  const plateformesSafe = React.useMemo(() => {
    if (!jeu?.plateformes) return [];
    return Array.isArray(jeu.plateformes) ? jeu.plateformes : [jeu.plateformes];
  }, [jeu]);

  const titrePrincipal = jeu?.titreComplet?.principal?.trim() || "";
  const sousTitre = jeu?.titreComplet?.sousTitre?.trim() || "";
  const titreComplet =
    titrePrincipal && sousTitre
      ? `${titrePrincipal.replace(/:$/, "").trim()} : ${sousTitre
          .replace(/^:/, "")
          .trim()}`
      : titrePrincipal || sousTitre || "";

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

  const renderSourceList = (items?: SourceItem[]) => {
    if (!items || !items.length) return null;
    return (
      <ul className="mt-2 space-y-1 text-sm text-gray-700">
        {items.map((it, idx) => {
          if (!it.titre && !it.url) return null;
          return (
            <li key={idx} className="flex items-start gap-2">
              <span className="mt-[3px] text-xs">•</span>
              <span>
                {it.titre && <span>{it.titre}</span>}
                {it.url && (
                  <>
                    {" "}
                    <a
                      href={it.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link underline break-all"
                    >
                      {it.url}
                    </a>
                  </>
                )}
              </span>
            </li>
          );
        })}
      </ul>
    );
  };

  const genresSafe: GenreItem[] =
    (jeu.genres && jeu.genres.length > 0 ? jeu.genres : []) || [];

  const recompensesSafe: string[] =
    (jeu.recompenses && jeu.recompenses.length > 0 ? jeu.recompenses : []) ||
    [];

  return (
    <div className="min-h-[80vh] bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Bandeau supérieur */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 text-white shadow-lg">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between px-6 py-10">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-white/60">
              Fiche de jeu
            </p>
            <h1 className="text-4xl md:text-5xl font-black leading-tight mt-2">
              {titreComplet || titrePrincipal || jeu.titre || "Jeu sans titre"}
            </h1>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="mx-auto max-w-6xl grid md:grid-cols-[1.4fr_0.6fr] gap-10 px-6 py-16">
        {/* Colonne gauche */}
        <div className="space-y-10">
          {/* Image */}
          <div className="relative overflow-hidden rounded-3xl shadow-md bg-gray-200">
            {jeu.imageUrl ? (
              <img
                src={jeu.imageUrl}
                alt={titreComplet || titrePrincipal || "Image du jeu"}
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400 italic">
                (Image à venir)
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-6 py-3">
              <p className="text-lg font-semibold text-white">
                {titreComplet ||
                  titrePrincipal ||
                  jeu.titre ||
                  "Jeu sans titre"}
              </p>
              <p className="text-sm text-white/70">
                {jeu.developpeurs?.[0] ?? "Développeur inconnu"}
              </p>
            </div>
          </div>

          {/* Carte de détails structurée comme le modèle */}
          <div className="rounded-3xl bg-white p-8 shadow-sm hover:shadow-md transition space-y-8">
            {/* Résumé */}
            {(jeu.resume?.fr || jeu.resume?.en || jeu.resume?.brut) && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  Résumé
                </h2>

                {jeu.resume?.fr && (
                  <div className="mb-3">
                    <h3 className="font-semibold text-gray-800 text-sm mb-1">
                      Description en français
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {jeu.resume.fr}
                    </p>
                  </div>
                )}

                {jeu.resume?.en && (
                  <div className="mb-3">
                    <h3 className="font-semibold text-gray-800 text-sm mb-1">
                      Description en anglais
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {jeu.resume.en}
                    </p>
                  </div>
                )}

                {!jeu.resume?.fr && !jeu.resume?.en && jeu.resume?.brut && (
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {jeu.resume.brut}
                  </p>
                )}
              </section>
            )}

            {/* Notes */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Notes
              </h2>

              {/* Autres éditions */}
              {jeu.resume?.notes?.autresEditions && (
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-800 text-sm mb-1">
                    Autres éditions
                  </h3>
                  <p className="text-sm text-gray-700">
                    {jeu.resume.notes.autresEditions}
                  </p>
                </div>
              )}

              {/* Étiquettes génériques */}
              {(jeu.resume?.notes?.etiquettesGeneriques?.length ?? 0) > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-800 text-sm mb-1">
                    Étiquettes génériques
                  </h3>
                  <p className="text-sm text-gray-700">
                    {jeu.resume.notes?.etiquettesGeneriques?.join(", ")}
                  </p>
                </div>
              )}

              {/* Genres / Thèmes */}
              {genresSafe.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-800 text-sm mb-1">
                    Genres / Thèmes (MobyGames) 
                  </h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {genresSafe.map((g, idx) => (
                      <li key={idx}>
                        • {g.type ? `${g.type}${g.valeur ? " : " : ""}` : ""}
                        {g.valeur}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Liens avec la culture québécoise */}
              {jeu.resume?.notes?.liensQuebec && (
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-800 text-sm mb-1">
                    Liens avec la culture québécoise
                  </h3>
                  <p className="text-sm text-gray-700">
                    {jeu.resume.notes.liensQuebec}
                  </p>
                </div>
              )}

              {/* Récompenses */}
              {recompensesSafe.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-800 text-sm mb-1">
                    Récompenses
                  </h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {recompensesSafe.map((r, idx) => (
                      <li key={idx}>• {r}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Autres remarques */}
              {jeu.autresRemarques && (
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-800 text-sm mb-1">
                    Autres remarques
                  </h3>
                  <p className="text-sm text-gray-700">{jeu.autresRemarques}</p>
                </div>
              )}

              {/* Ressources LUDOV */}
              {jeu.ressourcesLudov && jeu.ressourcesLudov.length > 0 && (
                <div className="mb-4 text-decoration-none">
                  <h3 className="font-semibold text-gray-800 text-sm mb-1">
                    Ressources LUDOV
                  </h3>
                  {renderSourceList(jeu.ressourcesLudov)}
                </div>
              )}
            </section>

            {/* 6. Sources */}
            {(jeu.documentsReference?.length ||
              jeu.critiques?.length ||
              jeu.paratextes?.length ||
              jeu.autresSources?.length) && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  Sources
                </h2>

                {/* Documents de référence */}
                {jeu.documentsReference &&
                  jeu.documentsReference.length > 0 && (
                    <div className="mb-3">
                      <h3 className="font-semibold text-gray-800 text-sm mb-1">
                        Documents de référence
                      </h3>
                      {renderSourceList(jeu.documentsReference)}
                    </div>
                  )}

                {/* Critiques et/ou couverture médiatique */}
                {jeu.critiques && jeu.critiques.length > 0 && (
                  <div className="mb-3">
                    <h3 className="font-semibold text-gray-800 text-sm mb-1">
                      Critiques et/ou couverture médiatique
                    </h3>
                    {renderSourceList(jeu.critiques)}
                  </div>
                )}

                {/* Paratextes */}
                {jeu.paratextes && jeu.paratextes.length > 0 && (
                  <div className="mb-3">
                    <h3 className="font-semibold text-gray-800 text-sm mb-1">
                      Paratextes
                    </h3>
                    {renderSourceList(jeu.paratextes)}
                  </div>
                )}

                {/* Autres sources pertinentes */}
                {jeu.autresSources && jeu.autresSources.length > 0 && (
                  <div className="mb-1">
                    <h3 className="font-semibold text-gray-800 text-sm mb-1">
                      Autres sources pertinentes
                    </h3>
                    {renderSourceList(jeu.autresSources)}
                  </div>
                )}
              </section>
            )}

            {/* 7. Crédits */}
            {jeu.resume?.notes?.credits && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Crédits
                </h2>
                <p className="text-sm text-gray-700">
                  {jeu.resume.notes.credits}
                </p>
              </section>
            )}

            {/* PDF */}
            <section className="pt-3 border-t border-gray-100">
              <a
                href={`http://72.11.148.122/api/jeux/${jeu._id}/pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white hover:bg-slate-800 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Télécharger la fiche PDF
              </a>
            </section>
          </div>
        </div>

        {/* Colonne droite : développeur + plateformes */}
        <aside className="space-y-6">
          <div className="rounded-3xl bg-white p-7 shadow-sm hover:shadow-md transition">
            {/* Titre de section */}
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Informations générales
            </h2>

            {/* Bloc infos type notice bibliographique */}
            <dl className="space-y-1 text-sm text-gray-800">
              {jeu.anneeSortie && (
                <div>
                  <dt className="font-semibold inline">Année de sortie :</dt>{" "}
                  <dd className="inline">{jeu.anneeSortie}</dd>
                </div>
              )}

              {jeu.villeDeveloppement && (
                <div>
                  <dt className="font-semibold inline">
                    Ville de développement :
                  </dt>{" "}
                  <dd className="inline">{jeu.villeDeveloppement}</dd>
                </div>
              )}

              {jeu.editeurs && jeu.editeurs.length > 0 && (
                <div>
                  <dt className="font-semibold inline">Éditeurs :</dt>{" "}
                  <dd className="inline">{jeu.editeurs.join(", ")}</dd>
                </div>
              )}

              {jeu.lieuPublication && (
                <div>
                  <dt className="font-semibold inline">Ville d’édition :</dt>{" "}
                  <dd className="inline">{jeu.lieuPublication}</dd>
                </div>
              )}

              {plateformesSafe.length > 0 && (
                <div>
                  <dt className="font-semibold inline">Plateforme :</dt>{" "}
                  <dd className="inline">{plateformesSafe.join(", ")}</dd>
                </div>
              )}

              {jeu.langue && (
                <div>
                  <dt className="font-semibold inline">Langues :</dt>{" "}
                  <dd className="inline">{jeu.langue}</dd>
                </div>
              )}
            </dl>

            {/* Séparateur visuel */}
            <div className="mt-5 h-px bg-gray-100" />

            {/* Bloc “carte projet” plus éditorial */}
            <div className="mt-4">
              <p className="text-xs uppercase font-semibold text-gray-400 tracking-wide">
                Développeur principal
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">
                {jeu.developpeurs?.[0] ?? "Inconnu"}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {jeu.anneeSortie
                  ? `Projet ${jeu.anneeSortie}`
                  : "Année inconnue"}
              </p>
            </div>

            {/* Plateformes sous forme d’icônes */}
            {plateformesSafe.length > 0 && (
              <>
                <div className="mt-5 h-px bg-gray-100" />
                <div className="mt-4">
                  <p className="text-xs uppercase font-semibold text-gray-400 tracking-wide mb-3">
                    Plateformes
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {plateformesSafe.map((p, idx) => (
                      <PlatformIcon key={idx} platformName={p} />
                    ))}
                  </div>
                </div>
              </>
            )}

            <p className="mt-6 text-xs text-gray-500 leading-snug">
              Cette fiche présente un jeu québécois archivé dans LUDOV.
            </p>
          </div>
        </aside>
      </div>

      {/* Bloc retour en bas (inchangé) */}
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
