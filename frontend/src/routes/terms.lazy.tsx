import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import Markdown from 'react-markdown';

import { Footer, Header } from '@/components/layout';
import { Button, Link } from '@/components/ui';

import { useAppSelector } from '@/features/App';
import { selectIsConnected } from '@/features/Auth';

import homeStyles from './index.module.scss';
import styles from './terms.module.scss';

const TermsOfUse: React.FC = () => {
    const isConnected = useAppSelector(selectIsConnected)
    const router = useRouter();

    const accessAplose = useCallback(() => {
        if (isConnected) router.navigate({ to: '/annotation-campaign' });
        else router.navigate({ to: '/login' })
    }, [ router, isConnected ])

    const [ content, setContent ] = useState<string>();

    useEffect(() => {
        const rawFile = new XMLHttpRequest();
        rawFile.open('GET', '/backend/static/datawork/WEB/fr-terms.md');
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
        return <div className={ [ homeStyles.page, styles.page ].join(' ') }>
            <Header buttons={ <Fragment>
                <Button color="dark" fill="clear" size="large" onClick={ accessAplose }>
                    { isConnected ? 'APLOSE' : 'Login' }
                </Button>
                <Link href="/" size="large">OSmOSE</Link>
            </Fragment>
            }/>
            <div className={ [ homeStyles.content, styles.content ].join(' ') }>
                { content && <Markdown children={ content }/> }
            </div>
            <Footer/>
        </div>
    }, [ isConnected, accessAplose, content ])
}

export const Route = createFileRoute('/terms')({
    component: TermsOfUse,
})
