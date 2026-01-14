import React, { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getYear, useFetchDetail, useFetchGql } from '../../../utils';
import { Project } from '../../../models/project';
import { CollaboratorsBanner } from '../../../components/CollaboratorsBanner/CollaboratorsBanner';
import { ContactList } from '../../../components/ContactList/ContactList';
import { HTMLContent } from '../../../components/HTMLContent/HTMLContent';
import { Back } from '../../../components/Back/Back';
import { DeploymentsMap } from '../../../components/DeploymentsMap';
import { DeploymentsTimeline } from '../../../components/DeploymentsTimeline';
import './ProjectDetail.css';
import { gql } from 'graphql-request';

export type Contact = {
  id: string;
  firstName: string;
  lastName: string;
  website: string;
}
export type Institution = {
  id: string;
  name: string;
  website: string;
}
export type ContactRole = {
  id: string;
  role: string;
} & ({
  contact: Contact
  institution: null
} | {
  institution: Institution
  contact: null
})

export type Deployment = {
  id: string;
  name: number;
  latitude: number;
  longitude: number;
  project: {
    id: string;
    name: number;
    accessibility: string;
    projectGoal: string;
    contacts: {
      edges: {
        node: ContactRole
      }[]
    }
  }
  site: {
    id: string;
    name: string;
  }
  campaign: {
    id: string;
    name: string;
  }
  platform: {
    id: string;
    name: string;
  }
  deploymentDate: string;
  deploymentVessel: string;
  recoveryDate: string;
  recoveryVessel: string;
  bathymetricDepth: number;
  description: string;
  contacts: {
    edges: {
      node: ContactRole
    }[]
  }
  channelConfigurations: {
    edges: {
      node: {
        id: string;
        recorderSpecification: {
          id: string;
          samplingFrequency: number;
        }
      }
    }[]
  }
}

export type LightDeployment =
  Pick<Deployment, 'id' | 'name' | 'longitude' | 'latitude' | 'deploymentDate' | 'recoveryDate' | 'contacts' | 'campaign' | 'site'>
  & {
  project: Pick<Deployment['project'], 'id' | 'name'>
  channelConfigurations: {
    edges: {
      node: {
        recorderSpecification: Pick<Deployment['channelConfigurations']['edges'][number]['node']['recorderSpecification'], 'samplingFrequency'>
      }
    }[]
  }
}

export const ProjectDetail: React.FC = () => {
  const { id: projectID } = useParams<{ id: string; }>();

  const [ project, setProject ] = useState<Project>();

  const [ deployments, setDeployments ] = useState<Array<Deployment>>([]);
  const [ selectedDeploymentID, setSelectedDeploymentID ] = useState<string | undefined>();

  const fetchDetail = useFetchDetail<Project>('/projects', '/api/projects');
    const fetchDeployments = useFetchGql<{ allDeployments?: { results: Deployment[] } }>(gql`
        query {
            allDeployments(project_WebsiteProject_Id: ${projectID}) {
                results {
                    id,
                    name
                    latitude,
                    longitude
                    project {
                        id
                        name
                    }
                    site {
                        id
                        name
                    }
                    campaign {
                        id
                        name
                    }
                    deploymentDate
                    recoveryDate
                    contacts {
                        edges {
                            node {
                                id
                                role
                                contact {
                                    id
                                    firstName
                                    lastName
                                }
                                institution {
                                    id
                                    name
                                }
                            }
                        }
                    }
                    channelConfigurations {
                        edges {
                            node {
                                recorderSpecification {
                                    samplingFrequency
                                }
                            }
                        }
                    }
                }
            }
        }
    `)

  useEffect(() => {
    let isMounted = true;
    fetchDetail(projectID).then(project => isMounted && setProject(project));

    fetchDeployments().then(data => {
      if (!isMounted) return;
      setDeployments((data?.allDeployments?.results ?? []).filter((d: any) => !!d) as Deployment[])
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

      { deployments.length > 0 && <Fragment>
          <DeploymentsMap projectID={ +projectID }
                          level="deployment"
                          allDeployments={ deployments }
                          selectedDeploymentID={ selectedDeploymentID }
                          setSelectedDeploymentID={ setSelectedDeploymentID }/>

          <DeploymentsTimeline deployments={ deployments as any }
                               setSelectedDeploymentID={ setSelectedDeploymentID }/>
      </Fragment> }

      { project?.collaborators && <CollaboratorsBanner collaborators={ project.collaborators }></CollaboratorsBanner> }
    </div>
  )
}
