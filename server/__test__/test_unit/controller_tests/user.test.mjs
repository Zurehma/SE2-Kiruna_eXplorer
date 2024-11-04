import { describe, test, expect, beforeAll, beforeEach, afterAll, afterEach, jest } from "@jest/globals";
import UserController from "../../../controllers/userController.mjs";
import User from "../../../models/user.mjs";
import UserDao from "../../../dao/userDAO.mjs";

jest.mock("../../../dao/userDAO.mjs");

describe ("userController", ()=> {
    describe("registerUser", () => {

        afterEach(() => {
            jest.clearAllMocks();
            jest.restoreAllMocks();
        });

        test("Create a new user", async () => {
            const exampleUser = { name: "exampleName", surname: "exampleSurname", role: "Urban Planner", username: "exampleUsername", password: "examplePassword" };
    
            const userDAO = new UserDao();
            userDAO.createUser = jest.fn().mockResolvedValue(true);

            const userController = new UserController();    
            userController.userDAO = userDAO;
            const result = await userController.registerUser(exampleUser.name, exampleUser.surname, exampleUser.role, exampleUser.username, exampleUser.password);
    
            expect(userDAO.createUser).toHaveBeenCalled();
            expect(userDAO.createUser).toHaveBeenCalledWith(exampleUser.name, exampleUser.surname, exampleUser.role, exampleUser.username, exampleUser.password);
            expect(result).toBe(undefined);
        });

        test("DB error", async () => {
            const exampleUser = { name: "exampleName", surname: "exampleSurname", role: "Urban Planner", username: "exampleUsername", password: "examplePassword" };
    
            const error = new Error("");
    
            const userDAO = new UserDao();
            userDAO.createUser = jest.fn().mockRejectedValue(error);
    
            const userController = new UserController();    
            userController.userDAO = userDAO;
            const result = userController.registerUser(exampleUser.name, exampleUser.surname, exampleUser.role, exampleUser.username, exampleUser.password);
    
            expect(userDAO.createUser).toHaveBeenCalled();
            expect(userDAO.createUser).toHaveBeenCalledWith(exampleUser.name, exampleUser.surname, exampleUser.role, exampleUser.username, exampleUser.password);
            expect(result).rejects.toEqual(error);
        });

    });


    
});
