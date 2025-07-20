"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post('/register', auth_controller_1.AuthController.register);
router.post('/login', auth_controller_1.AuthController.login);
router.post('/verify-token', auth_controller_1.AuthController.verifyToken);
router.get('/profile', auth_middleware_1.AuthMiddleware.authenticate, auth_controller_1.AuthController.getProfile);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map