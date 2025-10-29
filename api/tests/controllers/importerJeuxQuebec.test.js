import { jest } from "@jest/globals";
import { importerJeuxQuebec } from "../../controllers/jeuController.js";

// Mocking
jest.unstable_mockModule("axios", () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));

jest.unstable_mockModule("../../models/Jeu.js", () => ({
  __esModule: true,
  default: { bulkWrite: jest.fn() },
}));

jest.unstable_mockModule("../../utils/kohaMappeur.js", () => ({
  __esModule: true,
  mapperKohaVersJeu: jest.fn().mockReturnValue({
    titre: "Jeu Test",
    estLieAuQuebec: true,
    identifiantsExternes: { kohaBiblioId: 1 },
  }),
}));

let axios;
let Jeu;

beforeAll(async () => {
  axios = (await import("axios")).default;
  Jeu = (await import("../../models/Jeu.js")).default;
});

describe("importerJeuxQuebec", () => {
  it("retourne vrai quand un jeu est importé", async () => {
    const req = {};
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    axios.get.mockResolvedValueOnce({ data: { id: 1 } });

    Jeu.bulkWrite.mockResolvedValueOnce({});

    await importerJeuxQuebec(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true })
    );
  });
});
