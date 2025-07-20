import mongoose, { Document } from 'mongoose';
import { IUser } from '../types/auth.types';
export interface IUserDocument extends IUser, Document {
    comparePassword(candidatePassword: string): Promise<boolean>;
    updateLastLogin(): Promise<void>;
}
export declare const User: mongoose.Model<IUserDocument, {}, {}, {}, mongoose.Document<unknown, {}, IUserDocument> & IUserDocument & {
    _id: mongoose.Types.ObjectId;
}, any>;
//# sourceMappingURL=user.model.d.ts.map