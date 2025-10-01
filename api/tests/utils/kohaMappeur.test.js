import { decouperUrls, detecterLangue, extraireDepuisAbstract, mapperKohaVersJeu } from "../../utils/kohaMappeur.js";

describe("decouperUrls", () => {
  it("retourne un tableau de liens nettoyés", () => {
    expect(decouperUrls("http://google.com | http://youtube.com | http://facebook.com ")).toEqual(["http://google.com", "http://youtube.com", "http://facebook.com"]);
  });

  it("retourne undefined si champ vide", () => {
    expect(decouperUrls("")).toBeUndefined();
    expect(decouperUrls(null)).toBeUndefined();
  });
});

describe("detecterLangue", () => {
  it("détecte le français", () => {
    expect(detecterLangue("Ceci est une phrase en français.")).toBe("fr");
  });
  it("détecte l'anglais", () => {
    expect(detecterLangue("This is an english sentence.")).toBe("en");
  });
  it("retourne null si trop court ou inconnu", () => {
    expect(detecterLangue("Hi")).toBeNull();
    expect(detecterLangue("????")).toBeNull();
  });
});


describe("mapperKohaVersJeu", () => {
  it("mappe les champs basiques", () => {
    const jeu = mapperKohaVersJeu({
      title: "Mon jeu",
      edition_statement: "PS5",
      publication_year: "2024",
      author: "Ubisoft; Indie Dev",
      publisher: "Sony",
      url: "http://site.com",
      abstract: "Un jeu québécois incroyable | A great game",
      publication_place: "Montréal"
    });

    expect(jeu.titre).toBe("Mon jeu");
    expect(jeu.plateformes).toEqual(["PS5"]);
    expect(jeu.anneeSortie).toBe(2024);
    expect(jeu.developpeurs).toContain("Ubisoft");
    expect(jeu.estLieAuQuebec).toBe(true);
    expect(jeu.resume.fr).toContain("québécois");
  });
});
