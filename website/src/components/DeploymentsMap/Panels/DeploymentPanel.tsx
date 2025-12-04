import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { IoCaretUp, IoClose, IoDownloadOutline, IoOpenOutline } from 'react-icons/io5';
import styles from './panel.module.scss'
import { useFetchGql } from '../../../utils';
import { gql } from 'graphql-request';
import { Deployment } from '../../../pages/Projects/ProjectDetail/ProjectDetail'
import { ContactLink, InstitutionLink } from '../ContactLink';

type Label = {
  id: string,
  name: string,
  uses: number
}
export const DeploymentPanel: React.FC<{
  deploymentID: string;
  onClose: () => void,
  disableProjectLink?: boolean;
}> = ({
        deploymentID,
        onClose,
        disableProjectLink = false,
      }) => {

  const [ deployment, setDeployment ] = useState<Deployment | undefined>();
  const [ labels, setLabels ] = useState<Array<Label>>([]);
  const isOpenAccess = useMemo(() => deployment?.project.accessibility === 'Open access', [ deployment ]);
    const fetchLabels = useFetchGql(gql`
        query {
            annotationLabelsForDeploymentId(deploymentId: ${deploymentID}) {
                results {
                    id
                    name
                    uses(deploymentId: ${deploymentID})
                }
            }
        }
    `)
    const fetchDeployment = useFetchGql(gql`
        query {
            deploymentById(id: ${deploymentID}) {
                id
                name
                latitude
                longitude
                project {
                    id
                    name
                    accessibility
                    projectGoal
                    contacts {
                        edges {
                            node {
                                id
                                role
                                contact {
                                    id
                                    firstName
                                    lastName
                                    website
                                }
                                institution {
                                    id
                                    name
                                    website
                                }
                            }
                        }
                    }
                }
                site {
                    id
                    name
                }
                campaign {
                    id
                    name
                }
                platform {
                    id
                    name
                }
                deploymentDate
                deploymentVessel
                recoveryDate
                recoveryVessel
                bathymetricDepth
                description
                contacts {
                    edges {
                        node {
                            id
                            role
                            contact {
                                id
                                firstName
                                lastName
                                website
                            }
                            institution {
                                id
                                name
                                website
                            }
                        }
                    }
                }
                channelConfigurations {
                    edges {
                        node {
                            id
                            recorderSpecification {
                                id
                                samplingFrequency
                            }
                        }
                    }
                }
            }
        }
    `)

  useEffect(() => {
    if (!deploymentID) return;
    fetchDeployment().then((data: any) => setDeployment(data?.deploymentById))
  }, [ deploymentID ]);

  useEffect(() => {
    if (!deployment) return;
    fetchLabels().then((data: any) => {
      setLabels((data?.annotationLabelsForDeploymentId?.results ?? []).filter((d: any) => !!d) as Label[])
    })
  }, [ deployment ]);

  if (!deployment) return <div className={ [ styles.panel, styles.empty, styles.deployment ].join(' ') }/>

  return <div className={ styles.panel + ' ' + styles.deployment }>
    <div className={ styles.head }>
      <button onClick={ onClose }><IoClose/></button>
      { isOpenAccess && <DownloadAction deployment={ deployment }/> }
      {/*<ContactAction project={ deployment.project }/> TODO: remove or not??? */ }
    </div>
    <div className={ styles.content }>
      <Project project={ deployment.project }
               disableProjectLink={ disableProjectLink }/>

      <CampaignSite label="Site"
                    data={ deployment.site }/>

      <CampaignSite label="Campaign"
                    data={ deployment.campaign }/>

      <DeploymentInfo deployment={ deployment }/>

      <DateAndVessel label="Launch"
                     date={ deployment.deploymentDate }
                     vessel={ isOpenAccess ? deployment.deploymentVessel : null }/>

      <DateAndVessel label="Recovery"
                     date={ deployment.recoveryDate }
                     vessel={ isOpenAccess ? deployment.recoveryVessel : null }/>

      <Coordinates lat={ deployment.latitude }
                   lon={ deployment.longitude }/>

      <BathymetricDepth depth={ deployment.bathymetricDepth }/>

      { isOpenAccess && <Platform platform={ deployment.platform }/> }

      { isOpenAccess && <Labels labels={ labels }/> }

      { isOpenAccess && <Description description={ deployment.description }/> }
    </div>
  </div>
}

