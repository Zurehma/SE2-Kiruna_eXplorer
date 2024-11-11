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
 * Middleware to check if an object is a valid coordinates object
 * @param {Object} value
 * @returns
 */
const isValidCoordinatesObject = (value) => {
  const lat = value.lat;
  const long = value.long;
  const numProperties = Object.keys(value).length;

  if (lat == undefined || long == undefined || numProperties !== 2) {
    throw new Error("Invalid coordinates object.");
  }

  if (typeof lat !== "number" && typeof long != "number") {
    throw new Error("Invalid latitude and longitude types.");
  }

  if (lat > 90 || lat < -90 || long > 180 || long < -180) {
    throw new Error("Invalid latitude and longitude values.");
  }

  return true;
};

/**
 * Middleware to check if the body has the correct configuration for the page parameters
 * @param {*} value
 * @param {*} param1
 */
const isValidPageParameter = (value, { req }) => {
  const pages = value;
  const pageFrom = req.body.pageFrom;
  const pageTo = req.body.pageTo;

  if ((pages && pageFrom) || (pages && pageTo)) {
    throw new Error("");
  }

  if ((pageFrom || pageTo) && !(pageFrom && pageTo)) {
    throw new Error("");
  }

  return true;
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
  isValidCoordinatesObject,
  isValidPageParameter,
  validateRequest,
  errorHandler,
};

export default Utility;