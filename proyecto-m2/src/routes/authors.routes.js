const { Router } = require("express");
const controller = require("../controllers/authors.controller");
const validateId = require("../middlewares/validateId");

const router = Router();

router.get("/", controller.list);
router.post("/", controller.create);
router.get("/:id", validateId(), controller.getOne);
router.put("/:id", validateId(), controller.replace);
router.patch("/:id", validateId(), controller.patch);
router.delete("/:id", validateId(), controller.remove);
router.get("/:id/posts", validateId(), controller.listPosts);

module.exports = router;