const DownloadAction: React.FC<{ deployment: Deployment }> = ({ deployment }) => {
  const downloadData = useMemo(() => {
    return `data:text/json;charset=utf-8,${ encodeURIComponent(JSON.stringify(deployment)) }`
  }, [ deployment ])
  return <a download={ `${ deployment.name }.json` }
            className={ styles.downloadButton }
            href={ downloadData }>
    Download <IoDownloadOutline/>
  </a>
}

const Project: React.FC<{ project: Deployment['project'], disableProjectLink: boolean }> = ({
                                                                                              project,
                                                                                              disableProjectLink,
                                                                                            }) => {
  return <Fragment>
    <small>Project</small>
    <p>
      { project.name }
      { !!(project as any).websiteProject && !disableProjectLink &&
          <a href={ `/projects/${ (project as any).websiteProject.id }` }> <IoOpenOutline/> </a> }
      { project.projectGoal && <Fragment>
          <br/>
          <small>{ project.projectGoal }</small>
      </Fragment> }
      { project.contacts.edges.map(e => <Fragment key={ e!.node!.id }>
        <br/>
        <small>({ e!.node!.role }:
          { e!.node!.contact && <ContactLink contact={ e!.node!.contact! }/> }
          { e!.node!.institution && <InstitutionLink institution={ e!.node!.institution! }/> }
          )</small>
      </Fragment>) }
    </p>
  </Fragment>
}

const CampaignSite: React.FC<{
  label: 'Campaign' | 'Site',
  data: Deployment['campaign'] | Deployment['site']
}> = ({ label, data }) => {
  if (!data) return <Fragment/>
  return <Fragment>
    <small>{ label }</small>
    <p>{ data.name }</p>
  </Fragment>
}

const DeploymentInfo: React.FC<{ deployment: Deployment }> = ({ deployment }) => (
  <Fragment>
    <small>Deployment</small>
    <p>
      { deployment.name }
      { deployment.contacts.edges.map(e => <small key={ e!.node!.id }>
        <br/>({ e!.node!.role }:
        { e!.node!.contact && <ContactLink contact={ e!.node!.contact! }/> }
        { e!.node!.institution && <InstitutionLink institution={ e!.node!.institution! }/> }
      </small>) }
    </p>
  </Fragment>
)

const DateAndVessel: React.FC<{
  label: 'Launch' | 'Recovery',
  date: Deployment['deploymentDate'] | Deployment['recoveryDate'],
  vessel: Deployment['deploymentVessel'] | Deployment['recoveryVessel'] | null
}> = ({ label, date, vessel }) => {
  if (!date && !vessel) return <Fragment/>
  return <Fragment>
    <small>{ label }</small>
    <p>{ [ date, vessel ].join(' - ') }</p>
  </Fragment>
}

const Coordinates: React.FC<{ lat: Deployment['latitude'], lon: Deployment['longitude'] }> = ({ lat, lon }) => (
  <Fragment>
    <small>Coordinates</small>
    <p>{ lat }, { lon }</p>
  </Fragment>
)

const BathymetricDepth: React.FC<{ depth: Deployment['bathymetricDepth'] }> = ({ depth }) => (
  <Fragment>
    <small>Bathymetric depth</small>
    <p>{ depth }</p>
  </Fragment>
)

const Platform: React.FC<{ platform: Deployment['platform'] }> = ({ platform }) => {
  if (!platform) return <Fragment/>
  return <Fragment>
    <small>Platform</small>
    <p>{ platform.name }</p>
  </Fragment>
}

const Labels: React.FC<{ labels?: Label[] }> = ({ labels }) => {
  if (!labels || labels.length === 0) return <Fragment/>
  return <Fragment>
    <small>Labels</small>
    <p>
      { labels.map((label: any) => <span key={ label.id }>
        { label.name } ({ label.uses })
        <br/>
      </span>) }
    </p>
  </Fragment>
}

const Description: React.FC<{ description: Deployment['description'] }> = ({ description }) => {
  const [ isOpen, setIsOpen ] = useState<boolean>(false);
  if (!description) return <Fragment/>
  return <Fragment>
    <small onClick={ _ => setIsOpen(!isOpen) }>
      Description
      <IoCaretUp className={ isOpen ? '' : styles.dropDownClosed }/>
    </small>
    <p onClick={ _ => isOpen ? null : setIsOpen(true) }
       className={ isOpen ? '' : styles.dropDownClosed }
       dangerouslySetInnerHTML={ { __html: description.split(/[\n\r]/g).filter(e => !!e).join('<br/>') } }/>
  </Fragment>
}