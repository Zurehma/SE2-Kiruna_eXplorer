/**
 * Utility module
 */

import { validationResult } from "express-validator";

/**
 * Middleware to check if a user has logged in
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.status(401).json({ error: "Not authorized", status: 401 });
};

/**
 * Middleware to check if a string matches the date format YYYY-MM or YYYY
 * @param {String} value
 * @returns
 */
const isValidYearMonthOrYear = (value) => {
  const regex = "^d{4}(-(0[1-9]|1[0-2]))?$";
  return value.test(regex);
};

/**
 * Middleware to manage validation request errors
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  let errorMessage = "The parameters are not formatted properly\n\n";

  errors.array().forEach((error) => {
    errorMessage += "- Parameter: **" + error.value + "** - Reason: **" + error.msg + "** - Location: **" + error.location + "*\n\n";
  });

  return res.status(422).json({ error: errorMessage, status: 422 });
};

/**
 *
 * @param {*} err
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const errorHandler = (err, req, res, next) => {
  console.log(err);
  return res.status(err.errCode || 503).json({
    error: err.errMessage || "Internal Server Error",
    status: err.errCode || 503,
  });
};

const Utility = {
  isLoggedIn,
  isValidYearMonthOrYear,
  validateRequest,
  errorHandler,
};

export default Utility;
