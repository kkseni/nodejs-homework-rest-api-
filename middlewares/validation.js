const createError = require("http-errors");

const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const multer = require("multer");
const path = require("path");

const { SECRET_KEY } = process.env;
const validation = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      error.status = 400;
      next(error);
      return;
    }
    next();
  };
};

const paramValidation = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.params);
    if (error) {
      throw createError(400, "Bad id");
    }
    next();
  };
};
const authMiddleware = async (req, res, next) => {
  const { authorization = " " } = req.headers;
  const [bearer, token] = authorization.split(" ");
  try {
    if (bearer !== "Bearer") {
      throw createError(401, "Not authorized");
    }
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);
    if (!user || user.token !== token) {
      throw createError(401, "Not authorized");
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.message === "Invalid signature") {
      error.status = 401;
    }
    next(error);
  }
};
const tempDir = path.join(__dirname, "../", "temp");

const multerConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({
  storage: multerConfig,
});
module.exports = {
  validation,
  paramValidation,
  authMiddleware,
  upload,
};
