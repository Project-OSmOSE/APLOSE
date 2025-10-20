import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'schema.graphql',
  documents: "src/api/**/*.graphql",
  ignoreNoDocuments: true,
  watch: true,
  generates: {
    'src/api/types.gql-generated.ts': {
      plugins: [ 'typescript' ],
    },
    'src/': {
      preset: 'near-operation-file',
      presetConfig: {
        baseTypesPath: '/api/types.gql-generated.ts',
      },
      plugins: [
        'typescript-operations',
        {
          'typescript-rtk-query': {
            importBaseApiFrom: '@/api/baseGqlApi',
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