import { Link } from "react-router";

type GameItem = { id: string; title: string; image?: string; href?: string };

export function GameCard({ item }: { item: GameItem }) {
  // par défaut on envoie vers /games/:id (si un href custom existe, on l’utilise)
  const to = item.href ?? `/games/${item.id}`;

  return (
    <article className="flex flex-col items-center">
      {/* Vignette (placeholder si pas d'image) */}
      <Link
        to={to}
        aria-label={item.title}
        className="block h-[160px] w-[220px] rounded bg-gray-200 shadow-sm hover:shadow md:h-[180px] md:w-[260px]"
      >
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="h-full w-full rounded object-cover"
          />
        ) : null}
      </Link>

      <div className="mt-3 max-w-[260px] rounded border bg-white p-3 text-center text-sm text-gray-800">
        {item.title}
      </div>
    </article>
  );
}