const express = require("express");
const router = express.Router();
const { requireSignin, isAuth, isAdmin } = require("../middleware/auth");
const { userById, getSecretProfile, read, update } = require("../controllers/user");

// :userId => route.param("userId", userById)
router.get("/secret/:userId", requireSignin, isAuth, isAdmin, getSecretProfile);

router.get("/user/:userId", requireSignin, isAuth, read);
router.put("/user/:userId", requireSignin, isAuth, update);

router.param("userId", userById);

module.exports = router;
