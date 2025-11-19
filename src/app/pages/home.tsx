import { useState, useEffect } from "react";
import { CoverflowCarousel } from "../components/CoverflowCaroussel";
import JeuxGrid from "../components/LstJeux";
import Tabs from "../components/Tabs";

const LUDOV_DOC_URL =
  "https://www.ludov.ca/fr/documentation/le-jeu-video-au-quebec/";

export function Welcome() {
  const [activeTab, setActiveTab] = useState<number>(1);
  const [jeux, setJeux] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

 
  const handleTabChange = (index: number) => {
   
    if (index === 1) {
      setActiveTab(index);
      return;
    }

    
    window.location.href = LUDOV_DOC_URL;
  };

  return (
    <main className="min-h-[70vh]">
      {/* SECTION TITRE PRINCIPAL */}
      <section>
        <div className="mx-auto max-w-6xl px-4 py-10">
          <h2
            style={{
              fontFamily: '"Roboto", sans-serif',
              fontSize: "30px",
              fontWeight: 300,
              color: "#5e5e5eff",
              lineHeight: 1.3,
              marginBottom: "20px",
            }}
          >
            Le jeu vidéo au Québec
          </h2>

          {/* TABS */}
          <div
            className="mt-6"
            style={{
              fontFamily: '"Roboto", sans-serif',
              fontSize: "15px",
              fontWeight: 400,
              color: "#4f4f4f",
              lineHeight: 1.5,
            }}
          >
            <Tabs active={activeTab} onChange={handleTabChange} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        {activeTab === 0 && (
          <div
            style={{
              fontFamily: '"Roboto", sans-serif',
              fontSize: "15px",
              color: "#4f4f4f",
              lineHeight: 1.5,
            }}
          >
            <p>Contenu d’accueil (placeholder).</p>
          </div>
        )}

        {activeTab === 1 && (
          <div className="space-y-12">
            <header className="space-y-2">
              <h2
                style={{
                  fontFamily: '"Roboto", sans-serif',
                  fontSize: "24px",
                  fontWeight: 600,
                  color: "#333333",
                  lineHeight: 1.3,
                }}
              >
                50 jeux vidéo québécois
              </h2>

              <p
                style={{
                  fontFamily: '"Roboto", sans-serif',
                  fontSize: "15px",
                  fontWeight: 400,
                  color: "#4f4f4f",
                  lineHeight: 1.5,
                }}
              >
                Le projet archivera la jouabilité de 50 jeux vidéo québécois
                selon le protocole établi (voir{" "}
                <a href="#" className="underline" style={{ color: "#02cfd8" }}>
                  Publications et ressources
                </a>
                ). Le travail est en cours — une première sélection de 30 jeux à
                archiver et des fiches préliminaires peuvent être consultées{" "}
                <a href="#" className="underline" style={{ color: "#02cfd8" }}>
                  ici
                </a>
                .
              </p>
            </header>

            <CoverflowCarousel jeux={jeux} />
            <JeuxGrid jeux={jeux} loading={loading} error={error} />
          </div>
        )}

        {activeTab === 2 && (
          <div
            style={{
              fontFamily: '"Roboto", sans-serif',
              fontSize: "15px",
              color: "#4f4f4f",
              lineHeight: 1.5,
            }}
          >
            <h2>Publications et ressources</h2>
            <p>lien vers WordPress.</p>
          </div>
        )}

        {activeTab === 3 && (
          <div
            style={{
              fontFamily: '"Roboto", sans-serif',
              fontSize: "15px",
              color: "#4f4f4f",
              lineHeight: 1.5,
            }}
          >
            <h2>Revue de presse</h2>
            <p>lien vers WordPress.</p>
          </div>
        )}

        {activeTab === 4 && (
          <div
            style={{
              fontFamily: '"Roboto", sans-serif',
              fontSize: "15px",
              color: "#4f4f4f",
              lineHeight: 1.5,
            }}
          >
            <h2>Carte vidéoludiQC</h2>
            <p>lien vers WordPress.</p>
          </div>
        )}

        {activeTab === 5 && (
          <div
            style={{
              fontFamily: '"Roboto", sans-serif',
              fontSize: "15px",
              color: "#4f4f4f",
              lineHeight: 1.5,
            }}
          >
            <h2>Pour participer</h2>
            <p>lien vers WordPress.</p>
          </div>
        )}
      </section>
    </main>
  );
}

export default Welcome;
