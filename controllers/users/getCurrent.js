const { User } = require("../../models/user");

const getCurrent = async (req, res, next) => {
  try {
    const { email } = req.user;
    res.json({
      status: "success",
      code: 200,
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

module.exports = getCurrent;
