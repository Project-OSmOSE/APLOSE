import { PageTitle } from '../../components/PageTitle';

import imgTitle from '../../img/illust/sperm-whale-tail_1920_thin.webp';

import './Projects.css';

import React, { useEffect, useState } from 'react';
import { getYear } from '../../utils';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/react';
import { Pagination } from '../../components/Pagination/Pagination';
import { DeploymentsMap } from '../../components/DeploymentsMap';
import { LightDeployment, LightProject, useGqlSdk } from "../../api";

export const Projects: React.FC = () => {
    const pageSize = 6;

    const [ currentPage, setCurrentPage ] = useState<number>(1);
    const [ projectsTotal, setProjectsTotal ] = useState<number>(0);
    const [ projects, setProjects ] = useState<Array<LightProject>>([]);

    const [ selectedDeploymentID, setSelectedDeploymentID ] = useState<string | undefined>();

    const [ allDeployments, setAllDeployments ] = useState<LightDeployment[]>([]);
    const sdk = useGqlSdk()

    useEffect(() => {
        let isMounted = true;

        sdk.allDeployments().then(({ data }) => {
            if (!isMounted) return;
            setAllDeployments((data.allDeployments?.results ?? []).filter(d => d !== null) as any)
        })

        return () => {
            isMounted = false;
        }
    }, []);

    useEffect(() => {
        let isMounted = true;

        setProjects([])
        sdk.allProjects({ limit: pageSize, offset: pageSize * (currentPage - 1) }).then(({ data }) => {
            if (!isMounted) return;
            setProjectsTotal(data.allWebsiteProjects?.totalCount ?? 0)
            setProjects((data.allWebsiteProjects?.results ?? []).filter(p => p !== null) as any)
        })

        return () => {
            isMounted = false;
        }
    }, [ currentPage ]);

    return (
        <div id="projects-page">
            <PageTitle img={ imgTitle } imgAlt="Project Banner">
                PROJECTS
            </PageTitle>

            <div className="content">

                <DeploymentsMap allDeployments={ allDeployments }
                                level="project"
                                selectedDeploymentID={ selectedDeploymentID }
                                setSelectedDeploymentID={ setSelectedDeploymentID }/>

                { projects.map(p => (
                    <IonCard key={ p.id } href={ `/projects/${ p.id }` }>
                        { p.thumbnail && <img src={ p.thumbnail } alt={ p.title }/> }

                        <IonCardHeader>
                            <IonCardTitle>{ p.title }</IonCardTitle>
                            { (p.start || p.end) &&
                                <IonCardSubtitle>
                                    { getYear(p.start) ?? '...' } - { getYear(p.end) ?? '...' }
                                </IonCardSubtitle> }
                        </IonCardHeader>

                        <IonCardContent>{ p.intro }</IonCardContent>
                    </IonCard>
                )) }
            </div>

            <Pagination totalCount={ projectsTotal }
                        currentPage={ currentPage }
                        pageSize={ pageSize }
                        setPage={ setCurrentPage }/>
        </div>
    );
};
