export interface ICreateQuestionAnswerRequest {
  question: string;
  answer?: string;
  status?: 'pending' | 'answered' | 'archived';
  producerId?: number;
  clientId?: number;
  clientName?: string;
  clientEmail?: string;
  productId?: number;
  productName?: string;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  tags?: string[];
  isPublic?: boolean;
}

export interface IUpdateQuestionAnswerRequest {
  question?: string;
  answer?: string;
  status?: 'pending' | 'answered' | 'archived';
  producerId?: number;
  clientId?: number;
  clientName?: string;
  clientEmail?: string;
  productId?: number;
  productName?: string;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  tags?: string[];
  isPublic?: boolean;
}

export interface IQuestionAnswerFilters {
  status?: 'pending' | 'answered' | 'archived';
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  producerId?: number;
  clientId?: number;
  productId?: number;
  clientEmail?: string;
  isPublic?: boolean;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface IQuestionAnswerResponse {
  _id: string;
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