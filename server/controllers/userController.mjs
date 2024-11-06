import UserDAO from "../dao/userDAO.mjs";
import passport from "passport";
import LocalStrategy from "passport-local";

const userDAO = new UserDAO();
//Configure passport
passport.use(
  new LocalStrategy(async function verify(username, password, callback) {
    const user = await userDAO.getUserByCredentials(username, password);
    if (!user) {
      return callback(null, false, { message: "Invalid username or password" });
    }
    return callback(null, user);
  })
);

passport.serializeUser(function (user, callback) {
  callback(null, user);
});

passport.deserializeUser(function (user, callback) {
  callback(null, user);
});

class UserController {
  constructor() {
    this.userDAO = new UserDAO();
  }

  registerUser = (name, surname, role, username, password) => {
    return new Promise(async (resolve, reject) => {
      try {
        await this.userDAO.createUser(name, surname, role, username, password);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  };
}

export default UserController;
