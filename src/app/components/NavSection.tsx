// src/components/NavSection.tsx
import { Link } from "react-router";

export function NavSection() {
  return (
    <header className="w-full bg-[#e5e5e5]">
      <div className="mx-auto flex h-[56px] max-w-6xl items-center justify-end px-6">
        {/* Groupe icônes + boutons, bien collés comme sur WP */}
        <div className="flex items-center gap-8">
          {/* Icônes réseaux sociaux */}
          <div className="flex items-center gap-6">
            {/* Facebook */}
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center"
              style={{ backgroundColor: "#02dcde" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="#ffffff"
              >
                <path d="M13 3h4V0h-4C8.9 0 6 2.9 6 7v3H3v4h3v10h4V14h3l1-4h-4V7c0-1.1.9-2 2-2z" />
              </svg>
            </button>

            {/* YouTube */}
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center"
              style={{ backgroundColor: "#02dcde" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="#ffffff"
              >
                <path d="M23.5 6.2c-.3-1.2-1.2-2.1-2.3-2.4C19.3 3.3 12 3.3 12 3.3s-7.3 0-9.2.5C1.7 4.1.8 5 .5 6.2.1 8.1 0 10 0 12s.1 3.9.5 5.8c.3 1.2 1.2 2.1 2.3 2.4 1.9.5 9.2.5 9.2.5s7.3 0 9.2-.5c1.1-.3 2-1.2 2.3-2.4.4-1.9.5-3.8.5-5.8s-.1-3.9-.5-5.8zM9.8 15.6v-7.2L15.8 12l-6 3.6z" />
              </svg>
            </button>
          </div>

          {/* Boutons turquoise (Contact / English / Admin / Login) */}
          <div className="flex items-center gap-3 text-[13px]">
            <Link
              to="/contact"
              className="px-4 py-1 leading-none text-[#333]"
              style={{ backgroundColor: "#02dcde" }}
            >
              Contact
            </Link>

            <Link
              to="/english"
              className="px-4 py-1 leading-none text-[#333]"
              style={{ backgroundColor: "#02dcde" }}
            >
              English
            </Link>

            <Link
              to="/admin"
              className="px-4 py-1 leading-none text-[#333]"
              style={{ backgroundColor: "#02dcde" }}
            >
              Admin
            </Link>

            <Link
              to="/login"
              className="px-4 py-1 leading-none text-[#333]"
              style={{ backgroundColor: "#02dcde" }}
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
