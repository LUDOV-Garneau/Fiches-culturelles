import { type RouteConfig, index } from "@react-router/dev/routes";

export default [index("routes/home.tsx"), 
    { path: "/casa", file: "routes/casa.tsx" },
    { path: "/admin", file: "routes/admin.tsx"},
    { path: "/login", file: "routes/login.tsx", },
    { path: "/games/:id", file: "routes/games.$id.tsx" }
    ] satisfies RouteConfig;
 