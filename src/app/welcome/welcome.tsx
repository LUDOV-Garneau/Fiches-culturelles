import * as React from "react";

/** ========= Données (hardcodées pour le moment) ========= */
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
      { id: "g1", title: "Têtards (Marc-Antoine Parent & Vincent Côté, 1982)" },
      { id: "g2", title: "Mimi: Les aventures de Mimi la fourmi (1984)" },
      { id: "g3", title: "Le fou du roi (Loto-Québec, 1989)" },
    ],
  },
  {
    decade: "1990-1999",
    items: [
      { id: "g4", title: "Jeu 1990 – Lorem" },
      { id: "g5", title: "Jeu 1994 – Ipsum" },
      { id: "g6", title: "Jeu 1998 – Dolor" },
    ],
  },
  {
    decade: "2000-2009",
    items: [
      { id: "g7", title: "Jeu 2001 – Sit amet" },
      { id: "g8", title: "Jeu 2005 – Consectetur" },
      { id: "g9", title: "Jeu 2009 – Adipiscing" },
    ],
  },
];

/** ========= Carousel (coverflow) ========= */
type CarouselItem = { id: string; title: string; year?: number; image?: string; href?: string };

const CAROUSEL_ITEMS: CarouselItem[] = [
  { id: "c1", title: "Têtards", year: 1982 },
  { id: "c2", title: "Mimi la fourmi", year: 1984 },
  { id: "c3", title: "Le fou du roi", year: 1989 },
  { id: "c4", title: "Titre 1990", year: 1990 },
  { id: "c5", title: "Titre 1994", year: 1994 },
  { id: "c6", title: "Titre 1998", year: 1998 },
];

/** ========= Composants ========= */

