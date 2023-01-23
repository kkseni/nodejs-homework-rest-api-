const { Contact } = require("../../models");

const getAll = async (req, res, next) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 2 } = req.query;
  const skip = (page - 1) * limit;
  const contacts = await Contact.find({ owner, ...query }, "", {
    skip,
    limit,
  }).populate("owner", "name email");
  res.json(contacts);
};

module.exports = getAll;
