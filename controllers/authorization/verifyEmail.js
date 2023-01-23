const { User } = require("../../models");
const createError = require("http-errors");

const verifyEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    if (!user) {
      throw createError(404, `${user} not found`);
    }

    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });
    res.status(200).json({
      ResponseBody: {
        message: "Verification successful",
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = verifyEmail;
