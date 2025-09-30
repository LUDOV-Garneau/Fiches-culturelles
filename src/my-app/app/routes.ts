import { type RouteConfig, index } from "@react-router/dev/routes";

export default [index("routes/home.tsx"), 
    { path: "/casa", file: "routes/casa.tsx" },] satisfies RouteConfig;
