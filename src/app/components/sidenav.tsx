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
              <a href="https://www.ludov.ca/fr/laboratoire/" >Laboratoire</a>
              <ul>
                <li><a href="https://www.ludov.ca/fr/laboratoire/installations/" >Nos installations</a></li>
                <li><a href="hhttps://www.ludov.ca/fr/laboratoire/collections/" >Nos collections</a></li>
                <li><a href="https://www.ludov.ca/fr/laboratoire/reservations/" >Faire une réservation</a></li>
                <li><a href="https://www.ludov.ca/fr/laboratoire/dons/" >Faire un don</a></li>
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
      <a href="https://www.ludov.ca/fr/universitaire/" >
        Universitaire
      </a>
      <ul>
        <li>
          <a href="https://www.ludov.ca/fr/universitaire/" >
            Notre équipe
          </a>
        </li>
        <li>
          <a href="https://www.ludov.ca/fr/universitaire/" >
            Programmes d'études
          </a>
        </li>
        <li>
          <a href="https://www.ludov.ca/fr/universitaire/" >
            Recherches étudiantes
          </a>
        </li>
        <li>
          <a href="https://www.ludov.ca/fr/universitaire/" >
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
    
      >
        Documentation
      </a>

      <ul>
        <li>
          <a 
            href="https://www.ludov.ca/fr/documentation/" 
           
          >
            Le jeu vidéo au Québec
          </a>
        </li>

        <li>
          <a 
            href="https://www.ludov.ca/fr/documentation/" 

          >
            Visionneuse: jouabilité
          </a>
        </li>

        <li>
          <a 
            href="https://www.ludov.ca/fr/documentation/" 
          
          >
            Visionneuse: marketing
          </a>
        </li>

        <li>
          <a 
            href="https://www.ludov.ca/fr/documentation/" 
           
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
  <a href="https://www.ludov.ca/fr/observation/" >
    Observation
  </a>
  <ul>
    <li>
      <a href="https://www.ludov.ca/fr/observation/" >
        Approche ludique du cinéma
      </a>
    </li>
    <li>
      <a href="https://www.ludov.ca/fr/observation/" >
        Cinéma interactif
      </a>
    </li>
    <li>
      <a href="https://www.ludov.ca/fr/observation/">
        Critique vidéoludique
      </a>
    </li>
    <li>
      <a href="https://www.ludov.ca/fr/observation/" >
        Jeu vidéo d'horreur
      </a>
    </li>
    <li>
      <a href="https://www.ludov.ca/fr/observation/" >
        Genres vidéoludiques et communautés discursives
      </a>
    </li>
    <li>
      <a href="https://www.ludov.ca/fr/observation/" >
        Technologies graphiques
      </a>
    </li>
    <li>
      <a href="https://www.ludov.ca/fr/observation/" >
        Histoire internationale du jeu vidéo (SHAC)
      </a>
    </li>
    <li>
      <a href="https://www.ludov.ca/fr/observation/" >
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
            <a href="https://www.ludov.ca/fr/videoludiques/">Vidéoludique</a>
            <ul>
              <li><a href="https://www.ludov.ca/fr/videoludiques/" >Nos événements</a></li>
              <li><a href="https://www.ludov.ca/fr/videoludiques/" >Liens utiles</a></li>
              <li><a href="https://www.ludov.ca/fr/videoludiques/" >Nos partenaires</a></li>
            </ul>
          </div>

                    )}
            </div>
        </div>
    );
}