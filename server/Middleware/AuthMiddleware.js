const Joi = require("joi");

const signupSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),

  email: Joi.string().email().required(),

  password: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/)
    .required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),

  password: Joi.string().required(),
});

const updateProfileSchema = Joi.object({
  name: Joi.string().min(3).max(50),

  email: Joi.string().email(),

  password: Joi.string().pattern(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%\*?&]).{8,}$/,
  ),

  username: Joi.string(),

  title: Joi.string(),

  avatar: Joi.string(),

  theme: Joi.string().valid("light", "dark"),

  color: Joi.string().valid(
    "Amber",
    "Blue",
    "Pink",
    "Rose",
    "Emerald",
    "Black",
  ),
}).min(1);

const updateThemeSchema = Joi.object({
  theme: Joi.string().valid("light", "dark").required(),
});

const signupValidation = (req, res, next) => {
  const { error } = signupSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      responseCode: "400",
      responseMessage: "Invalid signup details!!",
    });
  }

  next();
};

const loginValidation = (req, res, next) => {
  const { error } = loginSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      responseCode: "400",
      responseMessage: "Invalid login details!!",
    });
  }

  next();
};

const updateProfileValidation = (req, res, next) => {
  const { error } = updateProfileSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      responseCode: "400",
      responseMessage: "Invalid profile details!!",
    });
  }

  next();
};

const updateThemeValidation = (req, res, next) => {
  const { error } = updateThemeSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      responseCode: "400",
      responseMessage: "Invalid theme!!",
    });
  }

  next();
};

module.exports = {
  signupValidation,
  loginValidation,
  updateProfileValidation,
  updateThemeValidation,
};
