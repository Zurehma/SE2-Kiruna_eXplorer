// Module for the authentication routes

import { Router } from "express";
import { body, check } from "express-validator";

import passport from "passport";
import session from "express-session";

import Utility from "../utils/utility.mjs";

import UserController from "../controllers/userController.mjs";

/**
 *
 * @param {*} app
 */
function AuthRoutes(app) {
  this.UserController = new UserController();
  this.router = Router();
  this.app = app;

  this.getRouter = () => this.router;

  app.use(
    session({
      secret: "This is a very secret information used to initialize the session!",
      resave: false,
      saveUninitialized: false,
    })
  );
  app.use(passport.authenticate("session"));

  this.initRoutes = () => {
    //Register a user
    this.router.post(
      "/register",
      body("name").isString().notEmpty(),
      body("surname").isString().notEmpty(),
      body("role").isString().notEmpty(),
      body("username").isString().notEmpty(),
      body("password").isString().notEmpty(),
      Utility.validateRequest,
      (req, res, next) => {
        this.UserController.registerUser(req.body.name, req.body.surname, req.body.role, req.body.username, req.body.password)
          .then(() => {
            res.status(200).json({ message: "User created successfully" });
          })
          .catch((error) => {
            res.status(500).json({ error: error.message });
          });
      }
    );

   //Register an urban planner
    this.router.post(
      "/register/urbanplanner",
      Utility.isLoggedIn,
      Utility.isAdmin,  
      body("name").isString().notEmpty(),
      body("surname").isString().notEmpty(),
      body("username").isString().notEmpty(),
      body("password").isString().notEmpty(),
      Utility.validateRequest,
      (req, res, next) => {
        this.UserController.registerUser(req.body.name, req.body.surname, 'Urban Planner', req.body.username, req.body.password)
          .then(() => {
            res.status(200).json({ message: "Urban planner created successfully" });
          })
          .catch((error) => {
            res.status(500).json({ error: error.message });
          });
      }
    );

    //Login
    this.router.post("/login", passport.authenticate("local"), (req, res) => {
      res.status(200).json({ message: "Login successful" });
    });

    //Logout
    this.router.delete("/logout", (req, res) => {
      req.logout(() => {
        res.end();
      });
    });

    //Get current user
    this.router.get("/current", (req, res) => {
      if (req.isAuthenticated()) {
        res.status(200).json(req.user);
      } else {
        res.status(401).json({ message: "Unauthorized" });
      }
    });
  };
}

export default AuthRoutes;
