import React, { Fragment, useCallback, useRef, useState } from 'react';
import { createFileRoute, notFound, useLoaderData } from '@tanstack/react-router'
import { basicSetup, EditorView } from 'codemirror';
import { PostgreSQL, sql } from '@codemirror/lang-sql';
import { keymap } from '@codemirror/view';
import { defaultKeymap, indentWithTab } from '@codemirror/commands';
import { Prec } from '@codemirror/state';

import { SQLRestAPI } from '@/api/sql';
import { NBSP } from '@/service/type';
import { AppStore } from '@/features/App';
import { useCtrlKeyDownEvent } from '@/features/UX';

import { Head, Kbd, Pagination, Table, Tbody, Td, Th, Thead, Tr, WarningText } from '@/components/ui';
import { Button, ButtonGroup } from '@/components/base/Button';
import { Spinner } from '@/components/base/Spinner';

import styles from './sql.module.scss';
import { Content } from '@/components/layout/Content';

const SqlQuery: React.FC = () => {
    const { user } = useLoaderData({ from: '/_authenticated', select: ({ user }) => ({ user }) });
    const { schema } = Route.useLoaderData();
    const [ run, { data: results, error, isLoading } ] = SQLRestAPI.endpoints.postSQL.useMutation();

    const editorContainerRef = useRef<HTMLDivElement | undefined>();
    const editorRef = useRef<EditorView | undefined>();
    const [ page, setPage ] = useState(1);

    const runQuery = useCallback((page: number) => {
        if (isLoading) return
        setPage(page);
        const query = editorRef.current?.state.doc.toString()
        if (query) run({ query, page });
    }, [ run, setPage, isLoading ])
    const onEventRunQuery = useCallback(() => runQuery(1), [ runQuery ])
    useCtrlKeyDownEvent([ 'Enter' ], onEventRunQuery)

    const setupEditor = useCallback(() => {
        if (!editorContainerRef.current) return;
        if (editorRef.current) return;
        editorRef.current = new EditorView({
            doc: '-- SELECT entries from APLOSE\n',
            extensions: [
                basicSetup,
                sql({
                    dialect: PostgreSQL,
                    upperCaseKeywords: true,
                    schema,
                }),
                keymap.of([ ...defaultKeymap, indentWithTab ]),
                Prec.highest(keymap.of([ {
                    key: 'Ctrl-Enter',
                    run: () => {
                        return true;
                    },
                } ])),
            ],
            parent: editorContainerRef.current,
        })
    }, [ schema ])

    const download = useCallback(() => {
        if (!results) return;

        const csvFile = new Blob([
            [ results.columns.join(','),
                ...results.results.map(r => r.join(',')) ].join('\n'),
        ], { type: 'text/csv' });
        const downloadLink = document.createElement('a');
        downloadLink.download = 'results.csv';
        downloadLink.href = window.URL.createObjectURL(csvFile);
        downloadLink.style.display = 'none';
        document.body.appendChild(downloadLink);
        downloadLink.click();
    }, [ results ])

    if (!user.isSuperuser) return <Fragment/>
    return <Content start>

        <Head title="SQL Query"/>

        <div className={ styles.sql }
             ref={ ref => {
                 if (!ref || editorRef.current) return;
                 editorContainerRef.current = ref;
                 setupEditor();
             } }/>

        <ButtonGroup spaceBetween>
            <ButtonGroup>
                <Button color="primary" onClick={ onEventRunQuery } disabled={ isLoading }>
                    Run query{ NBSP }<Kbd keys={ [ 'ctrl', 'enter' ] }/>
                </Button>

                <Button color="primary" onClick={ download } disabled={ !results }>
                    Download
                </Button>

                { isLoading && <Spinner/> }
            </ButtonGroup>

            { results &&
                <Pagination className={ styles.pagination }
                            currentPage={ page }
                            totalPages={ results.pageCount }
                            setCurrentPage={ runQuery }/> }
        </ButtonGroup>

        { error && <WarningText className={ styles.error } error={ error }/> }

        { results && <Table className={ styles.results }>
            <Thead>
                <Tr>
                    { results.columns.map((c, i) => <Th scope="col" key={ i }>{ c }</Th>) }
                </Tr>
            </Thead>
            <Tbody>
                { results.results.map((row, k) => <Tr key={ k }>
                    { row.map((cell, i) => i === 0 ? <Th scope="row" key={ i }>{ cell }</Th> :
                        <Td key={ i }>{ cell }</Td>) }
                </Tr>) }
            </Tbody>
        </Table> }

    </Content>
}

export const Route = createFileRoute('/_authenticated/_superuser/sql')({
    component: SqlQuery,
    preload: false,
    loader: async () => {
        const { data: schema } = await AppStore.dispatch(SQLRestAPI.endpoints.sqlSchema.initiate())
        if (!schema) throw notFound();
        return { schema }
    },
})

