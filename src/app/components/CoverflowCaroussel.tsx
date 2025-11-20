import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router";

export function CoverflowCarousel({ jeux }: { jeux: any[] }) {
  const [active, setActive] = useState(0);
  const display = jeux.slice(0, 10);
  const len = display.length;

  const prev = () => setActive((i) => (i - 1 + len) % len);
  const next = () => setActive((i) => (i + 1) % len);

  const [isHovered, setIsHovered] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [popupPos, setPopupPos] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  useEffect(() => {
    if (isHovered) return; // pause le carrousel quand la souris est dessus
    const id = setInterval(next, 3500);
    return () => clearInterval(id);
  }, [isHovered, len]);

  const CARD_W = 218;
  const CARD_H = 288;
  const TRACK_H = 340;
  const GAP_X = 200;

  return (
    <div className="relative py-8">
      <div className="mx-auto max-w-5xl md:max-w-6xl px-4">
        <div
          className="relative mx-auto max-w-7xl overflow-hidden"
          style={{ perspective: "1200px", height: TRACK_H }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            {jeux.slice(0, 10).map((jeu, i) => {
              const offset = i - active;
              const wrapped =
                Math.abs(offset) > len / 2
                  ? offset > 0
                    ? offset - len
                    : offset + len
                  : offset;

              const translateX = wrapped * GAP_X;
              const rotateY = wrapped * -10;
              const scale = 1.18 - Math.min(Math.abs(wrapped) * 0.12, 0.24);
              const zIndex = 100 - Math.abs(wrapped);

              return (
                <Link
                  key={jeu._id}
                  to={`/games/${jeu._id}`}
                  className="absolute top-1/2 -translate-y-1/2 rounded-lg shadow-md overflow-hidden bg-gray-200"
                  style={{
                    width: CARD_W,
                    height: CARD_H,
                    transform: `translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg)`,
                    transformStyle: "preserve-3d",
                    zIndex,
                  }}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setHovered(jeu._id);
                    setPopupPos({
                      top: rect.top + rect.height / 2,
                      left: rect.right + 10,
                    });
                  }}
                  onMouseLeave={() => setHovered(null)}
                >
                  <img
                    src={
                      jeu.imageUrl || "https://placehold.co/600x400?text=Jeu"
                    }
                    alt={jeu.titre}
                    className="h-full w-full object-cover"
                  />

                  {hovered === jeu._id &&
                    createPortal(
                      <div
                        className="fixed z-[9999] rounded-lg bg-black p-4 text-white shadow-lg"
                        style={{
                          top: popupPos.top,
                          left: popupPos.left,
                          transform: "translateY(-50%)",
                          minWidth: "180px",
                          maxWidth: "400px",
                        }}
                      >
                        <p className="font-semibold">{jeu.titre}</p>
                        <p className="text-sm opacity-80">
                          Auteur : {jeu.developpeurs?.[0] || "Inconnu"}
                        </p>
                        <p className="mt-1 text-xs opacity-70">
                          {jeu.anneeSortie ? `Année : ${jeu.anneeSortie}` : ""}
                        </p>
                      </div>,
                      document.body,
                    )}

                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1 text-center text-xs text-white">
                    {jeu.titre}
                    {jeu.anneeSortie ? ` • ${jeu.anneeSortie}` : ""}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* --- Contrôles + bullets --- */}
      <div className="mt-6 flex items-center justify-center gap-4">
        {/* BOUTON PREV */}
        <button
          onClick={prev}
          aria-label="Jeu précédent"
          className="flex h-9 w-9 items-center justify-center rounded-md border border-[--color-primary-blue] text-white shadow-sm transition
                     bg-[--color-primary-blue]
                     hover:bg-[--color-primary-blue-90] hover:border-[--color-primary-blue-90]
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-primary-blue] focus-visible:ring-offset-2"
          style={{
            background:
              "linear-gradient(to bottom, var(--color-primary-blue-10), var(--color-primary-blue))",
          }}
        >
          <span className="text-lg leading-none">◀</span>
        </button>

        {/* BULLETS */}
        <div className="flex gap-1">
          {jeux.slice(0, 10).map((_, i) => (
            <span
              key={i}
              className={[
                "inline-block h-2 w-2 rounded-full",
                i === active ? "bg-[--color-primary-blue]" : "bg-gray-300",
              ].join(" ")}
            />
          ))}
        </div>

        {/* BOUTON NEXT */}
        <button
          onClick={next}
          aria-label="Jeu suivant"
          className="flex h-9 w-9 items-center justify-center rounded-md border border-[--color-primary-blue] text-white shadow-sm transition
                     bg-[--color-primary-blue]
                     hover:bg-[--color-primary-blue-90] hover:border-[--color-primary-blue-90]
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-primary-blue] focus-visible:ring-offset-2"
          style={{
            background:
              "linear-gradient(to bottom, var(--color-primary-blue-10), var(--color-primary-blue))",
          }}
        >
          <span className="text-lg leading-none">▶</span>
        </button>
      </div>
    </div>
  );
}
