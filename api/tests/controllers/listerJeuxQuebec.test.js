import { jest } from "@jest/globals";

//jeu.mock directement if commonJS, puisque on utilise module ..
jest.unstable_mockModule("../../models/Jeu.js", () => ({
  __esModule: true,      
  default: { find: jest.fn() }, 
  find: jest.fn(),
}));

const { getJeux } = await import("../../controllers/jeuController.js");
const Jeu = (await import("../../models/Jeu.js")).default;

describe("getJeux", () => {
  it("retourne la liste des jeux québécois", async () => {
    const req = {};
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    const fakeJeux = [{ titre: "Jeu 1" }];

    Jeu.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue(fakeJeux),
    });

    await getJeux(req, res);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      count: 1,
      data: fakeJeux,
    });
  });

  it("retourne erreur 500 si la BD plante", async () => {
    const req = {};
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    Jeu.find.mockImplementation(() => {
      throw new Error("Problème Base de données");
    });

    await getJeux(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Erreur lors de la lecture en BD",
    });
  });
});
