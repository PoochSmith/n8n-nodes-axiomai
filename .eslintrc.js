module.exports = {
	root: true,
	env: {
		node: true,
		es2021: true,
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2021,
		sourceType: 'module',
		project: './tsconfig.json',
		extraFileExtensions: ['.json'],
	},
	plugins: ['@typescript-eslint', 'n8n-nodes-base'],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:n8n-nodes-base/community',
	],
	rules: {
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
		'n8n-nodes-base/node-class-description-inputs-wrong-regular-node': 'error',
		'n8n-nodes-base/node-class-description-outputs-wrong': 'error',
		'n8n-nodes-base/node-execute-block-wrong-error-thrown': 'error',
	},
	ignorePatterns: ['dist/**', 'node_modules/**', '*.js'],
};

