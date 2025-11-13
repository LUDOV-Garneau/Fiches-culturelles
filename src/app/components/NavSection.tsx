export function NavSection() {
  return (
    <nav className="flex bg-[--color-primary-gray] gap-4 justify-end-safe">
      {/* Fb */}
      <a
        href="#"
        className="btn-primary rounded w-50"
        style={{ backgroundColor: "#02dade" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="50"
          height="30"
          fill="#ffffff"
          viewBox="0 0 21 20"
        >
          <path d="M13 3h4V0h-4c-3.3 0-6 2.7-6 6v3H4v4h3v11h4V13h3l1-4h-4V6c0-1.1.9-2 2-2z" />
        </svg>
      </a>

      {/* YouTube */}
      <a
        href="#"
        className="btn-primary rounded"
        style={{ backgroundColor: "#02dade" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          fill="#ffffff"
          viewBox="0 0 24 24"
        >
          <path d="M23.5 6.2c-.3-1.2-1.2-2.1-2.3-2.4C19.3 3.3 12 3.3 12 3.3s-7.3 0-9.2.5C1.7 4.1.8 5 .5 6.2.1 8.1 0 10 0 12s.1 3.9.5 5.8c.3 1.2 1.2 2.1 2.3 2.4 1.9.5 9.2.5 9.2.5s7.3 0 9.2-.5c1.1-.3 2-1.2 2.3-2.4.4-1.9.5-3.8.5-5.8s-.1-3.9-.5-5.8zM9.8 15.6v-7.2L15.8 12l-6 3.6z" />
        </svg>
      </a>

      <a className="btn-primary" href="/">
        Home
      </a>
      <a className="btn-primary" href="/admin">
        Admin
      </a>
      <a className="btn-primary" href="/login">
        Login
      </a>
      <a className="btn-primary" href="/Contact">
        Contact
      </a>
      <a className="btn-primary" href="/English">
        English
      </a>
    </nav>
  );
}
