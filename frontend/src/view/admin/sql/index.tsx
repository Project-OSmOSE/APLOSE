import React, { Fragment, useCallback, useEffect, useRef } from 'react';
import { basicSetup, EditorView } from 'codemirror';
import { PostgreSQL, sql } from '@codemirror/lang-sql';
import { defaultKeymap, indentWithTab } from '@codemirror/commands';
import { keymap } from '@codemirror/view';
import { Button, Kbd, Table, Pagination, Tbody, Td, Th, Thead, Tr, WarningText } from '@/components/ui';
import { Prec } from '@codemirror/state';
import styles from './styles.module.scss'
import { useCurrentUser } from '@/api';
import { SQLRestAPI } from '@/api/sql';
import { NBSP } from '@/service/type';


export const SqlQuery: React.FC = () => {
    const { user } = useCurrentUser();
    const { data: schema } = SQLRestAPI.endpoints.sqlSchema.useQuery();
    const [ run, { data: results, error } ] = SQLRestAPI.endpoints.postSQL.useMutation();

    const editorContainerRef = useRef<HTMLDivElement | undefined>();
    const editorRef = useRef<EditorView | undefined>();
    const pageRef = useRef<number>(1);

    const runQuery = useCallback((page: number) => {
        pageRef.current = page;
        const query = editorRef.current?.state.doc.toString()
        if (query) run({ query, page });
    }, [ run ])

    const setupEditor = useCallback(() => {
        if (!editorContainerRef.current) return;
        if (!schema) return;
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
                        runQuery(1)
                        return true;
                    },
                } ])),
            ],
            parent: editorContainerRef.current,
        })
    }, [ schema ])
    useEffect(() => {
        setupEditor()
    }, [ schema ]);

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

    if (!user || !user.isSuperuser) return <Fragment/>
    return <div className={ styles.page }>

        <h2>SQL Query</h2>

        <div className={ styles.sql }
             ref={ ref => {
                 if (!ref || editorRef.current) return;
                 editorContainerRef.current = ref;
                 setupEditor();
             } }/>

        <Button fill="outline" className={ styles.run } onClick={ () => runQuery(1) }>Run query{ NBSP }<Kbd
            keys={ [ 'ctrl', 'enter' ] }/></Button>

        <Button fill="outline" className={ styles.download }
                onClick={ download } disabled={ !results }>Download</Button>

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

        { results &&
            <Pagination className={ styles.pagination }
                        currentPage={ pageRef.current }
                        totalPages={ results.pageCount }
                        setCurrentPage={ runQuery }/> }
    </div>
}

export default SqlQuery
