import React, { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getYear, useFetchDetail } from '../../../utils';
import { Project } from '../../../models/project';
import { CollaboratorsBanner } from '../../../components/CollaboratorsBanner/CollaboratorsBanner';
import { ContactList } from '../../../components/ContactList/ContactList';
import { HTMLContent } from '../../../components/HTMLContent/HTMLContent';
import { Back } from '../../../components/Back/Back';
import { DeploymentsMap } from '../../../components/DeploymentsMap';
import { DeploymentsTimeline } from '../../../components/DeploymentsTimeline';
import './ProjectDetail.css';
import { LightDeployment, useGqlSdk } from "../../../api";

export const ProjectDetail: React.FC = () => {
    const { id: projectID } = useParams<{ id: string; }>();

    const [ project, setProject ] = useState<Project>();

    const [ selectedDeploymentID, setSelectedDeploymentID ] = useState<string | undefined>();

    const fetchDetail = useFetchDetail<Project>('/projects', '/api/projects');
    const [ allDeployments, setAllDeployments ] = useState<LightDeployment[]>([]);
    const sdk = useGqlSdk()

    useEffect(() => {
        let isMounted = true;
        fetchDetail(projectID).then(project => isMounted && setProject(project));

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

                    <ContactList label="Contact"
                                 teamMembers={ project.osmose_member_contacts }
                                 namedMembers={ project.other_contacts }></ContactList>

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

            { project?.collaborators &&
                <CollaboratorsBanner collaborators={ project.collaborators }></CollaboratorsBanner> }
        </div>
    )
}
