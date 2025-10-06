import { type RouteConfig, index } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  { path: "/casa", file: "routes/casa.tsx" },

  // ✅ détail d'un jeu : /games/:id  (ex: /games/fez)
  { path: "/games/:id", file: "routes/games.$id.tsx" },
] satisfies RouteConfig;