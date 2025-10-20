import { useNavigate } from "react-router";
import React from "react";

export default function Admin() {
  const navigate = useNavigate();

  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">Page Admin</h1>
      <button onClick={() => navigate("/")} className="btn-primary">
        Retour
      </button>
    </div>
  );
}
