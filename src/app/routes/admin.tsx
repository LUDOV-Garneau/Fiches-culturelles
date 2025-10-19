import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function Admin() {
  const navigate = useNavigate();
  const [jeux, setJeux] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modeAffichage, setModeAffichage] = useState<"card" | "compact">("card");

  // Charger les jeux depuis l’API
  useEffect(() => {
    async function chargerJeux() {
      try {
        const response = await fetch("http://localhost:3000/jeux");
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
      const response = await fetch(`http://localhost:3000/jeux/${id}`, {
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
    <div className="min-h-screen flex flex-col bg-gray-50 w-200 mx-auto">
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
                <div className="grid grid-cols-2 gap-4">
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

                      <button
                        className="mt-1 px-3 py-1 bg-gray-800 text-white rounded hover:bg-blue-600"
                        onClick={() => navigate(`/admin/jeux/edit/${jeu._id}`)}
                      >
                        Modifier
                      </button>

                      <button
                        className="px-3 ml-1 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-700 transition"
                        onClick={() => supprimerJeu(jeu._id, jeu.titre)}
                      >
                        Supprimer
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                //  MODE "TABLEAU"
                <table className="w-full border-collapse">
                  <thead className="bg-gray-100 text-left">
                    <tr>
                      <th className="border-b p-2">Titre</th>
                      <th className="border-b p-2">Auteur</th>
                      <th className="border-b p-2">Année</th>
                      <th className="border-b p-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jeux.map((jeu, index) => (
                      <tr
                        key={jeu._id || index}
                        className="group transition-all hover:bg-gray-100 hover:shadow-sm border-b border-gray-200"
                      >
                        <td className="p-3 font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">
                          {jeu.titre}
                        </td>

                        <td className="p-3 text-gray-600">
                          {jeu.developpeurs?.length
                            ? jeu.developpeurs[0]
                            : "Inconnu"}
                        </td>

                        <td className="p-3 text-gray-600">
                          {jeu.anneeSortie || "—"}
                        </td>

                        <td className="p-3 text-right space-x-2">
                          <button
                            className="px-3 py-1 text-sm rounded bg-gray-800 text-white hover:bg-blue-600 transition"
                            onClick={() =>
                              navigate(`/admin/jeux/edit/${jeu._id}`)
                            }
                          >
                            Modifier
                          </button>

                          <button
                            className="px-3 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-700 transition"
                            onClick={() => supprimerJeu(jeu._id, jeu.titre)}
                          >
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
