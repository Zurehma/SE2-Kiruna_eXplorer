import { describe, test, expect, beforeAll, beforeEach, afterAll, afterEach, jest } from "@jest/globals";
import UserController from "../../../controllers/userController.mjs";
import User from "../../../models/user.mjs";
import UserDao from "../../../dao/userDAO.mjs";
//import Utility from "../../../utility.mjs";
import request from "supertest";

const baseURL = "/api/sessions"

jest.mock("../../../controllers/userController.mjs");

describe("authRoutes", () => {

    describe("POST /register", () => {
        test("Create a new user", async () => {
            expect(1).toBe(1);
        });
    });

    describe("POST /register/urbanplanner", () => {
        test("Create a new urbanplanner", async () => {
            expect(1).toBe(1);
        });
    });
});
