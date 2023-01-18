const { Contact } = require("../../models");

const getAll = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { page = 1, limit = 2 } = req.query;
    const skip = (page - 1) * limit;
    const contacts = await Contact.find({ owner: _id }, "", {
      skip,
      limit: Number(limit),
    }).populate("owner", "_id email");

    const { favorite } = req.query;
    const favoriteContacts = await Contact.find(
      { owner: _id, favorite: favorite },
      "",
      { skip, limit: Number(limit) }
    ).populate("owner", "_id email");

    if (favorite) {
      // return
      res.json({
        status: 200,
        data: {
          result: favoriteContacts,
        },
      });
    }
    res.json({
      status: "success",
      code: 200,
      data: {
        result: contacts,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getAll;
