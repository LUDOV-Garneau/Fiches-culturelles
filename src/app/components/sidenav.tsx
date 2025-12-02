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
          <a href="https://www.ludov.ca/fr/universitaire/chercheurs/" >
            Notre équipe
          </a>
        </li>
        <li>
          <a href="https://www.ludov.ca/fr/universitaire/programme-detude/" >
            Programmes d'études
          </a>
        </li>
        <li>
          <a href="https://www.ludov.ca/fr/universitaire/ligues-mineures/" >
            Recherches étudiantes
          </a>
        </li>
        <li>
          <a href="https://www.ludov.ca/fr/universitaire/creations-ludoviques/" >
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
            href="https://www.ludov.ca/fr/documentation/le-jeu-video-au-quebec/" 
           
          >
            Le jeu vidéo au Québec
          </a>
        </li>

        <li>
          <a 
            href="https://www.ludov.ca/fr/documentation/evolution-de-la-jouabilite/" 

          >
            Visionneuse: jouabilité
          </a>
        </li>

        <li>
          <a 
            href="https://www.ludov.ca/fr/documentation/evolution-de-la-publicite/" 
          
          >
            Visionneuse: marketing
          </a>
        </li>

        <li>
          <a 
            href="https://web.archive.org/web/20220303001406/https:/ludicine.ca/"  target="_blank"
           
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
      <a href="https://www.ludov.ca/fr/observation/approche-ludique-du-cinema/" >
        Approche ludique du cinéma
      </a>
    </li>
    <li>
      <a href="https://www.ludov.ca/fr/observation/cinema-interactif/" >
        Cinéma interactif
      </a>
    </li>
    <li>
      <a href="https://www.ludov.ca/fr/observation/critique-videoludique/">
        Critique vidéoludique
      </a>
    </li>
    <li>
      <a href="https://www.ludov.ca/fr/observation/jeu-video-dhorreur/" >
        Jeu vidéo d'horreur
      </a>
    </li>
    <li>
      <a href="https://www.ludov.ca/fr/observation/genres-videoludiques-et-communautes-discursives/" >
        Genres vidéoludiques et communautés discursives
      </a>
    </li>
    <li>
      <a href="https://www.ludov.ca/fr/observation/technologies-graphiques/" >
        Technologies graphiques
      </a>
    </li>
    <li>
      <a href="https://www.ludov.ca/fr/observation/histoire-internationale-du-jeu-video-shac/" >
        Histoire internationale du jeu vidéo (SHAC)
      </a>
    </li>
    <li>
      <a href="https://www.ludov.ca/fr/observation/autres-recherches/" >
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
              <li><a href="https://www.ludov.ca/fr/videoludiques/evenements/" >Nos événements</a></li>
              <li><a href="https://www.ludov.ca/fr/videoludiques/liens-utiles/" >Liens utiles</a></li>
              <li><a href="https://www.ludov.ca/fr/videoludiques/partenariats/" >Nos partenaires</a></li>
            </ul>
          </div>

                    )}
            </div>
        </div>
    );
}