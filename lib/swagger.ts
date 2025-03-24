import { createSwaggerSpec } from "next-swagger-doc";

export const getApiDocs = async () => {
    const spec = createSwaggerSpec({
        apiFolder: "app/api",
        definition: {
            openapi: "3.0.0",
            info: {
                title: "Swagger API",
                version: "1.0",
            },
            components: {
                securitySchemes: {
                    BearerAuth: {
                        type: "http",
                        scheme: "bearer",
                        bearerFormat: "JWT",
                    },
                },
            },
            schemas: {
                CreateCustomerSchema: {
                    type: "object",
                    required: ["email", "name"],
                    properties: {
                        email: {
                            type: "string",
                            format: "email",
                            description: "Customer's email address"
                        },
                        name: {
                            type: "string",
                            description: "Customer's full name"
                        },
                    }
                },
                Customer: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            format: "uuid"
                        },
                        email: {
                            type: "string"
                        },
                        name: {
                            type: "string"
                        },
                    }
                }
            },
            security: [],
        },
    });
    return spec;
};
