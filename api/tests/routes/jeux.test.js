import request from "supertest";
import app from "../../app.js"

describe("Liste de jeux", () => {
  it("GET /jeux/quebec retourne une liste des jeux québécois dans la DB", async () => {
    const res = await request(app).get("/jeux/quebec");
    expect(res.statusCode).toBe(200);

    if (res.body.length > 0) {
      const game = res.body[0];
      expect(game).toHaveProperty("titre");
      expect(game).toHaveProperty("developpeurs");
      expect(game).toHaveProperty("estLieAuQuebec", true);
    }
  });
});