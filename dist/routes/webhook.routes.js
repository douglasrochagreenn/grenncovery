"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const webhook_controller_1 = require("../controllers/webhook.controller");
const router = (0, express_1.Router)();
router.post('/abandoned-cart', webhook_controller_1.WebhookController.handleAbandonedCart);
router.post('/greenncovery', webhook_controller_1.WebhookController.handleGreennCoveryWebhook);
router.patch('/abandoned-cart/:id/status', webhook_controller_1.WebhookController.updateCartStatus);
router.get('/health', webhook_controller_1.WebhookController.healthCheck);
exports.default = router;
//# sourceMappingURL=webhook.routes.js.map