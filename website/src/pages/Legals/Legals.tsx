import React, { Fragment, useEffect, useMemo, useState } from 'react';
import styles from './styles.module.scss'
import { HTMLContent } from '../../components/HTMLContent/HTMLContent';

export const Legals: React.FC = () => {
    const [ content, setContent ] = useState<string>();

    useEffect(() => {
        let rawFile = new XMLHttpRequest();
        rawFile.open('GET', '/backend/static/datawork/WEB/fr-legals.html');
        rawFile.onreadystatechange = () => {
            if (rawFile.readyState === 4) {
                if (rawFile.status === 200 || rawFile.status === 0) {
                    setContent(rawFile.responseText);
                }
            }
        };
        rawFile.send(null);
    }, []);

    return useMemo(() => {
        if (!content) return <Fragment/>
        return <div className={ [ styles.page, 'container' ].join(' ') }>
            <HTMLContent content={ content }/>
        </div>
    }, [ content ])
}