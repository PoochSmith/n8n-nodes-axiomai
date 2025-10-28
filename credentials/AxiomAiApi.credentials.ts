import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class AxiomAiApi implements ICredentialType {
	name = 'axiomAiApi';
	displayName = 'Axiom.ai API';
	documentationUrl = 'https://axiom.ai';
	properties: INodeProperties[] = [
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

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://lar.axiom.ai/api/v3/trigger',
			url: '',
			method: 'POST',
		},
	};
}
