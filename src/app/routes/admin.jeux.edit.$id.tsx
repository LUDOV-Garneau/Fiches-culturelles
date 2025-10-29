import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";

export default function ModifierJeu() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [jeu, setJeu] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les infos du jeu depuis le backend
  useEffect(() => {
    async function chargerJeu() {
      try {
        const response = await fetch(`http://localhost:3000/jeux/${id}`);
        const data = await response.json();

        if (data.success && data.data) {
          setJeu(data.data);
        } else {
          setError("Jeu non trouvé dans la base de données.");
        }
      } catch (err) {
        console.error(err);
        setError("Erreur de connexion au serveur.");
      } finally {
        setLoading(false);
      }
    }

    chargerJeu();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/jeux/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jeu),
      });
      const data = await response.json();
      if (data.success) {
        alert("Jeu mis à jour avec succès !");
        navigate("/admin");
      } else {
        alert("Erreur : " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour du jeu.");
    }
  }

  if (loading) return <p className="p-4">Chargement du jeu...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!jeu) return null;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Modifier le jeu : {jeu.titre}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* --- CHAMPS PRINCIPAUX --- */}
        <div>
          <label className="block font-semibold mb-1">Titre</label>
          <input
            type="text"
            value={jeu.titre}
            onChange={(e) => setJeu({ ...jeu, titre: e.target.value })}
            className="border p-2 w-full rounded"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Année de sortie</label>
          <input
            type="number"
            value={jeu.anneeSortie || ""}
            onChange={(e) =>
              setJeu({ ...jeu, anneeSortie: Number(e.target.value) })
            }
            className="border p-2 w-full rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Type de média</label>
          <input
            type="text"
            value={jeu.typeMedia || ""}
            onChange={(e) =>
              setJeu({ ...jeu, typeMedia: e.target.value || null })
            }
            className="border p-2 w-full rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Pages</label>
          <input
            type="number"
            value={jeu.pages || ""}
            onChange={(e) =>
              setJeu({ ...jeu, pages: Number(e.target.value) || null })
            }
            className="border p-2 w-full rounded"
          />
        </div>

        {/* --- LISTES --- */}
        <div>
          <label className="block font-semibold mb-1">Plateformes</label>
          <input
            type="text"
            value={(jeu.plateformes || []).join(", ")}
            onChange={(e) =>
              setJeu({
                ...jeu,
                plateformes: e.target.value
                  .split(",")
                  .map((x) => x.trim())
                  .filter(Boolean),
              })
            }
            className="border p-2 w-full rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Développeurs</label>
          <input
            type="text"
            value={(jeu.developpeurs || []).join(", ")}
            onChange={(e) =>
              setJeu({
                ...jeu,
                developpeurs: e.target.value
                  .split(",")
                  .map((x) => x.trim())
                  .filter(Boolean),
              })
            }
            className="border p-2 w-full rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Éditeurs</label>
          <input
            type="text"
            value={(jeu.editeurs || []).join(", ")}
            onChange={(e) =>
              setJeu({
                ...jeu,
                editeurs: e.target.value
                  .split(",")
                  .map((x) => x.trim())
                  .filter(Boolean),
              })
            }
            className="border p-2 w-full rounded"
          />
        </div>

        {/* --- IMAGE --- */}
        <div>
          <label className="block font-semibold mb-1">Image (URL)</label>
          <input
            type="text"
            value={jeu.imageUrl || ""}
            onChange={(e) => setJeu({ ...jeu, imageUrl: e.target.value })}
            className="border p-2 w-full rounded"
            placeholder="https://exemple.com/jeu.jpg"
          />
          {jeu.imageUrl && (
            <img
              src={jeu.imageUrl}
              alt={jeu.titre}
              className="mt-4 w-64 rounded shadow border"
            />
          )}
        </div>

        {/* --- RÉSUMÉ --- */}
        <div>
          <label className="block font-semibold mb-1">Résumé (FR)</label>
          <textarea
            value={jeu.resume?.fr || ""}
            onChange={(e) =>
              setJeu({
                ...jeu,
                resume: { ...jeu.resume, fr: e.target.value },
              })
            }
            className="border p-2 w-full rounded h-24"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Résumé (EN)</label>
          <textarea
            value={jeu.resume?.en || ""}
            onChange={(e) =>
              setJeu({
                ...jeu,
                resume: { ...jeu.resume, en: e.target.value },
              })
            }
            className="border p-2 w-full rounded h-24"
          />
        </div>

        {/* --- NOTES DU RÉSUMÉ --- */}
        <fieldset className="border p-4 rounded">
          <legend className="font-semibold text-lg">Notes du résumé</legend>
          <div className="space-y-6">
            {/* Crédits */}
            <div>
              <label className="block font-semibold mb-1 text-gray-700">Crédits</label>
              <textarea
                placeholder="Entrez les crédits..."
                value={jeu.resume?.notes?.credits || ""}
                onChange={(e) =>
                  setJeu({
                    ...jeu,
                    resume: {
                      ...jeu.resume,
                      notes: { ...jeu.resume?.notes, credits: e.target.value },
                    },
                  })
                }
                className="border p-3 rounded w-full h-28"
              />
            </div>

            {/* Autres éditions */}
            <div>
              <label className="block font-semibold mb-1 text-gray-700">
                Autres éditions
              </label>
              <textarea
                placeholder="Entrez les autres éditions..."
                value={jeu.resume?.notes?.autresEditions || ""}
                onChange={(e) =>
                  setJeu({
                    ...jeu,
                    resume: {
                      ...jeu.resume,
                      notes: {
                        ...jeu.resume?.notes,
                        autresEditions: e.target.value,
                      },
                    },
                  })
                }
                className="border p-3 rounded w-full h-28"
              />
            </div>

            {/* Étiquettes génériques */}
            <div>
              <label className="block font-semibold mb-1 text-gray-700">
                Étiquettes génériques
              </label>
              <textarea
                placeholder="Entrez les étiquettes (séparées par des virgules)..."
                value={(jeu.resume?.notes?.etiquettesGeneriques || []).join(", ")}
                onChange={(e) =>
                  setJeu({
                    ...jeu,
                    resume: {
                      ...jeu.resume,
                      notes: {
                        ...jeu.resume?.notes,
                        etiquettesGeneriques: e.target.value
                          .split(",")
                          .map((x) => x.trim())
                          .filter(Boolean),
                      },
                    },
                  })
                }
                className="border p-3 rounded w-full h-28"
              />
            </div>

            {/* Liens Québec */}
            <div>
              <label className="block font-semibold mb-1 text-gray-700">
                Liens Québec
              </label>
              <textarea
                placeholder="Ex: Développé au Québec..."
                value={jeu.resume?.notes?.liensQuebec || ""}
                onChange={(e) =>
                  setJeu({
                    ...jeu,
                    resume: {
                      ...jeu.resume,
                      notes: { ...jeu.resume?.notes, liensQuebec: e.target.value },
                    },
                  })
                }
                className="border p-3 rounded w-full h-28"
              />
            </div>
          </div>
        </fieldset>

        {/* --- CARACTÉRISTIQUES --- */}
        <div>
          <label className="block font-semibold mb-1">Caractéristiques</label>
          <input
            type="text"
            value={(jeu.caracteristiques || []).join(", ")}
            onChange={(e) =>
              setJeu({
                ...jeu,
                caracteristiques: e.target.value
                  .split(",")
                  .map((v) => v.trim())
                  .filter(Boolean),
              })
            }
            className="border p-2 w-full rounded"
            placeholder="Ex: Action, Coopératif, Multijoueur"
          />
        </div>

        {/* --- BOUTONS --- */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
}
