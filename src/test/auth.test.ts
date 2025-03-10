import request from "supertest";
import mongoose from "mongoose";
import app from "../index";
import UserModel from "../models/user.model";

const testUsername = `testuser_${Date.now()}`;
const testPassword = "password123";

afterAll(async () => {
  await mongoose.connection.close();
  jest.clearAllMocks();
});

beforeAll(async () => {
  await UserModel.deleteMany({
    username: { $regex: testUsername, $options: "i" },
  });
});

describe("Auth API Endpoints", () => {
  let token: string;

  test("POST /auth/signup - should create a new user", async () => {
    const res = await request(app).post("/api/v1/auth/signup").send({
      username: testUsername,
      password: testPassword,
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.meta.message).toBe("Signup successful");
  });

  test("POST /auth/signin - should log in user and return token", async () => {
    const res = await request(app).post("/api/v1/auth/signin").send({
      username: testUsername,
      password: testPassword,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty("token");
    token = res.body.data.token;
  });

  test("GET /auth/get-user - should return user data with valid token", async () => {
    const res = await request(app)
      .get("/api/v1/auth/get-user")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty("username", testUsername);
  });

  test("GET /auth/get-user - should fail without token", async () => {
    const res = await request(app).get("/api/v1/auth/get-user");

    expect(res.statusCode).toBe(401);
    expect(res.body.meta).toHaveProperty("message", "Unauthorized");
  });
});
