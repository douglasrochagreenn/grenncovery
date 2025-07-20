export declare const swaggerDefinition: {
    openapi: string;
    info: {
        title: string;
        version: string;
        description: string;
        contact: {
            name: string;
            email: string;
        };
    };
    servers: {
        url: string;
        description: string;
    }[];
    components: {
        securitySchemes: {
            bearerAuth: {
                type: string;
                scheme: string;
                bearerFormat: string;
                description: string;
            };
        };
        schemas: {
            QuestionAnswer: {
                type: string;
                properties: {
                    _id: {
                        type: string;
                        example: string;
                    };
                    question: {
                        type: string;
                        example: string;
                    };
                    answer: {
                        type: string;
                        example: string;
                    };
                    status: {
                        type: string;
                        enum: string[];
                        example: string;
                    };
                    producerId: {
                        type: string;
                        example: number;
                    };
                    clientId: {
                        type: string;
                        example: number;
                    };
                    clientName: {
                        type: string;
                        example: string;
                    };
                    clientEmail: {
                        type: string;
                        format: string;
                        example: string;
                    };
                    productId: {
                        type: string;
                        example: number;
                    };
                    productName: {
                        type: string;
                        example: string;
                    };
                    priority: {
                        type: string;
                        enum: string[];
                        example: string;
                    };
                    category: {
                        type: string;
                        example: string;
                    };
                    tags: {
                        type: string;
                        items: {
                            type: string;
                        };
                        example: string[];
                    };
                    isPublic: {
                        type: string;
                        example: boolean;
                    };
                    createdAt: {
                        type: string;
                        format: string;
                        example: string;
                    };
                    updatedAt: {
                        type: string;
                        format: string;
                        example: string;
                    };
                    answeredAt: {
                        type: string;
                        format: string;
                        example: string;
                    };
                };
            };
            CreateQuestionAnswerRequest: {
                type: string;
                required: string[];
                properties: {
                    question: {
                        type: string;
                        minLength: number;
                        maxLength: number;
                        example: string;
                    };
                    answer: {
                        type: string;
                        maxLength: number;
                        example: string;
                    };
                    status: {
                        type: string;
                        enum: string[];
                        example: string;
                    };
                    producerId: {
                        type: string;
                        example: number;
                    };
                    clientId: {
                        type: string;
                        example: number;
                    };
                    clientName: {
                        type: string;
                        maxLength: number;
                        example: string;
                    };
                    clientEmail: {
                        type: string;
                        format: string;
                        example: string;
                    };
                    productId: {
                        type: string;
                        example: number;
                    };
                    productName: {
                        type: string;
                        maxLength: number;
                        example: string;
                    };
                    priority: {
                        type: string;
                        enum: string[];
                        example: string;
                    };
                    category: {
                        type: string;
                        maxLength: number;
                        example: string;
                    };
                    tags: {
                        type: string;
                        items: {
                            type: string;
                            maxLength: number;
                        };
                        example: string[];
                    };
                    isPublic: {
                        type: string;
                        example: boolean;
                    };
                };
            };
            UpdateQuestionAnswerRequest: {
                type: string;
                properties: {
                    question: {
                        type: string;
                        minLength: number;
                        maxLength: number;
                        example: string;
                    };
                    answer: {
                        type: string;
                        maxLength: number;
                        example: string;
                    };
                    status: {
                        type: string;
                        enum: string[];
                        example: string;
                    };
                    producerId: {
                        type: string;
                        example: number;
                    };
                    clientId: {
                        type: string;
                        example: number;
                    };
                    clientName: {
                        type: string;
                        maxLength: number;
                        example: string;
                    };
                    clientEmail: {
                        type: string;
                        format: string;
                        example: string;
                    };
                    productId: {
                        type: string;
                        example: number;
                    };
                    productName: {
                        type: string;
                        maxLength: number;
                        example: string;
                    };
                    priority: {
                        type: string;
                        enum: string[];
                        example: string;
                    };
                    category: {
                        type: string;
                        maxLength: number;
                        example: string;
                    };
                    tags: {
                        type: string;
                        items: {
                            type: string;
                            maxLength: number;
                        };
                        example: string[];
                    };
                    isPublic: {
                        type: string;
                        example: boolean;
                    };
                };
            };
            AnswerQuestionRequest: {
                type: string;
                required: string[];
                properties: {
                    answer: {
                        type: string;
                        maxLength: number;
                        example: string;
                    };
                };
            };
            ErrorResponse: {
                type: string;
                properties: {
                    success: {
                        type: string;
                        example: boolean;
                    };
                    error: {
                        type: string;
                        example: string;
                    };
                    message: {
                        type: string;
                        example: string;
                    };
                };
            };
            AbandonedCartWebhook: {
                type: string;
                required: string[];
                properties: {
                    type: {
                        type: string;
                        example: string;
                    };
                    event: {
                        type: string;
                        example: string;
                    };
                    oldStatus: {
                        type: string;
                        example: string;
                    };
                    currentStatus: {
                        type: string;
                        example: string;
                    };
                    contract: {
                        type: string;
                        properties: {
                            id: {
                                type: string;
                                example: number;
                            };
                            start_date: {
                                type: string;
                                example: string;
                            };
                            created_at: {
                                type: string;
                                example: string;
                            };
                            updated_at: {
                                type: string;
                                example: string;
                            };
                            status: {
                                type: string;
                                example: string;
                            };
                            current_period_end: {
                                type: string;
                                example: string;
                            };
                        };
                    };
                    sale: {
                        type: string;
                        properties: {
                            id: {
                                type: string;
                                example: number;
                            };
                            type: {
                                type: string;
                                example: string;
                            };
                            status: {
                                type: string;
                                example: string;
                            };
                            created_at: {
                                type: string;
                                example: string;
                            };
                            update_at: {
                                type: string;
                                example: string;
                            };
                            seller_id: {
                                type: string;
                                example: number;
                            };
                            installments: {
                                type: string;
                                example: number;
                            };
                            method: {
                                type: string;
                                example: string;
                            };
                            client_id: {
                                type: string;
                                example: number;
                            };
                            amount: {
                                type: string;
                                example: number;
                            };
                            proposal_id: {
                                type: string;
                                nullable: boolean;
                                example: null;
                            };
                            total: {
                                type: string;
                                example: number;
                            };
                        };
                    };
                    client: {
                        type: string;
                        properties: {
                            id: {
                                type: string;
                                example: number;
                            };
                            name: {
                                type: string;
                                example: string;
                            };
                            email: {
                                type: string;
                                format: string;
                                example: string;
                            };
                            cellphone: {
                                type: string;
                                example: string;
                            };
                            document: {
                                type: string;
                                example: string;
                            };
                            cpf_cnpj: {
                                type: string;
                                example: string;
                            };
                            zipcode: {
                                type: string;
                                example: string;
                            };
                            street: {
                                type: string;
                                example: string;
                            };
                            number: {
                                type: string;
                                example: string;
                            };
                            complement: {
                                type: string;
                                example: string;
                            };
                            neighborhood: {
                                type: string;
                                example: string;
                            };
                            city: {
                                type: string;
                                example: string;
                            };
                            uf: {
                                type: string;
                                example: string;
                            };
                            created_at: {
                                type: string;
                                example: string;
                            };
                            updated_at: {
                                type: string;
                                example: string;
                            };
                        };
                    };
                    product: {
                        type: string;
                        properties: {
                            id: {
                                type: string;
                                example: number;
                            };
                            name: {
                                type: string;
                                example: string;
                            };
                            description: {
                                type: string;
                                example: string;
                            };
                            category_id: {
                                type: string;
                                example: number;
                            };
                            stock: {
                                type: string;
                                nullable: boolean;
                                example: null;
                            };
                            type: {
                                type: string;
                                example: string;
                            };
                            amount: {
                                type: string;
                                example: number;
                            };
                            period: {
                                type: string;
                                example: number;
                            };
                            thank_you_page: {
                                type: string;
                                nullable: boolean;
                                example: null;
                            };
                            created_at: {
                                type: string;
                                example: string;
                            };
                            updated_at: {
                                type: string;
                                example: string;
                            };
                            seller_id: {
                                type: string;
                                example: number;
                            };
                            slug: {
                                type: string;
                                example: string;
                            };
                            method: {
                                type: string;
                                example: string;
                            };
                            product_type_id: {
                                type: string;
                                example: number;
                            };
                            status_changed_at: {
                                type: string;
                                example: string;
                            };
                            product_id: {
                                type: string;
                                example: number;
                            };
                            hash: {
                                type: string;
                                example: string;
                            };
                        };
                    };
                    oferta: {
                        type: string;
                        example: string;
                    };
                    offer: {
                        type: string;
                        properties: {
                            hash: {
                                type: string;
                                example: string;
                            };
                            amount: {
                                type: string;
                                example: number;
                            };
                            method: {
                                type: string;
                                example: string;
                            };
                            name: {
                                type: string;
                                example: string;
                            };
                            created_at: {
                                type: string;
                                example: string;
                            };
                        };
                    };
                    seller: {
                        type: string;
                        properties: {
                            id: {
                                type: string;
                                example: number;
                            };
                            name: {
                                type: string;
                                example: string;
                            };
                            email: {
                                type: string;
                                format: string;
                                example: string;
                            };
                            cellphone: {
                                type: string;
                                example: string;
                            };
                        };
                    };
                    affiliate: {
                        type: string;
                        nullable: boolean;
                        example: null;
                    };
                    productMetas: {
                        type: string;
                        items: {
                            type: string;
                        };
                        example: never[];
                    };
                    proposalMetas: {
                        type: string;
                        items: {
                            type: string;
                        };
                        example: never[];
                    };
                };
            };
            AbandonedCart: {
                type: string;
                properties: {
                    _id: {
                        type: string;
                        example: string;
                    };
                    type: {
                        type: string;
                        example: string;
                    };
                    event: {
                        type: string;
                        example: string;
                    };
                    sale: {
                        $ref: string;
                    };
                    client: {
                        $ref: string;
                    };
                    product: {
                        $ref: string;
                    };
                    seller: {
                        $ref: string;
                    };
                    createdAt: {
                        type: string;
                        format: string;
                        example: string;
                    };
                    updatedAt: {
                        type: string;
                        format: string;
                        example: string;
                    };
                };
            };
        };
    };
    paths: {
        '/api/questions-answers': {
            post: {
                summary: string;
                description: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                            example: {
                                question: string;
                                clientName: string;
                                clientEmail: string;
                                productName: string;
                                priority: string;
                                category: string;
                                tags: string[];
                                isPublic: boolean;
                            };
                        };
                    };
                };
                responses: {
                    201: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                            example: boolean;
                                        };
                                        message: {
                                            type: string;
                                            example: string;
                                        };
                                        data: {
                                            $ref: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                    400: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    401: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                };
            };
            get: {
                summary: string;
                description: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                parameters: ({
                    in: string;
                    name: string;
                    schema: {
                        type: string;
                        minimum: number;
                        default: number;
                        maximum?: undefined;
                        enum?: undefined;
                        format?: undefined;
                    };
                    description: string;
                } | {
                    in: string;
                    name: string;
                    schema: {
                        type: string;
                        minimum: number;
                        maximum: number;
                        default: number;
                        enum?: undefined;
                        format?: undefined;
                    };
                    description: string;
                } | {
                    in: string;
                    name: string;
                    schema: {
                        type: string;
                        enum: string[];
                        minimum?: undefined;
                        default?: undefined;
                        maximum?: undefined;
                        format?: undefined;
                    };
                    description: string;
                } | {
                    in: string;
                    name: string;
                    schema: {
                        type: string;
                        minimum?: undefined;
                        default?: undefined;
                        maximum?: undefined;
                        enum?: undefined;
                        format?: undefined;
                    };
                    description: string;
                } | {
                    in: string;
                    name: string;
                    schema: {
                        type: string;
                        format: string;
                        minimum?: undefined;
                        default?: undefined;
                        maximum?: undefined;
                        enum?: undefined;
                    };
                    description: string;
                })[];
                responses: {
                    200: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                            example: boolean;
                                        };
                                        message: {
                                            type: string;
                                            example: string;
                                        };
                                        data: {
                                            type: string;
                                            properties: {
                                                questionAnswers: {
                                                    type: string;
                                                    items: {
                                                        $ref: string;
                                                    };
                                                };
                                                pagination: {
                                                    type: string;
                                                    properties: {
                                                        page: {
                                                            type: string;
                                                            example: number;
                                                        };
                                                        limit: {
                                                            type: string;
                                                            example: number;
                                                        };
                                                        total: {
                                                            type: string;
                                                            example: number;
                                                        };
                                                        totalPages: {
                                                            type: string;
                                                            example: number;
                                                        };
                                                        hasNext: {
                                                            type: string;
                                                            example: boolean;
                                                        };
                                                        hasPrev: {
                                                            type: string;
                                                            example: boolean;
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                    401: {
                        description: string;
                    };
                };
            };
        };
        '/api/questions-answers/stats': {
            get: {
                summary: string;
                description: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                responses: {
                    200: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                            example: boolean;
                                        };
                                        message: {
                                            type: string;
                                            example: string;
                                        };
                                        data: {
                                            type: string;
                                            properties: {
                                                total: {
                                                    type: string;
                                                    properties: {
                                                        totalQuestions: {
                                                            type: string;
                                                            example: number;
                                                        };
                                                        pendingQuestions: {
                                                            type: string;
                                                            example: number;
                                                        };
                                                        answeredQuestions: {
                                                            type: string;
                                                            example: number;
                                                        };
                                                        archivedQuestions: {
                                                            type: string;
                                                            example: number;
                                                        };
                                                    };
                                                };
                                                byPriority: {
                                                    type: string;
                                                    properties: {
                                                        low: {
                                                            type: string;
                                                            example: number;
                                                        };
                                                        medium: {
                                                            type: string;
                                                            example: number;
                                                        };
                                                        high: {
                                                            type: string;
                                                            example: number;
                                                        };
                                                    };
                                                };
                                                byCategory: {
                                                    type: string;
                                                    items: {
                                                        type: string;
                                                        properties: {
                                                            category: {
                                                                type: string;
                                                                example: string;
                                                            };
                                                            count: {
                                                                type: string;
                                                                example: number;
                                                            };
                                                        };
                                                    };
                                                };
                                                byPeriod: {
                                                    type: string;
                                                    properties: {
                                                        today: {
                                                            type: string;
                                                            example: number;
                                                        };
                                                        week: {
                                                            type: string;
                                                            example: number;
                                                        };
                                                        month: {
                                                            type: string;
                                                            example: number;
                                                        };
                                                    };
                                                };
                                                responseRate: {
                                                    type: string;
                                                    example: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                    401: {
                        description: string;
                    };
                };
            };
        };
        '/api/questions-answers/{id}': {
            get: {
                summary: string;
                description: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    in: string;
                    name: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                    description: string;
                }[];
                responses: {
                    200: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                            example: boolean;
                                        };
                                        message: {
                                            type: string;
                                            example: string;
                                        };
                                        data: {
                                            $ref: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                    404: {
                        description: string;
                    };
                    401: {
                        description: string;
                    };
                };
            };
            put: {
                summary: string;
                description: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    in: string;
                    name: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                    description: string;
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                            example: {
                                answer: string;
                                status: string;
                                priority: string;
                                isPublic: boolean;
                            };
                        };
                    };
                };
                responses: {
                    200: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                            example: boolean;
                                        };
                                        message: {
                                            type: string;
                                            example: string;
                                        };
                                        data: {
                                            $ref: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                    400: {
                        description: string;
                    };
                    404: {
                        description: string;
                    };
                    401: {
                        description: string;
                    };
                };
            };
            delete: {
                summary: string;
                description: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    in: string;
                    name: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                    description: string;
                }[];
                responses: {
                    200: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                            example: boolean;
                                        };
                                        message: {
                                            type: string;
                                            example: string;
                                        };
                                        data: {
                                            type: string;
                                            properties: {
                                                id: {
                                                    type: string;
                                                    example: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                    404: {
                        description: string;
                    };
                    401: {
                        description: string;
                    };
                };
            };
        };
        '/api/questions-answers/{id}/answer': {
            patch: {
                summary: string;
                description: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    in: string;
                    name: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                    description: string;
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                            example: {
                                answer: string;
                            };
                        };
                    };
                };
                responses: {
                    200: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                            example: boolean;
                                        };
                                        message: {
                                            type: string;
                                            example: string;
                                        };
                                        data: {
                                            $ref: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                    400: {
                        description: string;
                    };
                    404: {
                        description: string;
                    };
                    401: {
                        description: string;
                    };
                };
            };
        };
        '/webhook/greenncovery': {
            post: {
                summary: string;
                description: string;
                tags: string[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    200: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                            example: boolean;
                                        };
                                        message: {
                                            type: string;
                                            example: string;
                                        };
                                        data: {
                                            type: string;
                                            properties: {
                                                id: {
                                                    type: string;
                                                    example: string;
                                                };
                                                saleId: {
                                                    type: string;
                                                    example: number;
                                                };
                                                clientEmail: {
                                                    type: string;
                                                    example: string;
                                                };
                                                productName: {
                                                    type: string;
                                                    example: string;
                                                };
                                                amount: {
                                                    type: string;
                                                    example: number;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                    400: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    500: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                };
            };
        };
        '/webhook/abandoned-cart': {
            post: {
                summary: string;
                description: string;
                tags: string[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    200: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                            example: boolean;
                                        };
                                        message: {
                                            type: string;
                                            example: string;
                                        };
                                        data: {
                                            type: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                    400: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    500: {
                        description: string;
                    };
                };
            };
        };
        '/webhook/health': {
            get: {
                summary: string;
                description: string;
                tags: string[];
                responses: {
                    200: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    properties: {
                                        status: {
                                            type: string;
                                            example: string;
                                        };
                                        timestamp: {
                                            type: string;
                                            example: string;
                                        };
                                        service: {
                                            type: string;
                                            example: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
        '/api/abandoned-carts': {
            get: {
                summary: string;
                description: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                parameters: ({
                    in: string;
                    name: string;
                    schema: {
                        type: string;
                        minimum: number;
                        default: number;
                        maximum?: undefined;
                    };
                    description: string;
                } | {
                    in: string;
                    name: string;
                    schema: {
                        type: string;
                        minimum: number;
                        maximum: number;
                        default: number;
                    };
                    description: string;
                } | {
                    in: string;
                    name: string;
                    schema: {
                        type: string;
                        minimum?: undefined;
                        default?: undefined;
                        maximum?: undefined;
                    };
                    description: string;
                })[];
                responses: {
                    200: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                            example: boolean;
                                        };
                                        message: {
                                            type: string;
                                            example: string;
                                        };
                                        data: {
                                            type: string;
                                            properties: {
                                                carts: {
                                                    type: string;
                                                    items: {
                                                        $ref: string;
                                                    };
                                                };
                                                pagination: {
                                                    type: string;
                                                    properties: {
                                                        page: {
                                                            type: string;
                                                            example: number;
                                                        };
                                                        limit: {
                                                            type: string;
                                                            example: number;
                                                        };
                                                        total: {
                                                            type: string;
                                                            example: number;
                                                        };
                                                        totalPages: {
                                                            type: string;
                                                            example: number;
                                                        };
                                                        hasNext: {
                                                            type: string;
                                                            example: boolean;
                                                        };
                                                        hasPrev: {
                                                            type: string;
                                                            example: boolean;
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                    401: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                };
            };
        };
        '/api/abandoned-carts/stats/overview': {
            get: {
                summary: string;
                description: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                responses: {
                    200: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                            example: boolean;
                                        };
                                        message: {
                                            type: string;
                                            example: string;
                                        };
                                        data: {
                                            type: string;
                                            properties: {
                                                totalCarts: {
                                                    type: string;
                                                    example: number;
                                                };
                                                totalValue: {
                                                    type: string;
                                                    example: number;
                                                };
                                                averageValue: {
                                                    type: string;
                                                    example: number;
                                                };
                                                todayCarts: {
                                                    type: string;
                                                    example: number;
                                                };
                                                weekCarts: {
                                                    type: string;
                                                    example: number;
                                                };
                                                monthCarts: {
                                                    type: string;
                                                    example: number;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                    401: {
                        description: string;
                    };
                };
            };
        };
        '/auth/login': {
            post: {
                summary: string;
                description: string;
                tags: string[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                type: string;
                                required: string[];
                                properties: {
                                    email: {
                                        type: string;
                                        format: string;
                                        example: string;
                                    };
                                    password: {
                                        type: string;
                                        example: string;
                                        minLength: number;
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    200: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                            example: boolean;
                                        };
                                        message: {
                                            type: string;
                                            example: string;
                                        };
                                        data: {
                                            type: string;
                                            properties: {
                                                token: {
                                                    type: string;
                                                    example: string;
                                                };
                                                expiresIn: {
                                                    type: string;
                                                    example: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                    401: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                };
            };
        };
        '/auth/register': {
            post: {
                summary: string;
                description: string;
                tags: string[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                type: string;
                                required: string[];
                                properties: {
                                    name: {
                                        type: string;
                                        example: string;
                                        minLength: number;
                                        maxLength: number;
                                    };
                                    email: {
                                        type: string;
                                        format: string;
                                        example: string;
                                    };
                                    password: {
                                        type: string;
                                        example: string;
                                        minLength: number;
                                    };
                                    confirmPassword: {
                                        type: string;
                                        example: string;
                                        minLength: number;
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    201: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                            example: boolean;
                                        };
                                        message: {
                                            type: string;
                                            example: string;
                                        };
                                        data: {
                                            type: string;
                                            properties: {
                                                user: {
                                                    type: string;
                                                    properties: {
                                                        _id: {
                                                            type: string;
                                                            example: string;
                                                        };
                                                        name: {
                                                            type: string;
                                                            example: string;
                                                        };
                                                        email: {
                                                            type: string;
                                                            example: string;
                                                        };
                                                        role: {
                                                            type: string;
                                                            example: string;
                                                        };
                                                        isActive: {
                                                            type: string;
                                                            example: boolean;
                                                        };
                                                    };
                                                };
                                                token: {
                                                    type: string;
                                                    example: string;
                                                };
                                                expiresIn: {
                                                    type: string;
                                                    example: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                    400: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                };
            };
        };
        '/auth/profile': {
            get: {
                summary: string;
                description: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                responses: {
                    200: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                            example: boolean;
                                        };
                                        message: {
                                            type: string;
                                            example: string;
                                        };
                                        data: {
                                            type: string;
                                            properties: {
                                                user: {
                                                    type: string;
                                                    properties: {
                                                        _id: {
                                                            type: string;
                                                            example: string;
                                                        };
                                                        name: {
                                                            type: string;
                                                            example: string;
                                                        };
                                                        email: {
                                                            type: string;
                                                            example: string;
                                                        };
                                                        role: {
                                                            type: string;
                                                            example: string;
                                                        };
                                                        isActive: {
                                                            type: string;
                                                            example: boolean;
                                                        };
                                                        lastLogin: {
                                                            type: string;
                                                            format: string;
                                                        };
                                                        createdAt: {
                                                            type: string;
                                                            format: string;
                                                        };
                                                        updatedAt: {
                                                            type: string;
                                                            format: string;
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                    401: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                };
            };
        };
        '/auth/verify-token': {
            post: {
                summary: string;
                description: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                responses: {
                    200: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                            example: boolean;
                                        };
                                        message: {
                                            type: string;
                                            example: string;
                                        };
                                        data: {
                                            type: string;
                                            properties: {
                                                valid: {
                                                    type: string;
                                                    example: boolean;
                                                };
                                                expiresAt: {
                                                    type: string;
                                                    format: string;
                                                };
                                                user: {
                                                    type: string;
                                                    properties: {
                                                        userId: {
                                                            type: string;
                                                            example: string;
                                                        };
                                                        email: {
                                                            type: string;
                                                            example: string;
                                                        };
                                                        role: {
                                                            type: string;
                                                            example: string;
                                                        };
                                                    };
                                                };
                                                expiringSoon: {
                                                    type: string;
                                                    example: boolean;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                    401: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                };
            };
        };
        '/api/abandoned-carts/{id}': {
            get: {
                summary: string;
                description: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    in: string;
                    name: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                    description: string;
                }[];
                responses: {
                    200: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                            example: boolean;
                                        };
                                        message: {
                                            type: string;
                                            example: string;
                                        };
                                        data: {
                                            $ref: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                    404: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    401: {
                        description: string;
                    };
                };
            };
        };
        '/api/abandoned-carts/stats/daily': {
            get: {
                summary: string;
                description: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    in: string;
                    name: string;
                    schema: {
                        type: string;
                        minimum: number;
                        maximum: number;
                        default: number;
                    };
                    description: string;
                }[];
                responses: {
                    200: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                            example: boolean;
                                        };
                                        message: {
                                            type: string;
                                            example: string;
                                        };
                                        data: {
                                            type: string;
                                            items: {
                                                type: string;
                                                properties: {
                                                    date: {
                                                        type: string;
                                                        format: string;
                                                        example: string;
                                                    };
                                                    count: {
                                                        type: string;
                                                        example: number;
                                                    };
                                                    totalValue: {
                                                        type: string;
                                                        example: number;
                                                    };
                                                    averageValue: {
                                                        type: string;
                                                        example: number;
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                    401: {
                        description: string;
                    };
                };
            };
        };
        '/health': {
            get: {
                summary: string;
                description: string;
                tags: string[];
                responses: {
                    200: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    properties: {
                                        status: {
                                            type: string;
                                            example: string;
                                        };
                                        timestamp: {
                                            type: string;
                                            example: string;
                                        };
                                        service: {
                                            type: string;
                                            example: string;
                                        };
                                        version: {
                                            type: string;
                                            example: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
    };
    tags: {
        name: string;
        description: string;
    }[];
};
//# sourceMappingURL=swagger.d.ts.map