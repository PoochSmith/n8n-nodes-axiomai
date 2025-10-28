import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

export class AxiomAi implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Axiom.ai',
		name: 'axiomai',
		icon: 'file:axiomai-logo.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Post data to Axiom.ai',
		defaults: {
			name: 'Axiom.ai',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'axiomAiApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Post Data',
						value: 'postData',
						description: 'Post 2D array data to Axiom.ai',
						action: 'Post data to axiom ai',
					},
				],
				default: 'postData',
			},
			{
				displayName: 'Axiom Name',
				name: 'axiomName',
				type: 'string',
				default: '',
				required: true,
				description: 'The name of your Axiom',
				displayOptions: {
					show: {
						operation: ['postData'],
					},
				},
			},
			{
				displayName: 'Input Mode',
				name: 'inputMode',
				type: 'options',
				options: [
					{
						name: 'Manual JSON',
						value: 'manual',
						description: 'Enter 2D array as JSON manually',
					},
					{
						name: 'From Input Items',
						value: 'items',
						description: 'Convert input items to 2D array automatically',
					},
					{
						name: 'From Expression',
						value: 'expression',
						description: 'Use expression to reference data from previous nodes',
					},
				],
				default: 'manual',
				description: 'How to provide the data to send to Axiom.ai',
				displayOptions: {
					show: {
						operation: ['postData'],
					},
				},
			},
			{
				displayName: 'Data',
				name: 'data',
				type: 'json',
				default: '[["A1", "B1", "C1"], ["A2", "B2", "C2"]]',
				required: true,
				description: 'The 2D array data to send to Axiom.ai. Must be a valid JSON array of arrays.',
				displayOptions: {
					show: {
						operation: ['postData'],
						inputMode: ['manual', 'expression'],
					},
				},
			},
			{
				displayName: 'Fields to Include',
				name: 'fields',
				type: 'string',
				default: '',
				placeholder: 'field1,field2,field3',
				description:
					'Comma-separated field names to include from input items. Leave empty to include all fields in order.',
				displayOptions: {
					show: {
						operation: ['postData'],
						inputMode: ['items'],
					},
				},
			},
			{
				displayName: 'Include Header Row',
				name: 'includeHeader',
				type: 'boolean',
				default: false,
				description: 'Whether to include field names as the first row',
				displayOptions: {
					show: {
						operation: ['postData'],
						inputMode: ['items'],
					},
				},
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const operation = this.getNodeParameter('operation', 0) as string;

		if (operation === 'postData') {
			// Get credentials once (same for all items)
			const credentials = await this.getCredentials('axiomAiApi');
			const apiKey = credentials.apiKey as string;
			const axiomName = this.getNodeParameter('axiomName', 0) as string;
			const inputMode = this.getNodeParameter('inputMode', 0) as string;

			let data: any[][];

			try {
				// Handle different input modes
				if (inputMode === 'items') {
					// Build 2D array from input items
					const fieldsParam = this.getNodeParameter('fields', 0, '') as string;
					const includeHeader = this.getNodeParameter('includeHeader', 0, false) as boolean;

					const fields = fieldsParam ? fieldsParam.split(',').map((f) => f.trim()) : null;
					data = [];

					// Add header row if requested
					if (includeHeader && items.length > 0) {
						const headerFields = fields || Object.keys(items[0].json);
						data.push(headerFields);
					}

					// Convert each item to a row
					for (const item of items) {
						const row: any[] = [];
						if (fields) {
							// Use specified fields in order
							for (const field of fields) {
								row.push(item.json[field] ?? '');
							}
						} else {
							// Use all fields in order
							row.push(...Object.values(item.json));
						}
						data.push(row);
					}
				} else {
					// Manual or expression mode
					const dataInput = this.getNodeParameter('data', 0) as string;
					if (typeof dataInput === 'string') {
						data = JSON.parse(dataInput);
					} else {
						data = dataInput as any[][];
					}
				}

				// Validate that data is a 2D array
				if (!Array.isArray(data)) {
					throw new NodeOperationError(this.getNode(), 'Data must be an array');
				}

			// Prepare the request body
			const body = {
				key: apiKey,
				name: axiomName,
				data: data,
			};

			// Make the API request
			const response = await this.helpers.httpRequest({
				method: 'POST',
				url: 'https://lar.axiom.ai/api/v3/trigger',
				body: body,
				headers: {
					'Content-Type': 'application/json',
				},
				json: true,
			});

				returnData.push({
					json: response,
					pairedItem: { item: 0 },
				});
			} catch (error) {
				if (this.continueOnFail()) {
					const errorMessage = error instanceof Error ? error.message : 'Unknown error';
					returnData.push({
						json: {
							error: errorMessage,
						},
						pairedItem: { item: 0 },
					});
				} else {
					throw error;
				}
			}
		}

		return [returnData];
	}
}
