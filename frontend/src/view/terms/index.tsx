import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { Footer, Header } from '@/components/layout';
import { Button, Link } from '@/components/ui';
import { useAppSelector } from '@/features/App';
import { selectIsConnected } from '@/features/Auth';
import { useNavigate } from 'react-router-dom';
import homeStyles from '../home/home.module.scss'
import styles from './styles.module.scss'
import Markdown from 'react-markdown';

const TermsOfUse: React.FC = () => {
    const isConnected = useAppSelector(selectIsConnected)
    const navigate = useNavigate();

    function accessAplose() {
        if (isConnected) navigate('/annotation-campaign');
        else navigate('/login')
    }

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
export default TermsOfUse;
