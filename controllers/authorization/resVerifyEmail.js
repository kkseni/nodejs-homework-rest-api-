const { User } = require("../../models");
const createError = require("http-errors");
const { sendEmail } = require("../../helpers");

const resVerifyEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw createError(404, `${user} not found`);
    }
    if (user.verify) {
      throw createError(400, "Verification has already been passed");
    }

    const mail = {
      to: email,
      subject: "Verify email",
      html: `<a target="_blank" href="http://localhost:3000/api/users/verify/${user.verificationToken}">Please, verify</a>`,
    };

    await sendEmail(mail);

    res.status(200).json({
      ResponseBody: {
        message: "Verification email sent",
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = resVerifyEmail;
