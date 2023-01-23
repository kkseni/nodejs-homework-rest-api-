const express = require("express");

const {
  validation,
  paramValidation,
  authMiddleware,
} = require("../../middlewares");
const {
  contactSchema,
  schemaId,
  statusSchema,
} = require("../../schemas/contacts");

const { contacts: contactController } = require("../../controllers");

const validateMiddleware = validation(contactSchema);
const validateMiddlewareId = paramValidation(schemaId);

const router = express.Router();

router.get("/", authMiddleware, contactController.getAll);

router.get("/:contactId", validateMiddlewareId, contactController.getOneById);

router.post(
  "/",
  authMiddleware,
  validateMiddleware,
  contactController.addContact
);

router.delete(
  "/:contactId",
  validateMiddlewareId,
  contactController.deleteContact
);

router.put(
  "/:contactId",
  validateMiddlewareId,
  validateMiddleware,
  contactController.updateContact
);

router.patch(
  "/:contactId/favorite",
  validateMiddlewareId,
  validation(statusSchema),
  contactController.updateStatusContact
);

module.exports = router;
