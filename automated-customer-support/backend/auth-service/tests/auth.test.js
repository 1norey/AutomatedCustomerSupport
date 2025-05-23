const request = require("supertest");
const app = require("../index"); // or wherever your Express app is exported

describe("Auth Happy Path", () => {
  it("should sign up, verify and login a user", async () => {
    // 1. Signup
    const email = `user${Date.now()}@test.com`;
    const password = "Test123!";
    await request(app)
      .post("/signup")
      .send({ email, password, role: "client" })
      .expect(201);

    // 2. (Dev only) Force-verify the user (assuming /force-verify/:email)
    await request(app).get(`/force-verify/${email}`).expect(200);

    // 3. Login
    const res = await request(app)
      .post("/login")
      .send({ email, password })
      .expect(200);
    expect(res.body).toHaveProperty("token");
  });
});
