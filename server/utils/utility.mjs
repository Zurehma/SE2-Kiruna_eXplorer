/**
 * Utility module
 */

import { validationResult } from "express-validator";
import { multiPolygon, point, booleanPointInPolygon } from "@turf/turf";
import fs from "fs";

/**
 * Check if the provided coordinates are inside the area of Kiruna
 * @param {Number} lat
 * @param {Number} long
 * @returns {Boolean} **true** if the coordinates provided are inside of Kiruna
 */
const isValidKirunaCoordinates = (lat, long) => {
  const file = fs.readFileSync("static/KirunaMunicipality.geojson");
  const data = JSON.parse(file);

  const kirunaArea = multiPolygon(data.features[0].geometry.coordinates);
  const selectedPoint = point([long, lat]);

  return booleanPointInPolygon(selectedPoint, kirunaArea);
};

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
 * Middleware to check if a user is an admin
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */ 
const isAdmin = (req, res, next) => {
  if (req?.user?.role === "admin") {
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
  const regex = new RegExp("^d{4}(-(0[1-9]|1[0-2]))?$");
  return regex.test(value);
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
 * Middleware to check if an object is a valid coordinates array
 * @param {Object} value
 * @returns
 */
const isValidCoordinatesArray = (value) => {
  if (!Array.isArray(value)) {
    throw new Error("Input is not an array.");
  }

  if (value.length < 3) {
    throw new Error("Invalid coordinates array object.");
  }

  value.forEach((c, index) => {
    if (c.length !== 2) {
      throw new Error(`Invalid coordinates ai index ${index}.`);
    }

    const lat = c[0];
    const long = c[1];

    if (lat === undefined || long === undefined) {
      throw new Error(`Invalid coordinates object at index ${index}.`);
    }

    if (typeof lat !== "number" || typeof long !== "number") {
      throw new Error(`Invalid latitude or longitude types at index ${index}.`);
    }

    if (lat > 90 || lat < -90 || long > 180 || long < -180) {
      throw new Error(`Invalid latitude or longitude values at index ${index}.`);
    }
  });

  return true;
};

/**
 * Middleware to check if a string matches the pages format required
 * @param {String} value
 */
const isValidPages = (value) => {
  const regex = new RegExp("^[0-9]+(-[0-9]+)*$");
  return regex.test(value);
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
  return res.status(err.errCode || 503).json({
    error: err.errMessage || "Internal Server Error",
    status: err.errCode || 503,
  });
};

const Utility = {
  isValidKirunaCoordinates,
  isLoggedIn,
  isAdmin,
  isValidYearMonthOrYear,
  isValidCoordinatesObject,
  isValidPages,
  validateRequest,
  errorHandler,
  isValidCoordinatesArray,
};

export default Utility;
