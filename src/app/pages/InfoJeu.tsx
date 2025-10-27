// src/app/pages/InfoJeu.tsx
import * as React from "react";
import { useParams, Link } from "react-router";

/** -------- Types & mini DB (placeholder) -------- */
type Game = {
  id: string;
  title: string;
  developer: string;
  description: string;
  genres: string[];
  cover?: string | null;
  developerLogo?: string | null;
};

const LOCAL_DB: Record<string, Game> = {
  fez: {
    id: "fez",
    title: "FEZ",
    developer: "Polytron",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ut arcu elit. Nullam quis scelerisque elit Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ut arcu elit. Nullam quis scelerisque elit. Quisque sed mattis elit, et ullamcorper ex.",
    genres: ["Action Puzzle", "Indie"],
    cover: null,
    developerLogo: null,
  },
  tetards: {
    id: "tetards",
    title: "Têtards (1982)",
    developer: "Vincent Côté",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae.",
    genres: ["Aventure"],
    cover: null,
    developerLogo: null,
  },
  mimi: {
    id: "mimi",
    title: "Mimi la fourmi (1984)",
    developer: "Anne Bergeron",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae.",
    genres: ["Famille"],
    cover: null,
    developerLogo: null,
  },
  "fou-du-roi": {
    id: "fou-du-roi",
    title: "Le fou du roi (1989)",
    developer: "Loto-Québec",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae.",
    genres: ["Arcade"],
    cover: null,
    developerLogo: null,
  },
};

