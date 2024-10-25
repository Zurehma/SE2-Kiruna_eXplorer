// Module for the authentication routes

import { Router } from "express";
import { check } from "express-validator";

import passport from "passport";
import LocalStrategy from "passport-local";
import session from "express-session";

import Utility from "../utilities.mjs";

import UserDAO from "../dao/userDAO.mjs";

/**
 *
 * @param {*} app
 */
function AuthRoutes(app) {
  this.router = Router();
  this.app = app;

  this.getRouter = () => this.router;
  
  const userDAO = new UserDAO();

  //Passport configuration
  passport.use(new LocalStrategy(async function verify(username,password,callback){
    const user = await userDAO.getUserByCredentials(username,password);
    if(!user){
      return callback(null,false,{message:'Invalid username or password'});
    }
    return callback(null,user);
  }))


  passport.serializeUser(function(user,callback){
    callback(null,user);
  })

  passport.deserializeUser(function(user,callback){
    callback(null,user);
  })

  app.use(session({
    secret: "This is a very secret information used to initialize the session!",
    resave: false,
    saveUninitialized: false,
  }));
  app.use(passport.authenticate('session'));

  this.initRoutes = () => {

    //Register a user
    this.router.post(
      "/register",
      async (req, res) => {
        try {
          const { name, surname, role, username, password } = req.body;
          await userDAO.createUser(name, surname, role, username, password);
          res.status(200).json({ message: "User created successfully" });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      }
    );

    //Login
    this.router.post(
      "/login",
      passport.authenticate('local'),
      (req, res) => {
        res.status(200).json({ message: "Login successful" });
      }
    );

    //Logout
    this.router.delete(
      "/logout",
      (req,res) =>{
        req.logout(()=>{
          res.end();
        })
      }
    )

    //Get current user
    this.router.get(
      "/current",
      (req,res)=>{
        if(req.isAuthenticated()){
          res.status(200).json(req.user);
        } else {
            res.status(401).json({message:'Unauthorized'});
        }
      }  
    )

  };



}

export default AuthRoutes;
