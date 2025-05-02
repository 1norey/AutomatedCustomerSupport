require("dotenv").config({ path: ".env" }); // You can also use ".env.test" if preferred

const { signup, login, refreshToken } = require("../controllers/authController");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Mocking the response object
const createMockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  res.cookie = jest.fn().mockReturnThis();
  return res;
};

describe("Auth Controller - Signup", () => {
  it("should return 400 if email is missing", async () => {
    const req = { body: { password: "123456" } };
    const res = createMockResponse();

    await signup(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: expect.any(String),
    }));
  });

  it("should return 409 if user already exists", async () => {
    const req = { body: { email: "test@example.com", password: "123456" } };
    const res = createMockResponse();

    User.findOne = jest.fn().mockResolvedValue(true);

    await signup(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ message: "Email already in use" });
  });

  it("should create user and return token", async () => {
    const req = { body: { email: "new@example.com", password: "123456", role: "client" } };
    const res = createMockResponse();

    User.findOne = jest.fn().mockResolvedValue(null);
    User.create = jest.fn().mockResolvedValue({ id: "123", email: "new@example.com", role: "client" });

    jwt.sign = jest.fn().mockReturnValue("fakeToken");

    await signup(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      token: expect.any(String),
      user: expect.objectContaining({ email: "new@example.com" }),
    }));
  });
});

describe("Auth Controller - Login", () => {
  it("should return 400 if credentials are invalid", async () => {
    const req = {
      body: { email: "wrong@example.com", password: "wrongpass" }
    };
    const res = createMockResponse();

    User.findOne = jest.fn().mockResolvedValue(null); // No user found

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid credentials" });
  });

  it("should return token and user if credentials are correct", async () => {
    const hashedPassword = await bcrypt.hash("securepass", 10);
    const fakeUser = {
      id: "123",
      email: "login@example.com",
      password: hashedPassword,
      role: "client"
    };

    const req = {
      body: { email: fakeUser.email, password: "securepass" }
    };
    const res = createMockResponse();

    User.findOne = jest.fn().mockResolvedValue(fakeUser);

    jwt.sign = jest.fn().mockReturnValue("FAKE_ACCESS_TOKEN");

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      token: "FAKE_ACCESS_TOKEN",
      user: { id: fakeUser.id, email: fakeUser.email, role: fakeUser.role }
    });
  });
});

describe("Auth Controller - RefreshToken", () => {
  it("should return 401 if no refresh token is provided", () => {
    const req = { cookies: {} };
    const res = createMockResponse();

    refreshToken(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "No refresh token" });
  });

  it("should return new access token if valid refresh token", () => {
    const fakeUser = { id: "123", role: "client" };
    const refreshTokenValue = "VALID_REFRESH_TOKEN";

    const req = {
      cookies: { refreshToken: refreshTokenValue }
    };
    const res = createMockResponse();

    jwt.verify = jest.fn().mockReturnValue(fakeUser);
    jwt.sign = jest.fn().mockReturnValue("NEW_ACCESS_TOKEN");

    refreshToken(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ token: "NEW_ACCESS_TOKEN" });
  });
});
