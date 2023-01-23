const fs = require("fs/promises");
const path = require("path");
var Jimp = require("jimp");

const { User } = require("../../models");

const avatarsDir = path.join(__dirname, "../../", "public", "avatars");

const updateAvatar = async (req, res, next) => {
  try {
    const { path: temp, originalname } = req.file;
    const { _id } = req.user;
    const fileName = `${_id}_${originalname}`;
    const resultUpload = path.join(avatarsDir, fileName);
    const img = await Jimp.read(`${temp}`);
    img.resize(250, 250).write(temp);
    await fs.rename(temp, resultUpload);
    const avatarURL = path.join("public", "avatars", fileName);
    await User.findByIdAndUpdate(_id, { avatarURL });

    res.json({
      status: "Ok",
      code: 200,
      avatarURL,
    });
  } catch (error) {
    next(error);
  }
};
module.exports = updateAvatar;
