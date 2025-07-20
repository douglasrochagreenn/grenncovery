"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionAnswer = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const questionAnswerSchema = new mongoose_1.Schema({
    question: {
        type: String,
        required: [true, 'Pergunta é obrigatória'],
        trim: true,
        minlength: [10, 'Pergunta deve ter pelo menos 10 caracteres'],
        maxlength: [1000, 'Pergunta não pode ter mais de 1000 caracteres']
    },
    answer: {
        type: String,
        trim: true,
        maxlength: [2000, 'Resposta não pode ter mais de 2000 caracteres'],
        default: ''
    },
    status: {
        type: String,
        enum: ['pending', 'answered', 'archived'],
        default: 'pending',
        required: true
    },
    producerId: {
        type: Number,
        index: true
    },
    clientId: {
        type: Number,
        index: true
    },
    clientName: {
        type: String,
        trim: true,
        maxlength: [100, 'Nome do cliente não pode ter mais de 100 caracteres']
    },
    clientEmail: {
        type: String,
        trim: true,
        lowercase: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Email deve ser válido'
        ]
    },
    productId: {
        type: Number,
        index: true
    },
    productName: {
        type: String,
        trim: true,
        maxlength: [200, 'Nome do produto não pode ter mais de 200 caracteres']
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    category: {
        type: String,
        trim: true,
        maxlength: [50, 'Categoria não pode ter mais de 50 caracteres']
    },
    tags: [{
            type: String,
            trim: true,
            maxlength: [30, 'Tag não pode ter mais de 30 caracteres']
        }],
    isPublic: {
        type: Boolean,
        default: false
    },
    answeredAt: {
        type: Date
    }
}, {
    timestamps: true,
    collection: 'questions_answers'
});
questionAnswerSchema.index({ status: 1 });
questionAnswerSchema.index({ priority: 1 });
questionAnswerSchema.index({ category: 1 });
questionAnswerSchema.index({ isPublic: 1 });
questionAnswerSchema.index({ createdAt: -1 });
questionAnswerSchema.index({ producerId: 1, status: 1 });
questionAnswerSchema.index({ clientEmail: 1 });
questionAnswerSchema.index({ productId: 1 });
questionAnswerSchema.pre('save', function (next) {
    if (this.isModified('status') && this.status === 'answered' && !this.answeredAt) {
        this.answeredAt = new Date();
    }
    next();
});
questionAnswerSchema.pre('save', function (next) {
    if (this.isModified('answer') && this.answer && this.answer.trim() !== '' && !this.answeredAt) {
        this.answeredAt = new Date();
        if (this.status === 'pending') {
            this.status = 'answered';
        }
    }
    next();
});
exports.QuestionAnswer = mongoose_1.default.model('QuestionAnswer', questionAnswerSchema);
//# sourceMappingURL=questionAnswer.model.js.map