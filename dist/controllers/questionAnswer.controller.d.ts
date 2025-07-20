import { Request, Response } from 'express';
export declare class QuestionAnswerController {
    private static createSchema;
    private static updateSchema;
    static createQuestionAnswer(req: Request, res: Response): Promise<void>;
    static getQuestionAnswers(req: Request, res: Response): Promise<void>;
    static getQuestionAnswerById(req: Request, res: Response): Promise<void>;
    static updateQuestionAnswer(req: Request, res: Response): Promise<void>;
    static deleteQuestionAnswer(req: Request, res: Response): Promise<void>;
    static getQuestionAnswerStats(req: Request, res: Response): Promise<void>;
    static answerQuestion(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=questionAnswer.controller.d.ts.map