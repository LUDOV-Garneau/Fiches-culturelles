type TabsProps = {
  active: number;
  onChange: (index: number) => void;
};

const PRIMARY = "#02dade"; 
const BORDER = "#d6d6d6";  

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
            style={{
              padding: "10px 26px",
              fontFamily: '"Roboto", sans-serif',
              fontSize: "15px",
              fontWeight: 400,
              lineHeight: 1.5,
              borderRadius: "0px",
              border: isActive ? "none" : `1px solid ${BORDER}`,
              backgroundColor: isActive ? PRIMARY : "#ffffff",
              color: isActive ? "#ffffff" : "#4f4f4f",
              cursor: "pointer",
              transition: "0.2s ease",
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = PRIMARY;
                e.currentTarget.style.color = "#ffffff";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = "#ffffff";
                e.currentTarget.style.color = "#4f4f4f";
              }
            }}
          >
            {label}
          </button>
        );
      })}
    </nav>
  );
}
