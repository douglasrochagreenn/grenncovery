import { Request, Response } from 'express';
import Joi from 'joi';
import { logger } from '../config/logger';

import { askChatGPTInPortuguese } from '../utils/open-ai-function';

export class BotController {

    static async status(req: Request, res: Response): Promise<void> {
        res.json({ success: true, status: 'online', timestamp: new Date().toISOString() });
    }

    static async readMessage(req: Request, res: Response): Promise<void> {

        const allowed = {
            "qual é o seu nome?": "Qual é o seu nome?",
            "como funciona o serviço?": "Explique como funciona o serviço da empresa."
          };
          
        const resposta = await askChatGPTInPortuguese("Qual é o seu nome?", allowed);

        res.json({ success: true, messages: [] });
    }

    static async sendMessage(req: Request, res: Response): Promise<void> {
        res.json({ success: true, message: 'Message sent' });
    }

    static async register(req: Request, res: Response): Promise<void> {
        res.json({ success: true, message: 'Bot registered' });
    }

    /**
     * Internal methods
     */
    // private async 
    
};