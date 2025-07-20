import mongoose, { Document, Schema } from 'mongoose';

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

export interface IQuestionAnswerDocument extends IQuestionAnswer, Document {}

const questionAnswerSchema = new Schema<IQuestionAnswerDocument>({
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

// Índices para performance
questionAnswerSchema.index({ status: 1 });
questionAnswerSchema.index({ priority: 1 });
questionAnswerSchema.index({ category: 1 });
questionAnswerSchema.index({ isPublic: 1 });
questionAnswerSchema.index({ createdAt: -1 });
questionAnswerSchema.index({ producerId: 1, status: 1 });
questionAnswerSchema.index({ clientEmail: 1 });
questionAnswerSchema.index({ productId: 1 });

// Middleware para atualizar answeredAt quando status muda para 'answered'
questionAnswerSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'answered' && !this.answeredAt) {
    this.answeredAt = new Date();
  }
  next();
});

// Middleware para atualizar answeredAt quando answer é adicionada
questionAnswerSchema.pre('save', function(next) {
  if (this.isModified('answer') && this.answer && this.answer.trim() !== '' && !this.answeredAt) {
    this.answeredAt = new Date();
    if (this.status === 'pending') {
      this.status = 'answered';
    }
  }
  next();
});

export const QuestionAnswer = mongoose.model<IQuestionAnswerDocument>('QuestionAnswer', questionAnswerSchema);