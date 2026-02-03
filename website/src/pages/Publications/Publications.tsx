import { PageTitle } from '../../components/PageTitle';

import imgTitle from '../../img/illust/pexels-element-digital-1370295_thin.webp';
import React, { useEffect, useMemo, useState } from 'react';
import styles from './Publications.module.scss'
import { BibliographyCard } from '../../components/Bibliography/Bibliography';
import { ChipGroup } from '../../components/Chip';
import { Spinner } from '../../components/Spinner';
import { Bibliography, useGqlSdk } from '../../api';
import { BibliographyStatusEnum, BibliographyTypeEnum } from '../../api/types.gql-generated';

const ALL_TYPES = [
    BibliographyTypeEnum.Article,
    BibliographyTypeEnum.Conference,
    BibliographyTypeEnum.Poster,
    BibliographyTypeEnum.Software,
]

export const Publications: React.FC = () => {
    const [ bibliography, setBibliography ] = useState<(Bibliography & {
        section: number | 'Upcoming'
    })[]>([]);

    const sdk = useGqlSdk()

    const [ isLoading, setIsLoading ] = useState(true);
    const [ typeFilter, setTypeFilter ] = useState<BibliographyTypeEnum[]>(ALL_TYPES);
    const [ allTags, setAllTags ] = useState<string[]>([]);
    const [ tagFilter, setTagFilter ] = useState<string[]>([]);

    const sections = useMemo(() => {
        return [ ...new Set(bibliography.map(b => b.section)) ].sort((a, b) => {
            if (a === 'Upcoming') return -1;
            if (b === 'Upcoming') return 1;
            return b - a
        })
    }, [ bibliography ])

    useEffect(() => {
        let isMounted = true;
        setIsLoading(true)

        sdk.allBibliography().then(({ data }) => {
            if (!isMounted) return;

            const allBibliography: Bibliography[] = (data.allBibliography?.edges ?? [])
                .map(e => e?.node)
                .filter(b => b !== null) as any

            setBibliography(
                allBibliography
                    .sort((a, b) => {
                        if (a.status !== BibliographyStatusEnum.Published) return -1
                        if (b.status !== BibliographyStatusEnum.Published) return 1
                        return new Date(b.publicationDate).getTime() - new Date(b.publicationDate).getTime()
                    })
                    .map(b => ({
                        ...b,
                        section: b.status === 'Published' ? new Date(b.publicationDate).getFullYear() : b.status
                    }))
            )

            setAllTags(
                [ ...new Set(allBibliography?.flatMap(b =>
                    (b.tags ?? []).filter(t => t !== null)
                        .map(t => t!.name))
                ) ]
            )
        }).finally(() => setIsLoading(false))

        return () => {
            isMounted = false;
        }
    }, []);

    return (
        <div className={ styles.page }>
            <PageTitle className={ styles.title }
                       img={ imgTitle }
                       imgAlt="Publications Banner">
                SCIENTIFIC PUBLICATIONS
            </PageTitle>

            <div className={ styles.nav }>
                <div className={ styles.filter }>
                    <h6>Type</h6>
                    <ChipGroup labels={ ALL_TYPES }
                               activeLabels={ typeFilter }
                               setActiveLabels={ newLabels => setTypeFilter(newLabels as BibliographyTypeEnum[]) }/>
                </div>
                <div className={ styles.filter }>
                    <h6>Tags</h6>
                    <ChipGroup labels={ allTags } activeLabels={ tagFilter }
                               setActiveLabels={ newLabels => setTagFilter(newLabels) }/>
                </div>
            </div>

            <div className={ styles.content }>

                { isLoading && <Spinner/> }

                { sections.map(section => <Section key={ section }
                                                   section={ section }
                                                   bibliography={ bibliography
                                                       .filter(b => typeFilter.includes(b.type))
                                                       .filter(b => tagFilter.length === 0 || b.tags?.find(t => t && tagFilter.includes(t.name)))
                                                       .filter(b => b.section === section) }
                />) }
            </div>
        </div>
    );
};

export const Section: React.FC<{
    section: number | 'Upcoming',
    bibliography: Bibliography[],
}> = ({ section, bibliography }) => (
    <section>
        <h6>{ section }</h6>

        { bibliography.map((b: Bibliography, index) => <BibliographyCard reference={ b } key={ index }/>) }
        { bibliography.length === 0 && <p className={ styles.low }>No publications matching the filters</p> }
    </section>
)
