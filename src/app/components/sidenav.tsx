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
              <a href="https://www.ludov.ca/fr/laboratoire/" target="_blank">Laboratoire</a>
              <ul>
                <li><a href="https://www.ludov.ca/fr/laboratoire/" target="_blank">Nos installations</a></li>
                <li><a href="https://www.ludov.ca/fr/laboratoire/" target="_blank">Nos collections</a></li>
                <li><a href="https://www.ludov.ca/fr/laboratoire/" target="_blank">Faire une réservation</a></li>
                <li><a href="https://www.ludov.ca/fr/laboratoire/" target="_blank">Faire un don</a></li>
              </ul>
            </div>

                    )}
            </div>
<div
  className="sidediv"
  onMouseEnter={() => setHovered("U")}
  onMouseLeave={() => setHovered(null)}
>
  U
  {hovered === "U" && (
    <div className="submenu">
      <a href="https://www.ludov.ca/fr/universitaire/" target="_blank">
        Universitaire
      </a>
      <ul>
        <li>
          <a href="https://www.ludov.ca/fr/universitaire/" target="_blank">
            Notre équipe
          </a>
        </li>
        <li>
          <a href="https://www.ludov.ca/fr/universitaire/" target="_blank">
            Programmes d'études
          </a>
        </li>
        <li>
          <a href="https://www.ludov.ca/fr/universitaire/" target="_blank">
            Recherches étudiantes
          </a>
        </li>
        <li>
          <a href="https://www.ludov.ca/fr/universitaire/" target="_blank">
            Création étudiantes
          </a>
        </li>
      </ul>
    </div>
  )}
</div>

            <div className="sidediv" 
     onMouseEnter={() => setHovered("D")} 
     onMouseLeave={() => setHovered(null)}
>
  D
  {hovered === "D" && (
    <div className="submenu">

      <a 
        href="https://www.ludov.ca/fr/documentation/" 
        target="_blank"
      >
        Documentation
      </a>

      <ul>
        <li>
          <a 
            href="https://www.ludov.ca/fr/documentation/" 
            target="_blank"
          >
            Le jeu vidéo au Québec
          </a>
        </li>

        <li>
          <a 
            href="https://www.ludov.ca/fr/documentation/" 
            target="_blank"
          >
            Visionneuse: jouabilité
          </a>
        </li>

        <li>
          <a 
            href="https://www.ludov.ca/fr/documentation/" 
            target="_blank"
          >
            Visionneuse: marketing
          </a>
        </li>

        <li>
          <a 
            href="https://www.ludov.ca/fr/documentation/" 
            target="_blank"
          >
            Ludiciné (archives)
          </a>
        </li>
      </ul>

    </div>
  )}
</div>

            <div className="sidediv" onMouseEnter={() => setHovered("O")} onMouseLeave={() => setHovered(null)}>O
                  {hovered === "O" && (
                    <div className="submenu">
  <a href="https://www.ludov.ca/fr/observation/" target="_blank">
    Observation
  </a>
  <ul>
    <li>
      <a href="https://www.ludov.ca/fr/observation/" target="_blank">
        Approche ludique du cinéma
      </a>
    </li>
    <li>
      <a href="https://www.ludov.ca/fr/observation/" target="_blank">
        Cinéma interactif
      </a>
    </li>
    <li>
      <a href="https://www.ludov.ca/fr/observation/" target="_blank">
        Critique vidéoludique
      </a>
    </li>
    <li>
      <a href="https://www.ludov.ca/fr/observation/" target="_blank">
        Jeu vidéo d'horreur
      </a>
    </li>
    <li>
      <a href="https://www.ludov.ca/fr/observation/" target="_blank">
        Genres vidéoludiques et communautés discursives
      </a>
    </li>
    <li>
      <a href="https://www.ludov.ca/fr/observation/" target="_blank">
        Technologies graphiques
      </a>
    </li>
    <li>
      <a href="https://www.ludov.ca/fr/observation/" target="_blank">
        Histoire internationale du jeu vidéo (SHAC)
      </a>
    </li>
    <li>
      <a href="https://www.ludov.ca/fr/observation/" target="_blank">
        Autres recherches
      </a>
    </li>
  </ul>
</div>

                    )}
            </div>
            <div className="sidediv" onMouseEnter={() => setHovered("V")} onMouseLeave={() => setHovered(null)}><p>V</p>  
                  {hovered === "V" && (
                  <div className="submenu">
            <a href="https://www.ludov.ca/fr/videoludiques/" target="_blank">Vidéoludique</a>
            <ul>
              <li><a href="https://www.ludov.ca/fr/videoludiques/" target="_blank">Nos événements</a></li>
              <li><a href="https://www.ludov.ca/fr/videoludiques/" target="_blank">Liens utiles</a></li>
              <li><a href="https://www.ludov.ca/fr/videoludiques/" target="_blank">Nos partenaires</a></li>
            </ul>
          </div>

                    )}
            </div>
        </div>
    );
}