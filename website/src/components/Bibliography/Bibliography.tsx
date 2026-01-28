import React, { useCallback, useMemo } from "react";
import styles from "./item.module.scss";
import { Authors } from "./Authors";
import { IoLinkOutline } from "react-icons/io5";
import { Article, Author, Bibliography, Conference, Poster, Software } from "../../api";

export const BibliographyCard: React.FC<{ reference: Bibliography }> = ({ reference }) => {
    const status = useMemo(() => reference.status === 'Published' ? reference.publicationDate : reference.status, [ reference ]);
    const link = useMemo(() => {
        if (reference.doi) return `https://doi.org/${ reference.doi }`
        if (reference.__typename === 'PosterNode' && reference.posterUrl) return reference.posterUrl
        return undefined
    }, [ reference ]);

    const details = useMemo(() => {
        switch (reference.__typename) {
            case "ArticleNode":
                return <ArticleDetail article={ reference as Article }/>
            case "SoftwareNode":
                return <SoftwareDetail software={ reference as Software }/>
            case "ConferenceNode":
                return <ConferenceDetail info={ reference as Conference }/>
            case "PosterNode":
                return <ConferenceDetail info={ reference as Poster }/>
        }
    }, [ reference ])

    const authors: Author[] = useMemo(() => {
        return reference.authors.edges
            .filter(e => e !== null && e.node !== null)
            .map(e => e!.node as Author)
    }, [ reference ])

    const openLink = useCallback(() => {
        if (!link) return;
        window.open(link, "_blank", "noopener noreferrer");
    }, [ link ])

    return <div className={ [ styles.bibliography, link && styles.clickable ].join(' ') }
                onClick={ openLink }>
        <p className={ styles.title }>{ reference.title }</p>
        <p className={ styles.details }>
            <Authors authors={ authors }/>, ({ status }). { details }
        </p>
        { reference.tags && reference.tags.length > 0 && <div className={ styles.tags }>
            { reference.tags.map((tag, index) => tag && <p key={ index }>{ tag.name }</p>) }
        </div> }

        <div className={ styles.doiLinks }>
            { reference.doi &&
                <a href={ link } className={ styles.doi }
                   target="_blank" rel="noopener noreferrer">
                    <IoLinkOutline/>
                </a> }
        </div>

        <div className={ styles.type }>{ reference.type }</div>
    </div>
}

export const ArticleDetail: React.FC<{ article: Article }> = ({ article }) => {
    const details = useMemo(() => {
        const d = [];
        d.push(article.journal)
        if (article.volumes) d.push(article.volumes)
        if (article.pagesFrom) {
            if (article.pagesTo) d.push(`p${ article.pagesFrom }-${ article.pagesTo }`);
            else d.push(`p${ article.pagesFrom }`);
        }
        if (article.issueNb) d.push(article.issueNb)
        if (article.articleNb) d.push(article.articleNb)
        return d;
    }, [ article ])

    return <span>{ details.join(', ') }</span>
}

export const ConferenceDetail: React.FC<{ info: Conference | Poster }> = ({ info }) => (
    <span>
    <a href={ info.conferenceAbstractBookUrl ?? undefined }
       target="_blank" rel="noopener noreferrer">
    { info.conferenceName }
  </a>, { info.conferenceLocation }
  </span>
)

export const SoftwareDetail: React.FC<{ software: Software }> = ({ software }) => (
    <a href={ software.repositoryUrl ?? undefined }
       target="_blank" rel="noopener noreferrer">
        { software.publicationPlace }
    </a>
)