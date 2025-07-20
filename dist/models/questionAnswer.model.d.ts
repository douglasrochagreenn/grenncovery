import mongoose, { Document } from 'mongoose';
export interface IQuestionAnswer {
    question: string;
    answer?: string;
    status: 'pending' | 'answered' | 'archived';
    producerId?: number;
    clientId?: number;
    clientName?: string;
    clientEmail?: string;
    productId?: number;
    productName?: string;
    priority: 'low' | 'medium' | 'high';
    category?: string;
    tags?: string[];
    isPublic: boolean;
    createdAt: Date;
    updatedAt: Date;
    answeredAt?: Date;
}
export interface IQuestionAnswerDocument extends IQuestionAnswer, Document {
}
export declare const QuestionAnswer: mongoose.Model<IQuestionAnswerDocument, {}, {}, {}, mongoose.Document<unknown, {}, IQuestionAnswerDocument> & IQuestionAnswerDocument & {
    _id: mongoose.Types.ObjectId;
}, any>;
//# sourceMappingURL=questionAnswer.model.d.ts.map