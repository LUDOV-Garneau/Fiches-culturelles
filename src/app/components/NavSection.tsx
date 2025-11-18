// src/components/NavSection.tsx
import { Link } from "react-router";

const BAR_HEIGHT = 55;               // hauteur de la barre
const PRIMARY = "#02cfd8";           // turquoise un peu plus foncé

export function NavSection() {
  return (
    <header
      className="w-full"
      style={{
        backgroundColor: "transparent", // même fond que ton site -> pas de bande grise foncée
        fontFamily:
          '"Roboto", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        fontSize: "13px",
        fontWeight: 400,
      }}
    >
      {/* barre alignée à droite comme sur WP */}
      <div
        className="flex items-center justify-end pl-4 pr-16"
        style={{ height: BAR_HEIGHT }}
      >
        <div className="flex items-center gap-10">

          {/* Icônes Facebook + YouTube */}
          <div className="flex items-center gap-8">

            {/* Facebook */}
            <button
              type="button"
              className="flex items-center justify-center"
              style={{
                width: 34,
                height: 34,
                backgroundColor: PRIMARY,
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="#ffffff"
              >
                <path d="M13 3h4V0h-4C8.9 0 6 2.9 6 7v3H3v4h3v10h4V14h3l1-4h-4V7c0-1.1.9-2 2-2z" />
              </svg>
            </button>

            {/* YouTube */}
            <button
              type="button"
              className="flex items-center justify-center"
              style={{
                width: 34,
                height: 34,
                backgroundColor: PRIMARY,
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="#ffffff"
              >
                <path d="M23.5 6.2c-.3-1.2-1.2-2.1-2.3-2.4C19.3 3.3 12 3.3 12 3.3s-7.3 0-9.2.5C1.7 4.1.8 5 .5 6.2.1 8.1 0 10 0 12s.1 3.9.5 5.8c.3 1.2 1.2 2.1 2.3 2.4 1.9.5 9.2.5 9.2.5s7.3 0 9.2-.5c1.1-.3 2-1.2 2.3-2.4.4-1.9.5-3.8.5-5.8s-.1-3.9-.5-5.8zM9.8 15.6v-7.2L15.8 12l-6 3.6z" />
              </svg>
            </button>
          </div>

          {/* Boutons turquoise */}
          <div className="flex items-center gap-4">
            
            <Link
              to="/contact"
              style={{
                backgroundColor: PRIMARY,
                padding: "11px 24px",  // padding EXACT de WordPress
                color: "#333333",
                lineHeight: 1,
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Contact
            </Link>

            <Link
              to="/english"
              style={{
                backgroundColor: PRIMARY,
                padding: "11px 24px",
                color: "#333333",
                lineHeight: 1,
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              English
            </Link>

            <Link
              to="/admin"
              style={{
                backgroundColor: PRIMARY,
                padding: "11px 24px",
                color: "#333333",
                lineHeight: 1,
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Admin
            </Link>

            <Link
              to="/login"
              style={{
                backgroundColor: PRIMARY,
                padding: "11px 24px",
                color: "#333333",
                lineHeight: 1,
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Login
            </Link>

          </div>
        </div>
      </div>
    </header>
  );
}
