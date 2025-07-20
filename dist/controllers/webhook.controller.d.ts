import { Request, Response } from 'express';
export declare class WebhookController {
    private static extractWebhookData;
    static handleAbandonedCart(req: Request, res: Response): Promise<void>;
    static handleGreennCoveryWebhook(req: Request, res: Response): Promise<void>;
    static healthCheck(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=webhook.controller.d.ts.map