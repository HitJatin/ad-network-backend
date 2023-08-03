"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_validators_1 = require("../validators/user.validators");
const user_controller_1 = require("../controllers/user.controller");
const user_middleware_1 = require("../middleware/user.middleware");
const router = (0, express_1.Router)();
router.post("/signup", user_validators_1.validateSignUp, user_controller_1.signup);
router.post("/resend-token", user_validators_1.validateResendTokenInfo, user_controller_1.resendToken);
router.get("/verify", user_validators_1.validateActivationInfo, user_controller_1.activateAccount);
router.post("/signin", user_validators_1.validateSigninInfo, user_controller_1.signin);
router.post("/type", [user_middleware_1.verifyToken, user_validators_1.validateTypeInfo], user_controller_1.setAccountType);
// router.get("/user-public", validatePublicPublisherInfo, getPublicPublisherData);
// router.get("/private-info", verifyToken, getUserData);
// router.post("/reset-pass", [verifyToken, validateResetPassInfo], resetPass);
// router.get("/signout", verifyToken, signout);
// router.post("/forgot-pass", validateForgetPassInfo, forgetPass);
// router.post("/verify-forgot", validateVerifyPassInfo, verifyPass);
// router.put("/update", [verifyToken, validateUpdatePublisherInfo], updatePublisher);
// router.delete("/delete", verifyToken, deletePublisher);
exports.default = router;