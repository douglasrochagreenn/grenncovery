"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const abandonedCart_controller_1 = require("../controllers/abandonedCart.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.AuthMiddleware.authenticate);
router.get('/abandoned-carts', abandonedCart_controller_1.AbandonedCartController.getAbandonedCarts);
router.get('/abandoned-carts/:id', abandonedCart_controller_1.AbandonedCartController.getAbandonedCartById);
router.get('/abandoned-carts/stats/overview', abandonedCart_controller_1.AbandonedCartController.getStatsOverview);
router.get('/abandoned-carts/stats/daily', abandonedCart_controller_1.AbandonedCartController.getDailyStats);
exports.default = router;
//# sourceMappingURL=api.routes.js.map