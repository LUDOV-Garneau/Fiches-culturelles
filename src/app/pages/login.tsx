"use client";
import React, { useState } from "react";
import { useNavigate } from "react-router";

export default function LoginPage() {
  const [identifiant, setIdentifiant] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErreur(null);
    setLoading(true);

    try {
      const response = await fetch(
        `http://72.11.148.122/api/auth/admin/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifiant, motDePasse }),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setErreur(data?.message || "Identifiants invalides.");
        return;
      }
      localStorage.setItem("admin_token", data.token);

      localStorage.setItem("admin_info", JSON.stringify(data.admin));

      navigate("/admin");
    } catch (err) {
      setErreur("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-80">
        <h1 className="text-2xl font-bold text-center mb-4">Connexion admin</h1>

        {erreur && (
          <div className="mb-3 rounded-md bg-red-100 text-red-700 p-2 text-sm">
            {erreur}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Courriel ou nom d’utilisateur"
            value={identifiant}
            onChange={(e) => setIdentifiant(e.target.value)}
            className="border rounded-md p-2"
            required
          />

          <input
            type="password"
            placeholder="Mot de passe"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            className="border rounded-md p-2"
            required
          />

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
