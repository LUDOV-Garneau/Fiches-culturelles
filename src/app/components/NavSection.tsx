import { Link } from "react-router";

import FacebookIcon from "../img/Facebook.png";
import YouTubeIcon from "../img/youtube.png";

const BAR_HEIGHT = 55;
const PRIMARY = "#02cfd8";

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
          <div className="flex items-center gap-8">

            <a
              href="https://www.facebook.com/LUDOVUdeM/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: 42,
                height: 42,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 4,
              }}
            >
              <img
                src={FacebookIcon}
                alt="Facebook"
                style={{
                  width: "42px",
                  height: "42px",
                  objectFit: "contain",
                }}
              />
            </a>

            <a
              href="https://www.youtube.com/channel/UChdKw_7Vr3uKxR271GGBqMw"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: 42,
                height: 42,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 4,
              }}
            >
              <img
                src={YouTubeIcon}
                alt="YouTube"
                style={{
                  width: "42px",
                  height: "42px",
                  objectFit: "contain",
                }}
              />
            </a>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/contact"
              style={{
                backgroundColor: PRIMARY,
                padding: "11px 24px",
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
