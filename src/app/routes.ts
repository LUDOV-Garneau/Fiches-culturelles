import { type RouteConfig, index } from "@react-router/dev/routes";

export default [index("routes/home.tsx"), 
    { path: "/admin", file: "routes/admin.tsx"},
    { path: "/login", file: "routes/login.tsx", },

    { path: "/admin/jeux/edit/:id", file: "routes/admin.jeux.edit.$id.tsx" },

    { path: "/games/:id", file: "routes/games.$id.tsx" },

    ] satisfies RouteConfig;
 