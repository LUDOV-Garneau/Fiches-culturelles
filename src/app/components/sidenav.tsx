import React, { useState } from "react";
import "../app.css";

export function Sidenav(){
    const [hovered, setHovered] = useState<string | null>(null);
    return(
        <div className="sidenav">
            <img className="img_logo" src="/LUDOV_web_logo_final.png"></img>
            <div className="sidediv" onMouseEnter={() => {setHovered("L")}} onMouseLeave={() => setHovered(null)}>L
                  {hovered === "L" && (
                    <div className="submenu">
                      <a>Laboratoire</a>
                      <ul>
                        <li><a>Nos instalations</a></li>
                        <li><a>Nos collections</a></li>
                        <li><a>Faire une réservation</a></li>
                        <li><a>Faire un don</a></li>
                      </ul>
                    </div>
                    )}
            </div>
            <div className="sidediv" onMouseEnter={() => setHovered("U")} onMouseLeave={() => setHovered(null)}>U
                  {hovered === "U" && (
                    <div className="submenu">
                      <a>Universitaire</a>
                      <ul>
                        <li><a>Notre équipe</a></li>
                        <li><a>Programmes d'études</a></li>
                        <li><a>Recherches étudiantes</a></li>
                        <li><a>Création étudiantes</a></li>
                      </ul>
                    </div>
                    )}
            </div>
            <div className="sidediv" onMouseEnter={() => setHovered("D")} onMouseLeave={() => setHovered(null)}>D
                  {hovered === "D" && (
                    <div className="submenu">
                      <a>Documentation</a>
                      <ul>
                        <li><a>Le jeu vidéo au Québec</a></li>
                        <li><a>Visionneuse: jouabilité</a></li>
                        <li><a>Visionneuse: marketing</a></li>
                        <li><a>Ludiciné (archives)</a></li>
                      </ul>
                    </div>
                    )}
            </div>
            <div className="sidediv" onMouseEnter={() => setHovered("O")} onMouseLeave={() => setHovered(null)}>O
                  {hovered === "O" && (
                    <div className="submenu">
                      <a>Observation</a>
                      <ul>
                        <li><a>Approche ludique du cinéma</a></li>
                        <li><a>Cinéma interactif</a></li>
                        <li><a>Critique vidéoludique</a></li>
                        <li><a>Jeu vidéo d'horreur</a></li>
                        <li><a>Genres vidéoludique et communautés discursives</a></li>
                        <li><a>Technologies graphiques</a></li>
                        <li><a>Histore internationale du jeu vidéo (SHAC)</a></li>
                        <li><a>Autre recherches</a></li>
                      </ul>
                    </div>
                    )}
            </div>
            <div className="sidediv" onMouseEnter={() => setHovered("V")} onMouseLeave={() => setHovered(null)}><p>V</p>  
                  {hovered === "V" && (
                    <div className="submenu">
                      <a>Vidéoludique</a>
                      <ul>
                        <li><a>Nos événement</a></li>
                        <li><a>Liens utilies</a></li>
                        <li><a>Nos partenaires</a></li>
                      </ul>
                    </div>
                    )}
            </div>
        </div>
    );
}