import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';

export default tseslint.config(
  { ignores: ['dist/**', 'node_modules/**', '**/*.d.ts', 'vite.config.ts'] },

  js.configs.recommended,

  ...tseslint.configs.recommended,

  {
    plugins: { 'react-hooks': reactHooks },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },

  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      }],
      'no-empty': ['error', { allowEmptyCatch: true }],
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },

  // Guard the shared → features dependency direction: shared/ must stay
  // reusable by any feature, so it must not import from features/.
  {
    files: ['src/shared/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/features/*', '@/features/*/**'],
              message:
                'shared/ must not depend on features/. Move the consumer into the feature module, or promote the cross-cutting piece it needs into shared/.',
            },
          ],
        },
      ],
    },
  },
);
