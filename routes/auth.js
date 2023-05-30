const express = require("express");
const { register, login, getMe } = require("../controllers/auth");

const router = express.Router();
// we have to add this because req.user in getMe want be awailable
const { protect } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
// call protect to add req.user object request and use it in getMe
router.get("/me", protect, getMe);

module.exports = router;
