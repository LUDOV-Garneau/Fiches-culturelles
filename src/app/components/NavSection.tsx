import FacebookIcon from "../img/Facebook.png";
import YouTubeIcon from "../img/youtube.png";
import { Link } from "react-router";

const BAR_HEIGHT = 55;
const PRIMARY = "#1ee7ef"; // turquoise plus clair (ajusté)

export function NavSection() {
  return (
    <header
      className="w-full"
      style={{
        backgroundColor: "transparent",
        fontFamily:
          '"Roboto", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        fontSize: "13px",
        fontWeight: 400,
      }}
    >
      <div
        className="flex items-center justify-end pl-4 pr-16"
        style={{ height: BAR_HEIGHT }}
      >
        <div className="flex items-center gap-10">
          {/* Icônes */}
          <div className="flex items-center gap-6">
            <a
              href="https://www.facebook.com/LUDOVUdeM"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={FacebookIcon}
                alt="Facebook"
                style={{
                  width: 32,
                  height: 32,
                  objectFit: "contain",
                }}
              />
            </a>

            <a
              href="https://www.youtube.com/@LUDOVUdeM"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={YouTubeIcon}
                alt="YouTube"
                style={{
                  width: 32,
                  height: 32,
                  objectFit: "contain",
                }}
              />
            </a>
          </div>

          {/* Boutons */}
          <div className="flex items-center gap-4">
            <a
              href="https://www.ludov.ca/fr/contact/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: PRIMARY,
                padding: "11px 26px",
                color: "#333",
                textDecoration: "none",
                lineHeight: 1,
                display: "inline-block",
              }}
            >
              Contact
            </a>

            <Link
              to="/english"
              style={{
                backgroundColor: PRIMARY,
                padding: "11px 26px",
                color: "#333",
                textDecoration: "none",
                lineHeight: 1,
                display: "inline-block",
              }}
            >
              English
            </Link>

            <Link
              to="/login"
              style={{
                backgroundColor: PRIMARY,
                padding: "11px 26px",
                color: "#333",
                textDecoration: "none",
                lineHeight: 1,
                display: "inline-block",
              }}
            >
              Login
            </Link>
            <Link
              to="/docs"
              style={{
                backgroundColor: PRIMARY,
                padding: "11px 26px",
                color: "#333",
                textDecoration: "none",
                lineHeight: 1,
                display: "inline-block",
              }}
            >
              Aide
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
