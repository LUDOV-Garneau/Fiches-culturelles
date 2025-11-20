import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router";

export default function JeuxGrid({ jeux, loading, error }: any) {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [decennieFiltre, setDecennieFiltre] = useState("toutes");
  const JEUX_PAR_PAGE = 9;

  const decenniesDisponibles = useMemo(() => {
    const set = new Set<number>();

    jeux.forEach((j: any) => {
      if (j.anneeSortie) {
        const dec = Math.floor(j.anneeSortie / 10) * 10;
        set.add(dec);
      }
    });
    return Array.from(set).sort((a, b) => a - b);
  }, [jeux]);

  const jeuxFiltres = useMemo(() => {
    let filtered = [...jeux];

    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase();

      filtered = filtered.filter((jeu) => {
        const titrePrincipal = jeu.titreComplet?.principal ?? "";
        const sousTitre = jeu.titreComplet?.sousTitre ?? "";
        const alternatifs = jeu.titreComplet?.alternatifs ?? [];

        const texteRecherche = [
          titrePrincipal,
          sousTitre,
          ...alternatifs,
          jeu.resume?.brut ?? "",
          ...(jeu.developpeurs || []),
        ]
          .join(" ")
          .toLowerCase();

        return texteRecherche.includes(lower);
      });
    }

    if (decennieFiltre !== "toutes") {
      const dec = parseInt(decennieFiltre);
      filtered = filtered.filter(
        (j: any) =>
          j.anneeSortie && Math.floor(j.anneeSortie / 10) * 10 === dec,
      );
    }

    return filtered;
  }, [jeux, searchTerm, decennieFiltre]);

  const totalPages = Math.max(1, Math.ceil(jeuxFiltres.length / JEUX_PAR_PAGE));
  const indexOfLast = page * JEUX_PAR_PAGE;
  const indexOfFirst = indexOfLast - JEUX_PAR_PAGE;
  const jeuxActuels = jeuxFiltres.slice(indexOfFirst, indexOfLast);

  const [hovered, setHovered] = useState<string | null>(null);
  const [popupPos, setPopupPos] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  if (page > totalPages && totalPages > 0) setPage(totalPages);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  if (loading) return <p>Chargement des jeux...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-6">
      <h2 className="pt-10 text-3xl font-semibold text-gray-900">
        Nos collections
      </h2>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <input
          type="text"
          placeholder="Rechercher un jeu, un développeur..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full md:w-1/2 focus:outline-none focus:ring focus:ring-gray-200"
        />

        {decenniesDisponibles.length > 0 && (
          <select
            value={decennieFiltre}
            onChange={(e) => {
              setDecennieFiltre(e.target.value);
              setPage(1);
            }}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-gray-200"
          >
            <option value="toutes">Toutes les décennies</option>
            {decenniesDisponibles.map((d) => (
              <option key={d} value={d}>
                {d}s
              </option>
            ))}
          </select>
        )}
      </div>

      {jeuxFiltres.length === 0 ? (
        <p className="text-gray-500 italic">
          Aucun jeu ne correspond à votre recherche.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {jeuxActuels.map((jeu: any) => (
            <Link
              to={`/games/${jeu._id}`}
              key={jeu._id}
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setHovered(jeu._id);
                setPopupPos({
                  top: rect.top + rect.height / 2,
                  left: rect.right + 10,
                });
              }}
              onMouseLeave={() => setHovered(null)}
              className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition"
            >
              <img
                src={jeu.imageUrl || "https://placehold.co/600x400"}
                alt={
                  jeu.titreComplet?.sousTitre
                    ? `${jeu.titreComplet.principal} ${jeu.titreComplet.sousTitre}`
                    : jeu.titreComplet?.principal
                }
                className="mb-2 h-100 w-full rounded object-cover"
              />
              <h3 className="text-lg font-bold">
                {jeu.titreComplet?.sousTitre
                  ? `${jeu.titreComplet.principal} ${jeu.titreComplet.sousTitre}`
                  : jeu.titreComplet?.principal}
              </h3>

              <p className="mb-1 text-gray-500">
                Auteur : {jeu.developpeurs?.[0] || "Inconnu"}
              </p>
              <p className="text-sm text-gray-400">
                {jeu.anneeSortie ? `Année : ${jeu.anneeSortie}` : ""}
              </p>

              {hovered === jeu._id &&
                createPortal(
                  <div
                    className="fixed bg-black text-white p-4 rounded-lg shadow-lg z-[9999]"
                    style={{
                      top: popupPos.top,
                      left: popupPos.left,
                      transform: "translateY(-50%)",
                      minWidth: "180px",
                      maxWidth: "400px",
                    }}
                  >
                    <p className="font-semibold">
                      {jeu.titreComplet?.sousTitre
                        ? `${jeu.titreComplet.principal} ${jeu.titreComplet.sousTitre}`
                        : jeu.titreComplet?.principal}
                    </p>

                    <p className="text-sm text-gray-200 mt-1">
                      {jeu.resume?.brut
                        ? jeu.resume.brut.slice(0, 200) + "..."
                        : ""}
                    </p>
                  </div>,
                  document.body,
                )}
            </Link>
          ))}
        </div>
      )}

      {jeuxFiltres.length > JEUX_PAR_PAGE && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100 transition-all duration-200"
          >
            Précédent
          </button>

          <span className="text-gray-700 font-medium">
            Page {page} / {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100 transition-all duration-200"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
}
