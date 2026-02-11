import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getYear } from '../../../utils';
import { CollaboratorsBanner } from '../../../components/CollaboratorsBanner/CollaboratorsBanner';
import { ContactList } from '../../../components/ContactList/ContactList';
import { HTMLContent } from '../../../components/HTMLContent/HTMLContent';
import { Back } from '../../../components/Back/Back';
import { DeploymentsMap } from '../../../components/DeploymentsMap';
import { DeploymentsTimeline } from '../../../components/DeploymentsTimeline';
import './ProjectDetail.css';
import { LightDeployment, Project, useGqlSdk } from "../../../api";

export const ProjectDetail: React.FC = () => {
    const { id: projectID } = useParams<{ id: string; }>();

    const [ project, setProject ] = useState<Project>();
    const [ allDeployments, setAllDeployments ] = useState<LightDeployment[]>([]);
    const [ selectedDeploymentID, setSelectedDeploymentID ] = useState<string | undefined>();

    const contacts = useMemo(() => {
        return [
            ...(project?.osmoseMemberContacts.edges.map(e => e?.node).filter(n => !!n) ?? []),
            ...(project?.otherContacts ?? [])
        ]
    }, [ project ])

    const collaborators = useMemo(() => {
        return project?.collaborators.edges.map(e => e?.node).filter(n => !!n)
    }, [ project ])

    const sdk = useGqlSdk()

    useEffect(() => {
        let isMounted = true;

        sdk.projectById({ id: projectID }).then(({ data }) => {
            if (!isMounted) return;
            setProject(data.websiteProjectById ?? undefined)
        })

        sdk.allDeployments({ projectID }).then(({ data }) => {
            if (!isMounted) return;
            setAllDeployments((data.allDeployments?.results ?? []).filter(d => d !== null) as any)
        })

        return () => {
            isMounted = false;
        }
    }, [ projectID ]);

    return (
        <div id="project-detail">
            <Back path="/projects" pageName="Projects"/>

            { project && (
                <div id="project">
                    <div className="project-head">
                        <h1>{ project.title }</h1>
                        { (project.start || project.end) &&
                            <p className="text-muted">
                                { getYear(project.start) ?? '...' } - { getYear(project.end) ?? '...' }
                            </p> }
                    </div>

                    <HTMLContent content={ project.body }></HTMLContent>

                    <ContactList label="Contact" contacts={ contacts as any }/>

                </div>
            ) }

            { allDeployments.length > 0 && <Fragment>
                <DeploymentsMap projectID={ +projectID }
                                level="deployment"
                                allDeployments={ allDeployments }
                                selectedDeploymentID={ selectedDeploymentID }
                                setSelectedDeploymentID={ setSelectedDeploymentID }/>

                <DeploymentsTimeline deployments={ allDeployments }
                                     setSelectedDeploymentID={ setSelectedDeploymentID }/>
            </Fragment> }

            { collaborators && <CollaboratorsBanner collaborators={ collaborators as any }/> }
        </div>
    )
}
