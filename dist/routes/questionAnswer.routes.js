"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const questionAnswer_controller_1 = require("../controllers/questionAnswer.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.AuthMiddleware.authenticate);
router.post('/', questionAnswer_controller_1.QuestionAnswerController.createQuestionAnswer);
router.get('/', questionAnswer_controller_1.QuestionAnswerController.getQuestionAnswers);
router.get('/stats', questionAnswer_controller_1.QuestionAnswerController.getQuestionAnswerStats);
router.get('/:id', questionAnswer_controller_1.QuestionAnswerController.getQuestionAnswerById);
router.put('/:id', questionAnswer_controller_1.QuestionAnswerController.updateQuestionAnswer);
router.delete('/:id', questionAnswer_controller_1.QuestionAnswerController.deleteQuestionAnswer);
router.patch('/:id/answer', questionAnswer_controller_1.QuestionAnswerController.answerQuestion);
exports.default = router;
//# sourceMappingURL=questionAnswer.routes.js.map