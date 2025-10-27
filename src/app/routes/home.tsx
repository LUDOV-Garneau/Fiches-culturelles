import type { Route } from "./+types/home";
import { Welcome } from "../pages/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Le jeu vidéo au québec - LUDOV" },
    { name: "description", content: "Fiches d'informations sur une liste de jeux québécois" },
  ];
}

export default function Home() {
  return <Welcome />;
}
