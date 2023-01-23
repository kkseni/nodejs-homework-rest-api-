const createError = require("http-errors");
const bcrypt = require("bcryptjs");
const { User } = require("../../models");
const gravatar = require("gravatar");
const sendEmail = require("../../helpers/sendEmail");
const { v4 } = require("uuid");

const singup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      throw createError(409, `${email} in use. Choose another`);
    }
    const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(8));
    const avatarURL = gravatar.url(email);
    const verificationToken = v4();
    const result = await User.create({
      email,
      password: hashPassword,
      avatarURL,
      verificationToken,
    });

    const data = {
      to: email,
      subject: "Email verification",
      html: `<a target="_blank" href="http://localhost:3000/api/users/verify/${verificationToken}">Please, verify</a>`,
    };

    await sendEmail(data);

    res.json({
      status: "success",
      code: 201,
      data: {
        user: {
          email: email,
          subscription: "starter",
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = singup;
