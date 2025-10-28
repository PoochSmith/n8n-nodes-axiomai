"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AxiomAiApi = void 0;
class AxiomAiApi {
    constructor() {
        this.name = 'axiomAiApi';
        this.displayName = 'Axiom.ai API';
        this.documentationUrl = 'https://axiom.ai';
        this.properties = [
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                typeOptions: {
                    password: true,
                },
                default: '',
                required: true,
                description: 'The API key for accessing Axiom.ai',
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {},
        };
        this.test = {
            request: {
                baseURL: 'https://lar.axiom.ai/api/v3/trigger',
                url: '',
                method: 'POST',
            },
        };
    }
}
exports.AxiomAiApi = AxiomAiApi;
