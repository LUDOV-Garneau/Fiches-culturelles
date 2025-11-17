import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";

export default function JeuxGrid({ jeux, loading, error }: any) {
  const [page, setPage] = useState(1);
  const JEUX_PAR_PAGE = 9;

  const jeuxChoisis = useMemo(
    () => jeux.filter((j: any) => j.estChoisi === true),
    [jeux]
  );

  const totalPages = Math.max(1, Math.ceil(jeuxChoisis.length / JEUX_PAR_PAGE));
  const indexOfLast = page * JEUX_PAR_PAGE;
  const indexOfFirst = indexOfLast - JEUX_PAR_PAGE;
  const jeuxActuels = jeuxChoisis.slice(indexOfFirst, indexOfLast);

  const [hovered, setHovered] = useState<string | null>(null);
  const [popupPos, setPopupPos] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  if (page > totalPages) setPage(totalPages);

  // smooth effect
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  if (loading) return <p>Chargement des jeux...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-4">
      <h2 className="pt-10 text-3xl font-semibold text-gray-900">
        Nos collections
      </h2>

      {jeuxChoisis.length === 0 ? (
        <p className="text-gray-500 italic">
          Aucun jeu sélectionné pour cette section.
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {jeuxActuels.map((jeu: any) => (
            <div
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
                alt={jeu.titre}
                className="mb-2 h-40 w-full rounded object-cover"
              />
              <h3 className="text-lg font-bold">{jeu.titre}</h3>
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
                    <p>{jeu.titre}</p>
                    <p>
                      {jeu.resume?.brut
                        ? jeu.resume.brut.slice(0, 200) + "..."
                        : ""}
                    </p>
                  </div>,
                  document.body
                )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {jeuxChoisis.length > JEUX_PAR_PAGE && (
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
