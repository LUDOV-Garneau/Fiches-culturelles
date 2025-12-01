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
        const response = await fetch(`http://72.11.148.122/api/jeux/${id}`);
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
      const response = await fetch(`http://72.11.148.122/api/jeux/${id}`, {
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
  async function toggleChoisi(id: string, estChoisiActuel: boolean) {
    try {
      const response = await fetch(`http://72.11.148.122/api/jeux/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ estChoisi: !estChoisiActuel }),
      });

      const data = await response.json();

      if (data.success) {
        setJeu((prev: any) =>
          prev.map((j: any) =>
            j._id === id ? { ...j, estChoisi: !estChoisiActuel } : j
          )
        );
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

  async function handleImageUpload(file: File) {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const resp = await fetch("http://72.11.148.122/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await resp.json();

      if (data.success) {
        setJeu((prev: any) => ({
          ...prev,
          imageUrl: data.imageUrl,
        }));
      } else {
        alert("Erreur upload image : " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Impossible d’envoi vers le serveur.");
    }
  }

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
            value={
              jeu.titreComplet?.sousTitre
                ? `${jeu.titreComplet.principal} ${jeu.titreComplet.sousTitre}`
                : jeu.titreComplet?.principal || ""
            }
            onChange={(e) => {
              const texte = e.target.value.trim();
              const match = texte.match(/^(.*?:)\s*(.*)$/);

              setJeu({
                ...jeu,
                titreComplet: {
                  ...jeu.titreComplet,
                  principal: match ? match[1].trim() : texte,
                  sousTitre: match && match[2] ? match[2].trim() : null,
                },
              });
            }}
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
          <label className="block font-semibold mb-1">Image actuelle</label>

          {jeu.imageUrl && (
            <img
              src={jeu.imageUrl}
              alt={jeu.titre}
              className="mt-2 w-full rounded shadow border"
            />
          )}

          <label className="block font-semibold mt-4 mb-1">
            Changer l’image :
          </label>
          <input
            type="text"
            value={jeu.imageUrl || ""}
            onChange={(e) => setJeu({ ...jeu, imageUrl: e.target.value })}
            className="border p-2 w-full rounded mt-4"
            placeholder="https://exemple.com/jeu.jpg"
          />
          <div className="m-1">
            <strong>Ou</strong>
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload(file);
            }}
            className="border p-1 w-34 rounded"
          />
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
              <label className="block font-semibold mb-1 text-gray-700">
                Crédits
              </label>
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
                value={(jeu.resume?.notes?.etiquettesGeneriques || []).join(
                  ", "
                )}
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
                      notes: {
                        ...jeu.resume?.notes,
                        liensQuebec: e.target.value,
                      },
                    },
                  })
                }
                className="border p-3 rounded w-full h-28"
              />
            </div>
          </div>
        </fieldset>

        {/* --- GENRES --- */}
        <div>
          <label className="block font-semibold mb-2 text-gray-800 text-lg">
            Genres
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(jeu.genres && jeu.genres.length > 0
              ? jeu.genres
              : [{ type: "", valeur: "" }]
            ).map((genre: { type: string; valeur: string }, i: number) => (
              <div
                key={i}
                className="flex flex-col bg-gray-50 border rounded-lg p-3 shadow-sm hover:shadow-md transition"
              >
                <input
                  type="text"
                  value={genre.type || ""}
                  onChange={(e) => {
                    const newGenres = [
                      ...(jeu.genres || [{ type: "", valeur: "" }]),
                    ];
                    newGenres[i] = { ...newGenres[i], type: e.target.value };

                    if (
                      i === newGenres.length - 1 &&
                      (newGenres[i].type || newGenres[i].valeur)
                    ) {
                      newGenres.push({ type: "", valeur: "" });
                    }

                    setJeu({ ...jeu, genres: newGenres });
                  }}
                  className="border p-2 rounded mb-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Type (ex: Basic Genres)"
                />
                <input
                  type="text"
                  value={genre.valeur || ""}
                  onChange={(e) => {
                    const newGenres = [
                      ...(jeu.genres || [{ type: "", valeur: "" }]),
                    ];
                    newGenres[i] = { ...newGenres[i], valeur: e.target.value };

                    if (
                      i === newGenres.length - 1 &&
                      (newGenres[i].type || newGenres[i].valeur)
                    ) {
                      newGenres.push({ type: "", valeur: "" });
                    }

                    setJeu({ ...jeu, genres: newGenres });
                  }}
                  className="border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Valeur (ex: Adventure)"
                />
              </div>
            ))}
          </div>
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
