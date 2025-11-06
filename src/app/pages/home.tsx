import * as React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router";
import { GameCard } from "~/components/gameCard";
import { createPortal } from "react-dom";

const TABS = [
  "Accueil",
  "Sélection de jeux",
  "Publications et ressources",
  "Revue de presse",
  "Carte vidéoludiQC",
  "Pour participer",
] as const;

type GameItem = { id: string; title: string; image?: string; href?: string };
type DecadeSection = { decade: string; items: GameItem[] };

const SECTIONS: DecadeSection[] = [
  {
    decade: "1980-1989",
    items: [
      {
        id: "tetards",
        title: "Têtards (Marc-Antoine Parent & Vincent Côté, 1982)",
      },
      { id: "mimi", title: "Mimi: Les aventures de Mimi la fourmi (1984)" },
      { id: "fou-du-roi", title: "Le fou du roi (Loto-Québec, 1989)" },
    ],
  },
  {
    decade: "1990-1999",
    items: [
      { id: "game-1990", title: "Jeu 1990 – Lorem" },
      { id: "game-1994", title: "Jeu 1994 – Ipsum" },
      { id: "game-1998", title: "Jeu 1998 – Dolor" },
    ],
  },
  {
    decade: "2000-2009",
    items: [
      { id: "fez", title: "FEZ (placeholder)" },
      { id: "game-2005", title: "Jeu 2005 – Consectetur" },
      { id: "game-2009", title: "Jeu 2009 – Adipiscing" },
    ],
  },
];

function Tabs({
  active,
  onChange,
}: {
  active: number;
  onChange: (index: number) => void;
}) {
  return (
    <nav className="flex flex-wrap justify-center gap-2">
      {TABS.map((label, i) => {
        const isActive = i === active;
        return (
          <button
            key={label}
            onClick={() => onChange(i)}
            className={[
              "px-5 py-2 rounded-md border transition",
              isActive
                ? "bg-[--color-primary-blue] border-[--color-primary-blue] text-white"
                : "bg-white border-gray-300 text-gray-700 hover:bg-[--color-primary-blue-10]",
            ].join(" ")}
          >
            {label}
          </button>
        );
      })}
    </nav>
  );
}

