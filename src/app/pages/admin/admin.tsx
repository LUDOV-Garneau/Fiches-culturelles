import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function Admin() {
  const navigate = useNavigate();
  const [jeux, setJeux] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modeAffichage, setModeAffichage] = useState<"card" | "compact">(
    "card",
  );
  const jeuxChoisis = jeux.filter((j) => j.estChoisi);
  const jeuxNonChoisis = jeux.filter((j) => !j.estChoisi);

  useEffect(() => {
    async function chargerJeux() {
      try {
        const response = await fetch("http://72.11.148.122/api/jeux");
        const data = await response.json();

        if (data.success) {
          setJeux(data.data);
        } else {
          setError("Impossible de charger les jeux depuis la base de données.");
        }
      } catch (err) {
        console.error(err);
        setError("Erreur de connexion avec le serveur.");
      } finally {
        setLoading(false);
      }
    }

    chargerJeux();
  }, []);

  async function supprimerJeu(id: string, titre: string) {
    if (!window.confirm(`Supprimer "${titre}" ?`)) return;

    try {
      const response = await fetch(`http://72.11.148.122/api/jeux/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.success) {
        setJeux((prev) => prev.filter((j) => j._id !== id));
        alert(`"${titre}" supprimé avec succès.`);
      } else {
        alert("Erreur : " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Erreur de suppression côté serveur.");
    }
  }

  async function toggleChoisi(id: string, estChoisiActuel: boolean) {
    try {
      const response = await fetch(`http://72.11.148.122/api/jeux/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ estChoisi: !estChoisiActuel }),
      });

      const data = await response.json();
      console.log(data);

      if (data.success) {
        setJeux((prev) =>
          prev.map((j) =>
            j._id === id ? { ...j, estChoisi: !estChoisiActuel } : j,
          ),
        );
      } else {
        alert("Erreur : " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour du jeu.");
    }
  }

  const toggleAffichage = () => {
    setModeAffichage((prev) => (prev === "card" ? "compact" : "card"));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 max-w-7xl mx-auto px-6">
      <div className="p-3 bg-gray-800 text-white flex justify-between items-center">
        <h1 className="text-2xl font-bold">Page Admin</h1>
        <div className="space-x-3">
          <button onClick={toggleAffichage} className="btn-primary">
            {modeAffichage === "card" ? "Mode détaillé" : "Mode carte"}
          </button>
          <button onClick={() => navigate("/")} className="btn-primary">
            Retour
          </button>
        </div>
      </div>

      <div className="flex flex-1">
        <aside className="w-1/4 bg-white border-r border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">Menu</h2>
          <ul className="space-y-3">
            <li>
              <button
                onClick={() => navigate("/admin/jeux/ajouter")}
                className="w-full text-left px-3 py-2 bg-blue-100 hover:bg-blue-200 rounded"
              >
                Ajouter un jeu
              </button>
            </li>
          </ul>
        </aside>

        <main className="flex-1 p-6">
          {loading && <p>Chargement des jeux...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && jeux.length === 0 && (
            <p>Aucun jeu trouvé dans la base de données.</p>
          )}

          {!loading && !error && jeux.length > 0 && (
            <>
              <section className="mb-10">
                <h3 className="text-lg font-bold mb-3 text-green-700">
                  Jeux sélectionnés ({jeuxChoisis.length})
                </h3>

                {jeuxChoisis.length === 0 ? (
                  <p className="text-gray-500 italic">
                    Aucun jeu n'a encore été sélectionné.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-6">
                    {jeuxChoisis.map((jeu) => (
                      <div
                        key={jeu._id}
                        className="border-2 border-green-400 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        <div className="relative overflow-hidden">
                          <img
                            src={jeu.imageUrl || "https://placehold.co/600x400"}
                            alt={jeu.titre}
                            className="w-full h-48 object-cover"
                          />
                          <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">
                            Sélectionné
                          </span>
                        </div>

                        <div className="p-4">
                          <h4 className="font-bold text-lg mb-1">
                            {jeu.titre}
                          </h4>
                          <p className="text-sm text-gray-500 mb-3">
                            {jeu.developpeurs?.[0] || "Inconnu"} —{" "}
                            {jeu.anneeSortie || "—"}
                          </p>

                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                navigate(`/admin/jeux/edit/${jeu._id}`)
                              }
                              className="flex-1 bg-gray-800 text-white text-sm rounded-lg py-2 hover:bg-gray-900"
                            >
                              Modifier
                            </button>

                            <button
                              onClick={() => toggleChoisi(jeu._id, true)}
                              className="flex-1 bg-yellow-500 text-white text-sm rounded-lg py-2 hover:bg-yellow-600"
                            >
                              Retirer
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section>
                <h3 className="text-lg font-bold mb-3 text-gray-700">
                  Jeux disponibles ({jeuxNonChoisis.length})
                </h3>

                {jeuxNonChoisis.length === 0 ? (
                  <p className="text-gray-500 italic">
                    Tous les jeux ont été sélectionnés.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-6">
                    {jeuxNonChoisis.map((jeu) => (
                      <div
                        key={jeu._id}
                        className="border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-lg transition-all duration-300"
                      >
                        <div className="relative overflow-hidden">
                          <img
                            src={jeu.imageUrl || "https://placehold.co/600x400"}
                            alt={jeu.titre}
                            className="w-full h-48 object-cover"
                          />
                        </div>

                        <div className="p-4">
                          <h4 className="font-bold text-lg mb-1">
                            {jeu.titre}
                          </h4>
                          <p className="text-sm text-gray-500 mb-3">
                            {jeu.developpeurs?.[0] || "Inconnu"} —{" "}
                            {jeu.anneeSortie || "—"}
                          </p>

                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                navigate(`/admin/jeux/edit/${jeu._id}`)
                              }
                              className="flex-1 bg-gray-800 text-white text-sm rounded-lg py-2 hover:bg-gray-900"
                            >
                              Modifier
                            </button>

                            <button
                              onClick={() => toggleChoisi(jeu._id, false)}
                              className="flex-1 bg-green-600 text-white text-sm rounded-lg py-2 hover:bg-green-700"
                            >
                              Ajouter
                            </button>

                            <button
                              onClick={() => supprimerJeu(jeu._id, jeu.titre)}
                              className="flex-1 bg-red-600 text-white text-sm rounded-lg py-2 hover:bg-red-700"
                            >
                              Supprimer
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
