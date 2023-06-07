const express = require("express");
const {
  fetchUsers,
  fetchUser,
  deleteUsers,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();

router.route("/").get(fetchUsers);
router.route("/:username").get(fetchUser);
router.route("/").delete(deleteUsers);
router.route("/:username").delete(deleteUser);

module.exports = router;