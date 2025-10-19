import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function Admin() {
  const navigate = useNavigate();
  const [jeux, setJeux] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJeux = async () => {
      try {
        const response = await fetch("http://localhost:3000/jeux?limit=1");
        if (!response.ok) throw new Error("Erreur lors du chargement des jeux");

        const result = await response.json();
        setJeux(result.data); 
      } catch (err: any) {
        setError(err.message || "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    fetchJeux();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 w-200 mx-auto">

      <div className="p-3 bg-gray-800 text-white flex justify-between items-center">
        <h1 className="text-2xl font-bold">Page Admin</h1>
        <button onClick={() => navigate("/")} className="btn-primary">
          Retour
        </button>
      </div>

      <div className="flex flex-1">
        <aside className="w-1/4 bg-white border-r border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">Menu</h2>
          <ul className="space-y-3">
            <li>
              {/* // btn qui ouvre un form qui permet d'ajouter un jeu à la BD */}
              <button className="w-full text-left px-3 py-2 bg-blue-100 hover:bg-blue-200 rounded">
                Ajouter un jeu
              </button>
            </li>
          </ul>
        </aside>

        <main className="flex-1 p-6">
          <h2 className="text-xl font-semibold mb-4">Liste des jeux</h2>

          {loading && <p>Chargement des jeux...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && (
            <div className="grid grid-cols-2 gap-4">
              {jeux.length > 0 ? (
                jeux.map((jeu, index) => (
                  <div
                    key={jeu.id || index}
                    className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition"
                  >
                    <h3 className="font-bold text-lg">{jeu.nom || "Sans nom"}</h3>
                    <p className="text-gray-500">
                      Genre : {jeu.genre || "Non spécifié"}
                    </p>
                    <button className="mt-3 px-3 py-1 bg-gray-800 text-white rounded hover:bg-blue-600">
                      Modifier
                    </button>
                  </div>
                ))
              ) : (
                <p>Aucun jeu trouvé.</p>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
