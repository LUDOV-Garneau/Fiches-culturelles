import type { Route } from "./+types/home";
import  Test  from "../test/test";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Teste foda pra caralhho" },
  ];
}

export default function Casa() {
  return <Test />;
}