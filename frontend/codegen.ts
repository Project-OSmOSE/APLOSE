import type { CodegenConfig } from '@graphql-codegen/cli';

const scalars = {
    DateTime: 'string',
    Date: 'string',
    BigInt: 'number',
    Decimal: 'number',
    ID: 'string',
}
const config: CodegenConfig = {
    schema: 'schema.graphql',
    ignoreNoDocuments: true,
    watch: true,
    generates: {
        // 1️⃣ Generic TypeScript types (unique source)
        'src/api/types.gql-generated.ts': {
            documents: 'src/api/**/*.graphql',
            plugins: [ 'typescript' ],
            config: {
                useTypeImports: true,
                skipTypename: false,
                dedupeOperationSuffix: true,
                scalars,
            },
        },

        // 2️⃣ RTK Query in /api - Near-operation-file
        'src/api/': {
            documents: 'src/api/**/*.graphql',
            preset: 'near-operation-file',
            presetConfig: {
                baseTypesPath: 'types.gql-generated.ts',
                importTypesNamespace: '_Types',
            },
            plugins: [
                'typescript-operations',
                {
                    'typescript-rtk-query': {
                        importBaseApiFrom: '@/api/baseGqlApi',
                        importBaseApiAlternateName: 'gqlAPI',
                    },
                },
            ],
            config: {
                arrayInputCoercion: false,
                scalars
            },
        },

        // 3️⃣ React Query in /features - Near-operation-file
        'src/features': {
            documents: 'src/features/**/*.graphql',
            preset: 'near-operation-file',
            presetConfig: {
                baseTypesPath: '../api/types.gql-generated.ts',
                importTypesNamespace: '_Types',
            },
            plugins: [
                'typescript-operations',
                'typed-document-node',
            ],
            config: {
                useTypeImports: true,
                documentMode: 'documentNode',
                skipTypename: false,
                dedupeOperationSuffix: true,
                arrayInputCoercion: false,
                scalars,
            },
        },
    },
}
export default config;