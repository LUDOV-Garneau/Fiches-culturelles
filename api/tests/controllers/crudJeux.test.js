import { jest } from "@jest/globals";

jest.unstable_mockModule("../../models/Jeu.js", () => ({
  __esModule: true,
  default: {
    find: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
  find: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
}));

const { getJeu, updateJeu, deleteJeu } = await import("../../controllers/jeuController.js");
const Jeu = (await import("../../models/Jeu.js")).default;


describe("getJeu", () => {
  it("retourne les jeux québécois filtrés par titre", async () => {
    const req = { params: { titre: "Celeste" } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    const fakeJeux = [{ titre: "Celeste" }];

    Jeu.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue(fakeJeux),
    });

    await getJeu(req, res);

    expect(Jeu.find).toHaveBeenCalledWith({
      estLieAuQuebec: true,
      titre: expect.any(RegExp),
    });
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      count: 1,
      data: fakeJeux,
    });
  });

  it("retourne 400 si titre manquant", async () => {
    const req = { params: {} };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    await getJeu(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Le paramètre 'titre' est obligatoire.",
    });
  });

  it("retourne 500 si erreur BD", async () => {
    const req = { params: { titre: "Celeste" } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    Jeu.find.mockImplementation(() => {
      throw new Error("Erreur Mongo");
    });

    await getJeu(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("updateJeu", () => {
  it("met à jour un jeu existant", async () => {
    const req = {
      params: { id: "123" },
      body: { titre: "Nouveau titre" },
    };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    const updated = { _id: "123", titre: "Nouveau titre" };

    Jeu.findByIdAndUpdate.mockResolvedValue(updated);

    await updateJeu(req, res);

    expect(Jeu.findByIdAndUpdate).toHaveBeenCalledWith("123", { titre: "Nouveau titre" }, expect.any(Object));
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: expect.stringContaining("mis à jour"),
      data: updated,
    });
  });

  it("retourne 404 si jeu non trouvé", async () => {
    const req = { params: { id: "123" }, body: { titre: "X" } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    Jeu.findByIdAndUpdate.mockResolvedValue(null);

    await updateJeu(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("retourne 500 si erreur BD", async () => {
    const req = { params: { id: "123" }, body: {} };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    Jeu.findByIdAndUpdate.mockImplementation(() => {
      throw new Error("Erreur BD");
    });

    await updateJeu(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});


describe("deleteJeu", () => {
  it("supprime un jeu existant", async () => {
    const req = { params: { id: "123" } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    const fakeJeu = { _id: "123", titre: "Celeste" };

    Jeu.findByIdAndDelete.mockResolvedValue(fakeJeu);

    await deleteJeu(req, res);

    expect(Jeu.findByIdAndDelete).toHaveBeenCalledWith("123");
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: expect.stringContaining("supprimé"),
    });
  });

  it("retourne 404 si jeu non trouvé", async () => {
    const req = { params: { id: "999" } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    Jeu.findByIdAndDelete.mockResolvedValue(null);

    await deleteJeu(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("retourne 500 si erreur BD", async () => {
    const req = { params: { id: "123" } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    Jeu.findByIdAndDelete.mockImplementation(() => {
      throw new Error("Erreur BD");
    });

    await deleteJeu(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
