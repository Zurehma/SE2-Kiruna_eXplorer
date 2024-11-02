import { describe, test, expect, beforeAll, beforeEach, afterAll, afterEach, jest } from "@jest/globals";
import db from "../../../db/db.mjs";
import UserDAO from "../../../dao/userDAO.mjs";
import User from "../../../models/user.mjs";
import crypto from "crypto";

jest.mock("../../../db/db.mjs");

/**
 * @type {UserDAO}
 */
let userDAO;

describe("UserDAO", () => {
    
    describe("createUser", () => {
        beforeEach(() => {
            userDAO = new UserDAO();
        });

        afterEach(() => {
            jest.clearAllMocks();
            jest.restoreAllMocks();
        });

        test("Insert successful", async () => {
            const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
                callback.call({ lastID: 0, changes: 1 }, null);
            });

            const result = await userDAO.createUser(
                "exampleName",
                "exampleSurname",
                "Urban Planner",
                "exampleUsername",
                "examplePassword"
            );

            expect(result).toBe(true);
            expect(mockDBRun).toHaveBeenCalled();
        });

        test("DB error", async () => {
            const error = new Error("");

            const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
                callback(error);
                return {};
            });

            const result = userDAO.createUser(
                "exampleName",
                "exampleSurname",
                "Urban Planner",
                "exampleUsername",
                "examplePassword"
            );

            expect(result).rejects.toEqual(error);
            expect(mockDBRun).toHaveBeenCalled();
        });
    });

    describe("getUserById", () => {
        beforeEach(() => {
            userDAO = new UserDAO();
        });

        afterEach(() => {
            jest.clearAllMocks();
            jest.restoreAllMocks();
        });

        test("User found", async () => {
            const exampleUserRow ={
                id: 1,
                name: "exampleName",
                surname: "exampleSurname",
                username: "exampleUsername",
                password: "examplePassword",
                salt: "exampleSalt",
                role: "Urban Planner"
            }
            const exampleUser = new User(exampleUserRow.id, exampleUserRow.name, exampleUserRow.surname, exampleUserRow.role, exampleUserRow.username);


            const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
                callback(null,exampleUserRow);
            });

            const result = await userDAO.getUserById(1);

            expect(result).toBeInstanceOf(User);
            expect(result).toEqual(exampleUser);
            expect(mockDBGet).toHaveBeenCalled();
        });

        test("User not found", async () => {
            const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
                callback.call(null,undefined);
            });

            const result = await userDAO.getUserById(1);

            expect(result).toEqual({ error: "User not found." });
            expect(mockDBGet).toHaveBeenCalled();
        });

        test("DB error", async () => {
            const error = new Error("");

            const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
                callback(error);
            });

            const result = userDAO.getUserById(1);

            expect(result).rejects.toEqual(error);
            expect(mockDBGet).toHaveBeenCalled();
        });
    });

    describe("getUserByCredentials", () => {
        beforeEach(() => {
            userDAO = new UserDAO();
        });

        afterEach(() => {
            jest.clearAllMocks();
            jest.restoreAllMocks();
        });

        test("User found", async () => {
            const exampleUserRow ={
                id: 1,
                name: "exampleName",
                surname: "exampleSurname",
                username: "exampleUsername",
                salt: "exampleSalt",
                role: "Urban Planner"
            }
            const exampleUser = new User(exampleUserRow.id, exampleUserRow.name, exampleUserRow.surname, exampleUserRow.role, exampleUserRow.username);

            const plainPassword = "examplePassword";
            const hashedPassword = crypto.scryptSync(plainPassword, exampleUserRow.salt, 16);
            exampleUserRow.password = hashedPassword;

            const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
                callback(null,exampleUserRow);
            });

            const result = await userDAO.getUserByCredentials("exampleUsername", plainPassword);

            expect(result).toBeInstanceOf(User);
            expect(result).toEqual(exampleUser);
            expect(mockDBGet).toHaveBeenCalled();
        });

        test("User not found", async () => {
            const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
                callback(null,undefined);
            });

            const result = await userDAO.getUserByCredentials("exampleUsername", "examplePassword");

            expect(result).toBe(false);
            expect(mockDBGet).toHaveBeenCalled();
        });

        test("DB error", async () => {
            const error = new Error("");

            const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
                callback(error);
            });

            const result = userDAO.getUserByCredentials("exampleUsername", "examplePassword");

            expect(result).rejects.toEqual(error);
            expect(mockDBGet).toHaveBeenCalled();
        });
    });

    

});
