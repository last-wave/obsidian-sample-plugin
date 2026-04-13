import tseslint from 'typescript-eslint';
import obsidianmd from "eslint-plugin-obsidianmd";
import globals from "globals";
import { globalIgnores } from "eslint/config";

export default tseslint.config(
	{
		languageOptions: {
			globals: {
				...globals.browser,
			},
			parserOptions: {
				projectService: {
					allowDefaultProject: [
						'eslint.config.js',
						'manifest.json'
					]
				},
				tsconfigRootDir: import.meta.dirname,
				extraFileExtensions: ['.json']
			},
		},
	},
	...obsidianmd.configs.recommended, {
		rules: {
			curly: ['error', 'multi-line', 'consistent'],
			'arrow-body-style': ['error', 'as-needed'],
			'no-implicit-coercion': 'warn',
			'no-unneeded-ternary': 'error',
			'no-unused-vars': ['warn', {argsIgnorePattern: '^_', varsIgnorePattern: '^_'}],
			'prefer-arrow-callback': 'error',

			'padding-line-between-statements': [
				'error',
				{blankLine: 'always', prev: '*', next: 'return'},
				{blankLine: 'always', prev: 'function', next: 'function'},
				{blankLine: 'always', prev: ['const', 'let', 'var'], next: 'function'},
				{blankLine: 'always', prev: 'function', next: ['const', 'let', 'var']},
			],
		}
	},
	globalIgnores([
		"node_modules",
		"dist",
		"esbuild.config.mjs",
		"eslint.config.js",
		"version-bump.mjs",
		"versions.json",
		"main.js",
	]),
);
