const express = require("express")

const {createProduct, getAllProducts, updateProduct, deleteProduct, getProductDetails, createProductReview, getProductReviews, deleteProductReview} = require("../controller/productController")

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth")

const router = express.Router()


router
    .route("/products")
        .get(getAllProducts)

router
    .route("/products/:id")
        .get(getProductDetails)

router
    .route("/admin/product/new")
        .post(isAuthenticatedUser, authorizeRoles("admin") ,createProduct)

router
    .route("/admin/products/:id")
        .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
        .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct)


router
    .route("/review")
        .put(isAuthenticatedUser, createProductReview)
        .get(getProductReviews)
        .delete(isAuthenticatedUser, deleteProductReview)

module.exports = router