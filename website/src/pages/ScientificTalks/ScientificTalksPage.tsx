import React, { useEffect, useState } from 'react';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from "@ionic/react";
import { getFormattedDate } from "../../utils";
import { PageTitle } from "../../components/PageTitle";
import imgTitle from '../../img/illust/pexels-berend-de-kort-1452701_1920_thin.webp';
import styles from './ScientificTalksPage.module.scss';
import { ScientificTalk, useGqlSdk } from "../../api";
import { Pagination } from "../../components/Pagination/Pagination";
import { ContactList } from "../../components/ContactList/ContactList";

export const ScientificTalksPage: React.FC = () => {
    const pageSize = 6;// Define page size for pagination
    const [ currentPage, setCurrentPage ] = useState<number>(1)
    const [ talksTotal, setTalksTotal ] = useState<number>(0); // State to hold the total number of talks
    const [ talks, setTalks ] = useState<Array<ScientificTalk>>([]); // State to hold the list of talks
    const sdk = useGqlSdk()

    useEffect(() => {
        let isMounted = true;

        setTalks([])
        sdk.allScientificTalks({ limit: pageSize, offset: pageSize * (currentPage - 1) }).then(({ data }) => {
            if (!isMounted) return;
            setTalksTotal(data.allScientificTalks?.totalCount ?? 0)
            setTalks((data.allScientificTalks?.results ?? []).filter(d => d !== null) as any ?? [])
        })

        return () => {
            isMounted = false;
        };
    }, [ currentPage, pageSize ]); // Effect dependencies: currentPage and pagesize

    return (
        <div>
            <PageTitle img={ imgTitle } imgAlt="Scientific talks Banner">
                Scientific talks
            </PageTitle>

            <div className={ styles.content }>

                <p className={ styles.presentation }>
                    Our team organises scientific talks on a three-week cycle, providing a platform for sharing and
                    disseminating knowledge. Team members present their latest project results and research
                    developments.
                    These sessions occasionally feature guest speakers, who bring fresh perspectives and expertise from
                    their
                    respective fields.
                </p>

                { talks.map((talk, index) => (
                    <IonCard key={ index } className={ styles.card }>
                        { talk.thumbnail && <img src={ talk.thumbnail } alt={ talk.title }/> }

                        <IonCardHeader>
                            <IonCardTitle>{ talk.title }</IonCardTitle>
                            <IonCardSubtitle>{ getFormattedDate(talk.date) }</IonCardSubtitle>
                        </IonCardHeader>

                        <IonCardContent>{ talk.intro }</IonCardContent>

                        <IonCardHeader className={ styles.presenterInfo }>
                            <IonCardSubtitle className={ styles.presenter }>
                                <ContactList contacts={ [
                                    ...(talk?.osmoseMemberPresenters.edges.map(e => e?.node).filter(n => !!n) ?? []),
                                    ...(talk?.otherPresenters ?? [])
                                ] as any }/>
                            </IonCardSubtitle>
                        </IonCardHeader>
                    </IonCard>
                )) }
            </div>

            <Pagination totalCount={ talksTotal }
                        currentPage={ currentPage }
                        pageSize={ pageSize }
                        setPage={ setCurrentPage }/>
        </div>
    );
};
