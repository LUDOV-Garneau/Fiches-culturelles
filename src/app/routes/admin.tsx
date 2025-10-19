import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function Admin() {
  const navigate = useNavigate();
  const [jeux, setJeux] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modeAffichage, setModeAffichage] = useState<"card" | "compact">(
    "card"
  );

  useEffect(() => {
    // 💾 Jeux simulés
    const jeuxFictifs = [
      { id: 1, nom: "The Messenger", genre: "Action / Plateforme" },
      { id: 2, nom: "Kona", genre: "Aventure narrative" },
      { id: 3, nom: "Tadpole Tap", genre: "Arcade" },
      { id: 4, nom: "Jersey Devil", genre: "Plateforme 3D" },
      {
        id: 5,
        nom: "Sang-Froid : Un conte de loups-garous",
        genre: "Stratégie / Action",
      },
      { id: 6, nom: "Army of Two", genre: "Tir coopératif" },
    ];

    setTimeout(() => {
      setJeux(jeuxFictifs);
      setLoading(false);
    }, 800);
  }, []);

  const toggleAffichage = () => {
    setModeAffichage((prev) => (prev === "card" ? "compact" : "card"));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 w-200 mx-auto">
      {/* Header */}
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
              <button className="w-full text-left px-3 py-2 bg-blue-100 hover:bg-blue-200 rounded">
                Ajouter un jeu
              </button>
            </li>
          </ul>
        </aside>

        <main className="flex-1 p-6">
          <h2 className="text-xl font-semibold mb-4">Liste des jeux</h2>
          <button className=" space-y-3 btn-primary mb-4">
            Voir tous les jeux dans la base de données
          </button>

          {loading && <p>Chargement des jeux...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && (
            <>
              {modeAffichage === "card" ? (
                <div className="grid grid-cols-2 gap-4">
                  {jeux.map((jeu) => (
                    <div
                      key={jeu.id}
                      className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition"
                    >
                      <img
                        src="https://placehold.co/600x400"
                        alt={jeu.nom}
                        className="w-full h-40 object-cover rounded mb-2"
                      />
                      <h3 className="font-bold text-lg">{jeu.nom}</h3>
                      <p className="text-gray-500 mb-2">Genre : {jeu.genre}</p>
                      <button className="mt-1 px-3 py-1 bg-gray-800 text-white rounded hover:bg-blue-600">
                        Modifier
                      </button>
                      <button
                            className="px-3 ml-1 p-2 text-sm rounded bg-red-600 text-white hover:bg-red-700 transition"
                            onClick={() => alert(`Supprimer ${jeu.nom}`)}
                          >
                            Supprimer
                          </button>
                    </div>
                  ))}
                </div>
              ) : (

<table className="w-full border-collapse">
                  <thead className="bg-gray-100 text-left">
                    <tr>
                      <th className="border-b p-2">Nom</th>
                      <th className="border-b p-2">Genre</th>
                      <th className="border-b p-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jeux.map((jeu, index) => (
                      <tr
                        key={jeu.id || index}
                        className="group transition-all hover:bg-gray-100 hover:shadow-sm border-b border-gray-200"
                      >
                        <td className="p-3 text-gray-500 w-12 text-center">
                          {index + 1}
                        </td>

                        <td className="p-3 font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">
                          {jeu.nom}
                        </td>

                        <td className="p-3 text-gray-600">{jeu.genre}</td>

                        <td className="p-3 text-right space-x-2">
                          <button
                            className="px-3 py-1 text-sm rounded bg-gray-800 text-white hover:bg-blue-600 transition"
                            onClick={() => alert(`Modifier ${jeu.nom}`)}
                          >
                            Modifier
                          </button>

                          <button
                            className="px-3 mt-1 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-700 transition"
                            onClick={() => alert(`Supprimer ${jeu.nom}`)}
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
