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

  // Charger les jeux depuis l’API
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

  // Supprimer un jeu
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

  // Basculer l’affichage (cartes <-> tableau)
  const toggleAffichage = () => {
    setModeAffichage((prev) => (prev === "card" ? "compact" : "card"));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 max-w-7xl mx-auto px-6">
      {/* HEADER */}
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

      {/* CONTENU */}
      <div className="flex flex-1">
        {/* MENU LATÉRAL */}
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

        {/* LISTE DES JEUX */}
        <main className="flex-1 p-6">
          <h2 className="text-xl font-semibold mb-4">Liste des jeux</h2>

          {loading && <p>Chargement des jeux...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && jeux.length === 0 && (
            <p>Aucun jeu trouvé dans la base de données.</p>
          )}

          {!loading && !error && jeux.length > 0 && (
            <>
              {modeAffichage === "card" ? (
                // MODE "CARTE"
                <div className="grid grid-cols-2 gap-6">
                  {jeux.map((jeu) => (
                    <div
                      key={jeu._id}
                      className="group border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="relative overflow-hidden">
                        <img
                          src={jeu.imageUrl || "https://placehold.co/600x400"}
                          alt={jeu.titre}
                          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>

                      <div className="p-5">
                        <h3 className="font-bold text-xl mb-2 text-gray-800 line-clamp-1">
                          {jeu.titre}
                        </h3>

                        <div className="space-y-1 mb-4">
                          <p className="text-gray-500 text-sm flex items-center gap-2">
                            <span className="font-medium">Auteur :</span>
                            <span className="text-gray-600">
                              {jeu.developpeurs?.length
                                ? jeu.developpeurs[0]
                                : "Inconnu"}
                            </span>
                          </p>
                          {jeu.anneeSortie && (
                            <p className="text-gray-400 text-sm flex items-center gap-2">
                              <span className="font-medium">Année :</span>
                              <span>{jeu.anneeSortie}</span>
                            </p>
                          )}
                        </div>

                        <div className="flex gap-3 pt-3 border-t border-gray-100">
                          <button
                            className="flex-1 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors duration-200 text-sm font-semibold shadow-sm hover:shadow-md"
                            onClick={() =>
                              navigate(`/admin/jeux/edit/${jeu._id}`)
                            }
                          >
                            Modifier
                          </button>

                          <button
                            className="flex-1 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm font-semibold shadow-sm hover:shadow-md"
                            onClick={() => supprimerJeu(jeu._id, jeu.titre)}
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                //  MODE "TABLEAU"
                <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                  <table className="w-full border-collapse">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-4 text-left text-sm font-semibold text-gray-700 border-b-2 border-gray-200">
                          Titre
                        </th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-700 border-b-2 border-gray-200">
                          Auteur
                        </th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-700 border-b-2 border-gray-200">
                          Année
                        </th>
                        <th className="p-4 text-right text-sm font-semibold text-gray-700 border-b-2 border-gray-200">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {jeux.map((jeu, index) => (
                        <tr
                          key={jeu._id || index}
                          className="group transition-all duration-200 hover:bg-gray-50"
                        >
                          <td className="p-4 font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
                            {jeu.titre}
                          </td>

                          <td className="p-4 text-gray-600 text-sm">
                            {jeu.developpeurs?.length
                              ? jeu.developpeurs[0]
                              : "Inconnu"}
                          </td>

                          <td className="p-4 text-gray-600 text-sm">
                            {jeu.anneeSortie || "—"}
                          </td>

                          <td className="p-4">
                            <div className="flex justify-end items-center gap-2">
                              <button
                                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-all duration-200 text-sm font-semibold shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                                onClick={() =>
                                  navigate(`/admin/jeux/edit/${jeu._id}`)
                                }
                              >
                                Modifier
                              </button>

                              <button
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 text-sm font-semibold shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                                onClick={() => supprimerJeu(jeu._id, jeu.titre)}
                              >
                                Supprimer
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
