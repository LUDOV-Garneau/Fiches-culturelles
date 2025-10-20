import { jest } from "@jest/globals";

// Mock du modèle Admin
jest.unstable_mockModule("../../models/Admin.js", () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
  },
}));

//  Mock de jsonwebtoken
jest.unstable_mockModule("jsonwebtoken", () => ({
  __esModule: true,
  default: {
    sign: jest.fn(() => "fake-jwt-token"),
  },
}));

let Admin;
let jwt;
let loginAdmin;

beforeAll(async () => {
  ({ default: Admin } = await import("../../models/Admin.js"));
  ({ default: jwt } = await import("jsonwebtoken"));
  ({ loginAdmin } = await import("../../controllers/adminController.js"));
});

describe("loginAdmin", () => {
  let res;

  beforeEach(() => {
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  it("retourne un token si connexion réussie", async () => {
    const req = {
      body: { nomUtilisateur: "adminTest", motDePasse: "secret" },
    };

    const mockAdmin = {
      _id: "123",
      nomUtilisateur: "adminTest",
      validerMotDePasse: jest.fn().mockResolvedValue(true),
    };

    Admin.findOne.mockResolvedValueOnce(mockAdmin);

    await loginAdmin(req, res);

    expect(Admin.findOne).toHaveBeenCalledWith({ nomUtilisateur: "adminTest" });
    expect(mockAdmin.validerMotDePasse).toHaveBeenCalledWith("secret");
    expect(jwt.sign).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Connexion réussie",
        token: "fake-jwt-token",
      })
    );
  });

  it("retourne 401 si admin inexistant", async () => {
    const req = { body: { nomUtilisateur: "invalide", motDePasse: "1234" } };
    Admin.findOne.mockResolvedValueOnce(null);

    await loginAdmin(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Identifiants invalides." })
    );
  });

  it("retourne 401 si mot de passe invalide", async () => {
    const req = { body: { nomUtilisateur: "adminTest", motDePasse: "faux" } };

    const mockAdmin = {
      validerMotDePasse: jest.fn().mockResolvedValue(false),
    };
    Admin.findOne.mockResolvedValueOnce(mockAdmin);

    await loginAdmin(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Identifiants invalides." })
    );
  });
});
