import React, { useEffect, useState } from 'react';
import { PageTitle } from "../../components/PageTitle";
import imgTitle from '../../img/illust/pexels-berend-de-kort-1452701_1920_thin.webp';
import { getFormattedDate } from "../../utils";
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from "@ionic/react";
import { LightNews, useGqlSdk } from "../../api";
import { Pagination } from "../../components/Pagination/Pagination";
import './NewsPage.css';


export const NewsPage: React.FC = () => {
    const pageSize = 6;

    const [ currentPage, setCurrentPage ] = useState<number>(1)

    const [ newsTotal, setNewsTotal ] = useState<number>(0);
    const [ news, setNews ] = useState<Array<LightNews>>([]);

    const sdk = useGqlSdk()

    useEffect(() => {
        let isMounted = true;

        sdk.allNews({ limit: pageSize, offset: pageSize * (currentPage - 1) }).then(({ data }) => {
            if (!isMounted) return;
            setNewsTotal(data.allNews?.totalCount ?? 0)
            setNews((data.allNews?.results ?? []).filter(d => d !== null) as any ?? [])
        })

        return () => {
            isMounted = false;
        }
    }, [ currentPage ]);

    return (
        <div id="news-page">
            <PageTitle img={ imgTitle } imgAlt="News Banner">
                NEWS
            </PageTitle>

            <div className="content">
                { news.map(data => (
                    <IonCard key={ data.id } href={ `/news/${ data.id }` }>
                        { data.thumbnail && <img src={ data.thumbnail } alt={ data.title }/> }

                        <IonCardHeader>
                            <IonCardTitle>{ data.title }</IonCardTitle>
                            <IonCardSubtitle>{ getFormattedDate(data.date) }</IonCardSubtitle>
                        </IonCardHeader>

                        <IonCardContent>{ data.intro }</IonCardContent>
                    </IonCard>
                )) }
            </div>

            <Pagination totalCount={ newsTotal }
                        currentPage={ currentPage }
                        pageSize={ pageSize }
                        setPage={ setCurrentPage }/>
        </div>
    );
};
