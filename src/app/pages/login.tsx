"use client";
import React, { useState } from "react";
import { useNavigate } from "react-router";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Tentative de connexion :", email, password);

    //condition
    if (email && password) {
      navigate("/admin");
    } else {
      alert("Veuillez entrer vos identifiants !");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-80">
        <h1 className="text-2xl font-bold text-center mb-4">Connexion</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Adresse courriel"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded-md p-2"
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded-md p-2"
            required
          />
          <button type="submit" className="btn-primary">
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}
