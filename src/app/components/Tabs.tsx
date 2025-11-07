type TabsProps = {
  active: number;
  onChange: (index: number) => void;
};

const TABS = [
  "Accueil",
  "Sélection de jeux",
  "Publications et ressources",
  "Revue de presse",
  "Carte vidéoludiQC",
  "Pour participer",
];

export default function Tabs({ active, onChange }: TabsProps) {
  return (
    <nav className="flex flex-wrap justify-center gap-2">
      {TABS.map((label, i) => {
        const isActive = i === active;
        return (
          <button
            key={label}
            onClick={() => onChange(i)}
            className={[
              "px-5 py-2 rounded-md border transition",
              isActive
                ? "bg-[--color-primary-blue] border-[--color-primary-blue] text-white"
                : "bg-white border-gray-300 text-gray-700 hover:bg-[--color-primary-blue-10]",
            ].join(" ")}
          >
            {label}
          </button>
        );
      })}
    </nav>
  );
}
