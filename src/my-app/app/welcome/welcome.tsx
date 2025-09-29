import * as React from "react";

/** ========= Données  j ai hard coder pour le moment ========= */
const TABS = [
  "Accueil",
  "Sélection de jeux",
  "Publications et ressources",
  "Revue de presse",
  "Carte vidéoludiQC",
  "Pour participer",
] as const;

type GameItem = { id: string; title: string; image?: string; href?: string };

type DecadeSection = {
  decade: string;
  items: GameItem[];
};

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

/**  Composants */
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
                ? "bg-primary-blue border-primary-blue text-white"
                : "bg-white border-gray-300 text-gray-700 hover:bg-primary-blue-10",
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
      {/* Placeholder image:  */}
      <a
        href={item.href || "#"}
        className="block w-[220px] h-[160px] bg-gray-200 rounded shadow-sm hover:shadow md:w-[260px] md:h-[180px]"
        aria-label={item.title}
      >
        {item.image ? (
       
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover rounded"
          />
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

/** Page Welcome ( jeu video) */
export function Welcome() {
  // Onglet Sélection de jeux actif par défaut 
  const [activeTab, setActiveTab] = React.useState<number>(1);

  // Accordeon ( la liste des jeux qui saffiche): premier ouvert par défaut
  const [openByDecade, setOpenByDecade] = React.useState<Record<string, boolean>>(
    () =>
      SECTIONS.reduce<Record<string, boolean>>((acc, s, idx) => {
        acc[s.decade] = idx === 0; // premier ouvert
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
            <p>
              contenu d’accueil (placeholder). 
            </p>
          </div>
        )}

        {activeTab === 1 && (
          <div className="space-y-6">
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
            <p>lien vers word press.</p>
          </div>
        )}
        {activeTab === 3 && (
          <div className="prose max-w-none">
            <h2>Revue de presse</h2>
            <p>lien vers word press.</p>
          </div>
        )}
        {activeTab === 4 && (
          <div className="prose max-w-none">
            <h2>Carte vidéoludiQC</h2>
            <p>lien vers word press.</p>
          </div>
        )}
        {activeTab === 5 && (
          <div className="prose max-w-none">
            <h2>Pour participer</h2>
            <p>lien vers word press.</p>
          </div>
        )}
      </section>

      {/* Pied de page local (si pas déjà global) */}
      {/*<section className="border-t">
        <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-gray-600">
          © Copyright {new Date().getFullYear()} LUDOV (Laboratoire
          universitaire de documentation et d’observation vidéoludiques) – Tous
          droits réservés
        </div>
      </section>*/}
    </main>
  );
}

export default Welcome;
