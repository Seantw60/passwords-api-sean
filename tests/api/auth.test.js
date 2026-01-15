import { describe, it, expect } from "vitest";
import request from "supertest";
import { createServer } from "../helpers/server";

describe("Auth API", () => {
  const app = createServer();

  describe("POST /api/auth/signup", () => {
    it("should create a new user with valid data", async () => {
      const response = await request(app)
        .post("/api/auth/signup")
        .send({
          email: "test@example.com",
          password: "Test123!@#",
          name: "Test User",
        });

      expect(response.status).toBe(201);
      expect(response.body.user).toHaveProperty("id");
      expect(response.body.user.email).toBe("test@example.com");
    });

    it("should reject weak passwords", async () => {
      const response = await request(app)
        .post("/api/auth/signup")
        .send({
          email: "test2@example.com",
          password: "weak",
          name: "Test User",
        });

      expect(response.status).toBe(400);
    });

    it("should reject duplicate emails", async () => {
      await request(app).post("/api/auth/signup").send({
        email: "duplicate@example.com",
        password: "Test123!@#",
        name: "Test User",
      });

      const response = await request(app)
        .post("/api/auth/signup")
        .send({
          email: "duplicate@example.com",
          password: "Test123!@#",
          name: "Test User 2",
        });

      expect(response.status).toBe(400);
    });
  });
});
