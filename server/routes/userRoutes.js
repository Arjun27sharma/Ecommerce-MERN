const express = require("express")
const router = express.Router()

const { register, loginUser, logout, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUsers, getSingleUsers, updateRole, deleteUser } = require("../controller/userController.js")

const {isAuthenticatedUser, authorizeRoles} = require("../middleware/auth")

router.route("/user/new").post(register)

router.route("/user/login").post(loginUser)

router.route("/user/logout").get(logout)

router.route("/password/forgot").post(forgotPassword)

router.route("/password/reset/:token").put(resetPassword)




router.route("/me").get(isAuthenticatedUser, getUserDetails)

router.route("/me/update").put(isAuthenticatedUser, updateProfile)

router.route("/password/update").put(isAuthenticatedUser, updatePassword)


router.route("/admin/users").get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers)

router
    .route("/admin/user/:id")
    .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUsers)
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateRole)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser)

module.exports = router