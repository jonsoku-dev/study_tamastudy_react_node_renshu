const express = require("express");
const router = express.Router();
const {
  create,
  read,
  remove,
  update,
  list,
  listRelated,
  listCategories,
  listBySearch,
  photo,
  productById
} = require("../controllers/product");
const { requireSignin, isAuth, isAdmin } = require("../middleware/auth");
const { userById } = require("../controllers/user");

router.get("/products", list);
router.get("/products/related/:productId", listRelated);
router.get("/products/categories", listCategories);

/**
 * list products by search
 * we will implement product search in react frontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the products to users based on what he wants
 */

// route - make sure its post
router.post("/products/by/search", listBySearch);
router.get("/products/photo/:productId", photo);

router.get("/product/:productId", read);
router.post("/product/create/:userId", requireSignin, isAuth, isAdmin, create);
router.delete("/product/:productId/:userId", requireSignin, isAuth, isAdmin, remove);
router.put("/product/:productId/:userId", requireSignin, isAuth, isAdmin, update);

router.param("userId", userById);
router.param("productId", productById);

module.exports = router;
