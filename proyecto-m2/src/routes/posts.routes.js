const { Router } = require("express");
const controller = require("../controllers/posts.controller");
const validateId = require("../middlewares/validateId");

const router = Router();

router.get("/", controller.list);
router.post("/", controller.create);
// Va antes de "/:id" para que "author" no se tome como un id
router.get("/author/:authorId", validateId("authorId"), controller.listByAuthor);
router.get("/:id", validateId(), controller.getOne);
router.put("/:id", validateId(), controller.replace);
router.patch("/:id", validateId(), controller.patch);
router.delete("/:id", validateId(), controller.remove);

module.exports = router;
