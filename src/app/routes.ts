import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
  index("./pages/home.tsx"),

  route("login", "./pages/login.tsx"),
  route("admin", "./pages/admin/admin.tsx"),

  route("admin/jeux/edit/:id", "./pages/admin/admin.jeux.edit.$id.tsx"),
  route("games/:id", "./pages/games.$id.tsx"),
] satisfies RouteConfig;
