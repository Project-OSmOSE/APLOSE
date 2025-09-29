import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'schema.graphql',
  documents: "src/features/**/*.graphql",
  ignoreNoDocuments: true,
  watch: true,
  generates: {
    'src/features/_utils_/gql/types.generated.ts': {
      plugins: [ 'typescript' ],
    },
    'src/': {
      preset: 'near-operation-file',
      presetConfig: {
        baseTypesPath: '/features/_utils_/gql/types.generated.ts',
      },
      plugins: [
        'typescript-operations',
        {
          'typescript-rtk-query': {
            importBaseApiFrom: '@/features/_utils_/gql/baseApi.ts',
            importBaseApiAlternateName: 'gqlAPI',
          }
        }
      ],
    },
    '.introspection.json': {
      plugins: [ 'introspection' ]
    }
  },
}
export default config;