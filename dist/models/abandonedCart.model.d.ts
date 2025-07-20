import mongoose, { Document } from 'mongoose';
import { AbandonedCartWebhook } from '../types/webhook.types';
export interface AbandonedCartDocument extends Document, AbandonedCartWebhook {
    createdAt: Date;
    updatedAt: Date;
    cart_status?: string;
    status_updated_at?: Date;
    status_updated_by?: string;
}
export declare const AbandonedCart: mongoose.Model<AbandonedCartDocument, {}, {}, {}, mongoose.Document<unknown, {}, AbandonedCartDocument> & AbandonedCartDocument & {
    _id: mongoose.Types.ObjectId;
}, any>;
//# sourceMappingURL=abandonedCart.model.d.ts.map