function AccordionSection({
  decade,
  jeux,
  open,
  onToggle,
}: {
  decade: string;
  jeux: any[];
  open: boolean;
  onToggle: () => void;
}) {
  // filtrage selon date (backlog)
  const start = parseInt(decade.split("-")[0]);
  const end = parseInt(decade.split("-")[1]);
  const jeuxDecennie = jeux.filter(
    (j) => j.anneeSortie >= start && j.anneeSortie <= end
  );

  return (
    <div className="rounded-md border bg-white overflow-visible">
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-3 border-b bg-gray-50 px-4 py-3 text-left hover:bg-gray-100"
      >
        <span
          className={[
            "inline-flex h-5 w-5 items-center justify-center rounded-sm border",
            open
              ? "border-gray-700 bg-gray-700 text-white"
              : "border-gray-400 bg-white text-gray-700",
          ].join(" ")}
        >
          {open ? "−" : "+"}
        </span>
        <span className="font-semibold text-gray-800">{decade}</span>
      </button>

      {open && (
        <div className="p-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {jeuxDecennie.length === 0 ? (
            <p>Aucun jeu</p>
          ) : (
            jeuxDecennie.map((jeu) => (
              <Link
                key={jeu._id}
                to={`/games/${jeu._id}`}
                className="border border-gray-300 rounded-lg p-3 bg-white shadow-sm hover:shadow-md transition block"
              >
                <img
                  src={jeu.imageUrl || "https://placehold.co/600x400"}
                  alt={jeu.titre}
                  className="mb-2 h-40 w-full rounded object-cover"
                />
                <h3 className="text-lg font-bold">{jeu.titre}</h3>
                <p className="text-sm text-gray-400">
                  {jeu.anneeSortie ? `Année : ${jeu.anneeSortie}` : ""}
                </p>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function CoverflowCarousel({ jeux }: { jeux: any[] }) {
  const [active, setActive] = useState(0);
  const len = jeux.length;
  const prev = () => setActive((i) => (i - 1 + len) % len);
  const next = () => setActive((i) => (i + 1) % len);

  const [hovered, setHovered] = useState<string | null>(null);
  const [popupPos, setPopupPos] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  useEffect(() => {
    const id = setInterval(next, 3500);

    //pour arreter slider
    const stop = setTimeout(() => clearInterval(id), 20000);

    return () => clearInterval(id);
  }, [len]);

  const CARD_W = 218;
  const CARD_H = 288;
  const TRACK_H = 320;
  const GAP_X = 200;

  return (
    <div className="relative py-8">
      <div className="mx-auto max-w-5xl md:max-w-6xl px-4">
        <div
          className="relative mx-auto max-w-4xl"
          style={{ perspective: "1200px", height: TRACK_H }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            {jeux.slice(0, 10).map((jeu, i) => {
              const offset = i - active;
              const wrapped =
                Math.abs(offset) > len / 2
                  ? offset > 0
                    ? offset - len
                    : offset + len
                  : offset;

              const translateX = wrapped * GAP_X;
              const rotateY = wrapped * -18;
              const scale = 1.18 - Math.min(Math.abs(wrapped) * 0.12, 0.24);
              const zIndex = 100 - Math.abs(wrapped);

              return (
                <Link
                  key={jeu._id}
                  to={`/games/${jeu._id}`}
                  className="absolute top-1/2 -translate-y-1/2 rounded-lg shadow-md overflow-hidden bg-gray-200"
                  style={{
                    width: CARD_W,
                    height: CARD_H,
                    transform: `translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg)`,
                    transformStyle: "preserve-3d",
                    zIndex,
                  }}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setHovered(jeu._id);
                    setPopupPos({
                      top: rect.top + rect.height / 2,
                      left: rect.right + 10,
                    });
                  }}
                  onMouseLeave={() => setHovered(null)}
                >
                  <img
                    src={
                      jeu.imageUrl || "https://placehold.co/600x400?text=Jeu"
                    }
                    alt={jeu.titre}
                    className="h-full w-full object-cover"
                  />

                  {hovered === jeu._id &&
                    createPortal(
                      <div
                        className="fixed z-[9999] rounded-lg bg-black p-4 text-white shadow-lg"
                        style={{
                          top: popupPos.top,
                          left: popupPos.left,
                          transform: "translateY(-50%)",
                          minWidth: "180px",
                          maxWidth: "400px",
                        }}
                      >
                        <p className="font-semibold">{jeu.titre}</p>
                        <p className="text-sm opacity-80">
                          Auteur : {jeu.developpeurs?.[0] || "Inconnu"}
                        </p>
                        <p className="mt-1 text-xs opacity-70">
                          {jeu.anneeSortie ? `Année : ${jeu.anneeSortie}` : ""}
                        </p>
                      </div>,
                      document.body
                    )}

                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1 text-center text-xs text-white">
                    {jeu.titre}
                    {jeu.anneeSortie ? ` • ${jeu.anneeSortie}` : ""}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contrôles */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          onClick={prev}
          className="rounded border border-gray-300 bg-white px-3 py-2 hover:bg-[--color-primary-blue-10]"
        >
          ◀
        </button>
        <div className="flex gap-1">
          {jeux.slice(0, 10).map((_, i) => (
            <span
              key={i}
              className={[
                "inline-block h-2 w-2 rounded-full",
                i === active ? "bg-[--color-primary-blue]" : "bg-gray-300",
              ].join(" ")}
            />
          ))}
        </div>
        <button
          onClick={next}
          className="rounded border border-gray-300 bg-white px-3 py-2 hover:bg-[--color-primary-blue-10]"
        >
          ▶
        </button>
      </div>
    </div>
  );
}

export function Welcome() {
  const [activeTab, setActiveTab] = useState<number>(1);
  const [openByDecade, setOpenByDecade] = useState<Record<string, boolean>>(
    () =>
      SECTIONS.reduce<Record<string, boolean>>((acc, s, idx) => {
        acc[s.decade] = idx === 0;
        return acc;
      }, {})
  );

  const [jeux, setJeux] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const JEUX_PAR_PAGE = 9;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [popupPos, setPopupPos] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  useEffect(() => {
    async function chargerJeux() {
      try {
        const response = await fetch("http://72.11.148.122/api/jeux");
        const data = await response.json();
        if (data.success) setJeux(data.data);
        else
          setError("Impossible de charger les jeux depuis la base de données.");
      } catch {
        setError("Erreur de connexion avec le serveur.");
      } finally {
        setLoading(false);
      }
    }
    chargerJeux();
  }, []);

  const toggleDecade = (key: string) =>
    setOpenByDecade((prev) => ({ ...prev, [key]: !prev[key] }));

  const totalPages = Math.max(1, Math.ceil(jeux.length / JEUX_PAR_PAGE));
  const indexOfLast = page * JEUX_PAR_PAGE;
  const indexOfFirst = indexOfLast - JEUX_PAR_PAGE;
  const jeuxActuels = jeux.slice(indexOfFirst, indexOfLast);

  return (
    <main className="min-h-[70vh]">
      <section className="border-y bg-gray-100">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <h1 className="text-3xl font-semibold text-gray-800 md:text-4xl">
            Le jeu vidéo au Québec
          </h1>
          <div className="mt-6">
            <Tabs active={activeTab} onChange={setActiveTab} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        {activeTab === 0 && (
          <div className="prose max-w-none">
            <p>Contenu d’accueil (placeholder).</p>
          </div>
        )}
        {activeTab === 1 && (
          <div className="space-y-12">
            <header className="space-y-2">
              <h2 className="text-2xl font-semibold text-gray-900">
                50 jeux vidéo québécois
              </h2>
              <p className="text-gray-700">
                Le projet archivera la jouabilité de 50 jeux vidéo québécois
                selon le protocole établi (voir{" "}
                <a
                  href="#"
                  className="text-[--color-primary-blue] underline hover:text-[--color-primary-blue-90]"
                >
                  Publications et ressources
                </a>
                ). Le travail est en cours — une première sélection de 30 jeux à
                archiver et des fiches préliminaires peuvent être consultées{" "}
                <a
                  href="#"
                  className="text-[--color-primary-blue] underline hover:text-[--color-primary-blue-90]"
                >
                  ici
                </a>
                .
              </p>
            </header>

            <CoverflowCarousel jeux={jeux} />

            <div className="space-y-4">
              {SECTIONS.map((s) => (
                <AccordionSection
                  key={s.decade}
                  decade={s.decade}
                  jeux={jeux}
                  open={!!openByDecade[s.decade]}
                  onToggle={() => toggleDecade(s.decade)}
                />
              ))}

              <h2 className="pt-10 text-3xl font-semibold text-gray-900">
                Nos collections
              </h2>

              {loading && <p>Chargement des jeux...</p>}
              {error && <p className="text-red-500">{error}</p>}
              {!loading && !error && jeux.length === 0 && (
                <p>Aucun jeu trouvé dans la base de données.</p>
              )}

              {!loading && !error && jeux.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {jeuxActuels.map((jeu) => (
                    <div
                      key={jeu._id}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setHovered(jeu._id);
                        setPopupPos({
                          top: rect.top + rect.height / 2,
                          left: rect.right + 10,
                        });
                      }}
                      onMouseLeave={() => setHovered(null)}
                      className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition"
                    >
                      <img
                        src={jeu.imageUrl || "https://placehold.co/600x400"}
                        alt={jeu.titre}
                        className="mb-2 h-40 w-full rounded object-cover"
                      />
                      <h3 className="text-lg font-bold">{jeu.titre}</h3>
                      <p className="mb-1 text-gray-500">
                        Auteur :{" "}
                        {jeu.developpeurs?.length
                          ? jeu.developpeurs[0]
                          : "Inconnu"}
                      </p>
                      <p className="text-sm text-gray-400">
                        {jeu.anneeSortie ? `Année : ${jeu.anneeSortie}` : ""}
                      </p>
                      {/*Carte des details quand on hover*/}
                      {hovered === jeu._id &&
                        createPortal(
                          <div
                            className="fixed bg-black text-white p-4 rounded-lg shadow-lg z-[9999]"
                            style={{
                              top: popupPos.top,
                              left: popupPos.left,
                              transform: "translateY(-50%)",
                              minWidth: "180px",
                              maxWidth: "400px",
                            }}
                          >
                            <p>{jeu.titre}</p>
                            <p>
                              Lorem ipsum dolor sit amet consectetur adipisicing
                              elit. Praesentium quasi deserunt, aspernatur
                              corporis libero dolore quod quidem voluptas et
                              delectus fugit est placeat corrupti illo ex ipsa
                              consectetur! Quasi, repellendus?
                            </p>
                          </div>,
                          document.body
                        )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        
{/* Pagination */}
<div className="flex justify-center items-center gap-4 mt-6">
  <button
    onClick={() => setPage((p) => Math.max(p - 1, 1))}
    disabled={page === 1}
    className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
  >
    Précédent
  </button>

  <span className="text-gray-700 font-medium">
    Page {page} / {totalPages}
  </span>

  <button
    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
    disabled={page === totalPages}
    className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
  >
    Suivant
  </button>
</div>


        {activeTab === 2 && (
          <div className="prose max-w-none">
            <h2>Publications et ressources</h2>
            <p>lien vers WordPress.</p>
          </div>
        )}

        {activeTab === 3 && (
          <div className="prose max-w-none">
            <h2>Revue de presse</h2>
            <p>lien vers WordPress.</p>
          </div>
        )}

        {activeTab === 4 && (
          <div className="prose max-w-none">
            <h2>Carte vidéoludiQC</h2>
            <p>lien vers WordPress.</p>
          </div>
        )}

        {activeTab === 5 && (
          <div className="prose max-w-none">
            <h2>Pour participer</h2>
            <p>lien vers WordPress.</p>
          </div>
        )}
      </section>
    </main>
  );
}

export default Welcome;