function Tabs({
  active,
  onChange,
}: {
  active: number;
  onChange: (index: number) => void;
}) {
  return (
    <nav className="flex flex-wrap gap-2 justify-center">
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

function GameCard({ item }: { item: GameItem }) {
  return (
    <article className="flex flex-col items-center">
      {/* Placeholder image (remplacera par item.image plus tard) */}
      <a
        href={item.href || "#"}
        className="block w-[220px] h-[160px] bg-gray-200 rounded shadow-sm hover:shadow md:w-[260px] md:h-[180px]"
        aria-label={item.title}
      >
        {item.image ? (
          <img src={item.image} alt={item.title} className="w-full h-full object-cover rounded" />
        ) : null}
      </a>
      <div className="mt-3 bg-white border rounded p-3 text-sm text-gray-800 max-w-[260px] text-center">
        {item.title}
      </div>
    </article>
  );
}

function AccordionSection({
  section,
  open,
  onToggle,
}: {
  section: DecadeSection;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border rounded-md overflow-hidden bg-white">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 border-b"
      >
        <span
          className={[
            "inline-flex h-5 w-5 items-center justify-center rounded-sm border",
            open
              ? "bg-gray-700 text-white border-gray-700"
              : "bg-white text-gray-700 border-gray-400",
          ].join(" ")}
        >
          {open ? "−" : "+"}
        </span>
        <span className="font-semibold text-gray-800">{section.decade}</span>
      </button>

      {open && (
        <div className="p-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {section.items.map((g) => (
              <GameCard key={g.id} item={g} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/** Carousel style coverflow */
function CoverflowCarousel({ items }: { items: CarouselItem[] }) {
  const [active, setActive] = React.useState(0);
  const len = items.length;

  const prev = () => setActive((i) => (i - 1 + len) % len);
  const next = () => setActive((i) => (i + 1) % len);

 
  React.useEffect(() => {
    const id = setInterval(next, 3500);
    return () => clearInterval(id);
  }, [len]);

  // Dimensions (~+20%)
  const CARD_W = 216;     
  const CARD_H = 288;     
  const TRACK_H = 320;   
  const GAP_X   = 200;    

  return (
    <div className="relative py-8">
      
      <div className="mx-auto max-w-5xl md:max-w-6xl px-4">
       
        <div className="relative mx-auto max-w-4xl" style={{ perspective: "1200px", height: TRACK_H }}>
          <div className="absolute inset-0 flex items-center justify-center">
            {items.map((it, i) => {
              const offset = i - active;

              // wrap pour boucle
              const wrapped =
                Math.abs(offset) > len / 2
                  ? offset > 0
                    ? offset - len
                    : offset + len
                  : offset;

           
              const translateX = wrapped * GAP_X;
              const rotateY = wrapped * -18;

              // centre plus grand
              const scale = 1.18 - Math.min(Math.abs(wrapped) * 0.12, 0.24);
              const zIndex = 100 - Math.abs(wrapped);

              return (
                <button
                  key={it.id}
                  onClick={() => setActive(i)}
                  className="absolute top-1/2 -translate-y-1/2 rounded-lg shadow-md overflow-hidden focus:outline-none bg-gray-200"
                  style={{
                    width: CARD_W,
                    height: CARD_H,
                    transform: `translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg)`,
                    transformStyle: "preserve-3d",
                    zIndex,
                  }}
                  aria-label={`${it.title}${it.year ? ` (${it.year})` : ""}`}
                >
                  {it.image ? (
                    <img
                      src={it.image}
                      alt={it.title}
                      className="w-full h-full object-cover"
                    />
                  ) : null}

                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs px-2 py-1 text-center">
                    {it.title}
                    {it.year ? ` • ${it.year}` : ""}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contrôles */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          onClick={prev}
          className="px-3 py-2 rounded border bg-white hover:bg-[--color-primary-blue-10] border-gray-300"
        >
          ◀
        </button>
        <div className="flex gap-1">
          {items.map((_, i) => (
            <span
              key={i}
              className={[
                "inline-block w-2 h-2 rounded-full",
                i === active ? "bg-[--color-primary-blue]" : "bg-gray-300",
              ].join(" ")}
            />
          ))}
        </div>
        <button
          onClick={next}
          className="px-3 py-2 rounded border bg-white hover:bg-[--color-primary-blue-10] border-gray-300"
        >
          ▶
        </button>
      </div>
    </div>
  );
}

/** ========= Page Welcome (jeu vidéo) ========= */
export function Welcome() {
  // Onglet “Sélection de jeux” actif par défaut
  const [activeTab, setActiveTab] = React.useState<number>(1);

  // Accordéon : première section ouverte par défaut
  const [openByDecade, setOpenByDecade] = React.useState<Record<string, boolean>>(
    () =>
      SECTIONS.reduce<Record<string, boolean>>((acc, s, idx) => {
        acc[s.decade] = idx === 0;
        return acc;
      }, {})
  );

  const toggleDecade = (key: string) =>
    setOpenByDecade((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <main className="min-h-[70vh]">
      {/* Bandeau + onglets */}
      <section className="bg-gray-100 border-y">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-800">
            Le jeu vidéo au Québec
          </h1>

          <div className="mt-6">
            <Tabs active={activeTab} onChange={setActiveTab} />
          </div>
        </div>
      </section>

      {/* Contenu par onglet */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        {activeTab === 0 && (
          <div className="prose max-w-none">
            <p>Contenu d’accueil (placeholder).</p>
          </div>
        )}

        {activeTab === 1 && (
          <div className="space-y-12">{/* <-- plus d'espace entre blocs */}
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

            {/* ==== CAROUSEL COVERFLOW  ==== */}
            <CoverflowCarousel items={CAROUSEL_ITEMS} />

            {/* ==== SECTIONS PAR DÉCENNIES ==== */}
            <div className="space-y-4">
              {SECTIONS.map((s) => (
                <AccordionSection
                  key={s.decade}
                  section={s}
                  open={!!openByDecade[s.decade]}
                  onToggle={() => toggleDecade(s.decade)}
                />
              ))}
            </div>
          </div>
        )}

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
