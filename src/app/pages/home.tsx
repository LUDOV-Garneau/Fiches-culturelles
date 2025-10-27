import { useState, useEffect } from "react";
import { GameCard } from "~/components/gameCard";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function chargerJeux() {
      try {
        const response = await fetch("http://72.11.148.122/api/jeux");
        // const response = await fetch("http://localhost:3000/jeux");
        const data = await response.json();
        if (data.success) {
          setJeux(data.data);
        } else {
          setError("Impossible de charger les jeux depuis la base de données.");
        }
      } catch(error) {
        setError("Erreur de connexion avec le serveur. ");
      } finally {
        setLoading(false);
      }
    }
    chargerJeux();
  }, []);

  const toggleDecade = (key: string) =>
    setOpenByDecade((prev) => ({ ...prev, [key]: !prev[key] }));

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
              
              <h2 className="pt-10 text-3xl font-semibold text-gray-900">Tout nos jeux</h2>

              {loading && <p>Chargement des jeux...</p>}
              {error && <p className="text-red-500">{error}</p>}
              {!loading && !error && jeux.length === 0 && (
                <p>Aucun jeu trouvé dans la base de données.</p>
              )}

              {!loading && !error && jeux.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {jeux.map((jeu) => (
                    <div
                      key={jeu._id}
                      className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition"
                    >
                      <img
                        src={jeu.imageUrl || "https://placehold.co/600x400"}
                        alt={jeu.titre}
                        className="w-full h-40 object-cover rounded mb-2"
                      />
                      <h3 className="font-bold text-lg">{jeu.titre}</h3>
                      <p className="text-gray-500 mb-1">
                        Auteur :{" "}
                        {jeu.developpeurs?.length
                          ? jeu.developpeurs[0]
                          : "Inconnu"}
                      </p>
                      <p className="text-gray-400 text-sm mb-2">
                        {jeu.anneeSortie ? `Année : ${jeu.anneeSortie}` : ""}
                      </p>
                    </div>
                  ))}
                </div>
              )}
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
    <div className="overflow-hidden rounded-md border bg-white">
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

export default Welcome;
