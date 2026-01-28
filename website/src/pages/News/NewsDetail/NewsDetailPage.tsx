import React, { useEffect, useMemo } from 'react';
import { useParams } from "react-router-dom";

import { getFormattedDate } from "../../../utils";
import { Back } from "../../../components/Back/Back";
import { DetailPage } from "../../../components/DetailPage/DetailPage";
import { HTMLContent } from '../../../components/HTMLContent/HTMLContent';
import { News, useGqlSdk } from "../../../api";
import { ContactList } from "../../../components/ContactList/ContactList";


export const NewsDetailPage: React.FC = () => {
    const { id: articleID } = useParams<{ id: string; }>();

    let [ article, setArticle ] = React.useState<News>();
    const authors = useMemo(() => {
        return [
            ...(article?.osmoseMemberAuthors.edges.map(e => e?.node).filter(n => !!n) ?? []),
            ...(article?.otherAuthors ?? [])
        ]
    }, [ article ])

    const sdk = useGqlSdk()

    useEffect(() => {
        let isMounted = true;

        sdk.newsById({ id: articleID }).then(({ data }) => {
            if (!isMounted) return;
            setArticle(data.newsById ?? undefined)
        })

        return () => {
            isMounted = false;
        }
    }, [ articleID ]);

    return (
        <DetailPage>
            <Back path="/news" pageName="News"></Back>

            <div className="head">
                <h1>{ article?.title }</h1>
                <p className="text-muted">{ getFormattedDate(article?.date) }</p>
            </div>

            <ContactList contacts={ authors as any }/>

            { article?.body && <HTMLContent content={ article.body }></HTMLContent> }
        </DetailPage>
    );
};
