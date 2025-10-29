import { jest } from "@jest/globals";

jest.unstable_mockModule("../../models/Jeu.js", () => ({
  __esModule: true,
  default: {
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

const { getJeu, updateJeu, deleteJeu } = await import("../../controllers/jeuController.js");
const Jeu = (await import("../../models/Jeu.js")).default;

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  jest.spyOn(console, "log").mockImplementation(() => {});
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("getJeu", () => {
  it("retourne un jeu existant (200)", async () => {
    const fakeJeu = { _id: "123", titre: "Celeste" };
    Jeu.findById.mockResolvedValue(fakeJeu);

    const req = { params: { id: "123" } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    await getJeu(req, res);

    expect(Jeu.findById).toHaveBeenCalledWith("123");
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: fakeJeu,
    });
  });

  it("retourne 400 si l'id est manquant", async () => {
    const req = { params: {} };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    await getJeu(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "L'ID du jeu est obligatoire.",
    });
  });

  it("retourne 404 si le jeu est introuvable", async () => {
    Jeu.findById.mockResolvedValue(null);

    const req = { params: { id: "999" } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    await getJeu(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Jeu non trouvé.",
    });
  });

  it("retourne 500 en cas d'erreur BD", async () => {
    Jeu.findById.mockRejectedValue(new Error("Erreur BD"));

    const req = { params: { id: "123" } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    await getJeu(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false })
    );
  });
});

describe("updateJeu", () => {
  it("met à jour un jeu existant (200)", async () => {
    const updated = { _id: "123", titre: "Nouveau titre" };
    Jeu.findByIdAndUpdate.mockResolvedValue(updated);

    const req = { params: { id: "123" }, body: { titre: "Nouveau titre" } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    await updateJeu(req, res);

    expect(Jeu.findByIdAndUpdate).toHaveBeenCalledWith(
      "123",
      { titre: "Nouveau titre" },
      expect.objectContaining({ new: true })
    );
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: expect.stringContaining("mis à jour"),
      data: updated,
    });
  });

  it("retourne 404 si le jeu n'existe pas", async () => {
    Jeu.findByIdAndUpdate.mockResolvedValue(null);

    const req = { params: { id: "999" }, body: {} };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    await updateJeu(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("retourne 400 si id manquant", async () => {
    const req = { params: {}, body: {} };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    await updateJeu(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("retourne 500 en cas d'erreur BD", async () => {
    Jeu.findByIdAndUpdate.mockRejectedValue(new Error("Erreur BD"));

    const req = { params: { id: "123" }, body: {} };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    await updateJeu(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("deleteJeu", () => {
  it("supprime un jeu existant (200)", async () => {
    const fakeJeu = { _id: "123", titre: "Celeste" };
    Jeu.findByIdAndDelete.mockResolvedValue(fakeJeu);

    const req = { params: { id: "123" } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    await deleteJeu(req, res);

    expect(Jeu.findByIdAndDelete).toHaveBeenCalledWith("123");
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: expect.stringContaining("supprimé"),
      })
    );
  });

  it("retourne 404 si le jeu n'existe pas", async () => {
    Jeu.findByIdAndDelete.mockResolvedValue(null);

    const req = { params: { id: "999" } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    await deleteJeu(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("retourne 400 si id manquant", async () => {
    const req = { params: {} };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    await deleteJeu(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false })
    );
  });

  it("retourne 500 en cas d'erreur BD", async () => {
    Jeu.findByIdAndDelete.mockRejectedValue(new Error("Erreur BD"));

    const req = { params: { id: "123" } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    await deleteJeu(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
