import * as Types from './types.gql-generated';

import { GraphQLClient, RequestOptions } from 'graphql-request';
import { GraphQLError, print } from 'graphql'
import gql from 'graphql-tag';
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
export type AllDeploymentsQueryVariables = Types.Exact<{
  projectID?: Types.InputMaybe<Types.Scalars['Decimal']['input']>;
}>;


export type AllDeploymentsQuery = { __typename?: 'Query', allDeployments?: { __typename?: 'DeploymentNodeNodeConnection', results: Array<{ __typename?: 'DeploymentNode', id: string, latitude: number, longitude: number, name?: string | null, deploymentDate?: any | null, recoveryDate?: any | null, project: { __typename?: 'ProjectNodeOverride', id: string, name: string }, site?: { __typename?: 'SiteNode', id: string, name: string } | null, campaign?: { __typename?: 'CampaignNode', id: string, name: string } | null, contacts?: Array<{ __typename?: 'ContactRelationNode', id: string, role?: Types.RoleEnum | null, contact?: { __typename?: 'InstitutionNode', name: string } | { __typename?: 'PersonNode', firstName: string, lastName: string } | { __typename?: 'TeamNode', name: string } | null } | null> | null, channelConfigurations: { __typename?: 'ChannelConfigurationNodeConnection', edges: Array<{ __typename?: 'ChannelConfigurationNodeEdge', node?: { __typename?: 'ChannelConfigurationNode', recorderSpecification?: { __typename?: 'ChannelConfigurationRecorderSpecificationNode', samplingFrequency: number } | null } | null } | null> } } | null> } | null };

export type DeploymentByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type DeploymentByIdQuery = { __typename?: 'Query', annotationLabelsForDeploymentId?: { __typename?: 'AnnotationLabelNodeNodeConnection', results: Array<{ __typename?: 'AnnotationLabelNode', id: string, name: string, uses: number } | null> } | null, deploymentById?: { __typename?: 'DeploymentNode', name?: string | null, latitude: number, longitude: number, deploymentDate?: any | null, deploymentVessel?: string | null, recoveryDate?: any | null, recoveryVessel?: string | null, bathymetricDepth?: number | null, description?: string | null, project: { __typename?: 'ProjectNodeOverride', name: string, accessibility?: Types.AccessibilityEnum | null, projectGoal?: string | null, contacts?: Array<{ __typename?: 'ContactRelationNode', id: string, role?: Types.RoleEnum | null, contact?: { __typename?: 'InstitutionNode', name: string, website?: string | null } | { __typename?: 'PersonNode', firstName: string, lastName: string, website?: string | null } | { __typename?: 'TeamNode', name: string, website?: string | null } | null } | null> | null }, site?: { __typename?: 'SiteNode', name: string } | null, campaign?: { __typename?: 'CampaignNode', name: string } | null, platform?: { __typename?: 'PlatformNode', name?: string | null } | null, contacts?: Array<{ __typename?: 'ContactRelationNode', id: string, role?: Types.RoleEnum | null, contact?: { __typename?: 'InstitutionNode', name: string, website?: string | null } | { __typename?: 'PersonNode', firstName: string, lastName: string, website?: string | null } | { __typename?: 'TeamNode', name: string, website?: string | null } | null } | null> | null } | null };

export type AllBibliographyQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type AllBibliographyQuery = { __typename?: 'Query', allBibliography?: { __typename?: 'BibliographyUnionConnection', edges: Array<{ __typename?: 'BibliographyUnionEdge', node?: { __typename?: 'ArticleNode', title: string, doi?: string | null, status: Types.BibliographyStatusEnum, type: Types.BibliographyTypeEnum, publicationDate?: any | null, journal: string, volumes?: string | null, pagesFrom?: number | null, pagesTo?: number | null, issueNb?: number | null, articleNb?: number | null, tags?: Array<{ __typename?: 'TagNode', name: string } | null> | null, authors: { __typename?: 'AuthorNodeConnection', edges: Array<{ __typename?: 'AuthorNodeEdge', node?: { __typename?: 'AuthorNode', order?: number | null, person: { __typename?: 'PersonNode', initialNames?: string | null, teamMember?: { __typename?: 'TeamMemberNode', id: string, isFormerMember: boolean } | null } } | null } | null> } } | { __typename?: 'ConferenceNode', title: string, doi?: string | null, status: Types.BibliographyStatusEnum, type: Types.BibliographyTypeEnum, publicationDate?: any | null, conferenceName: string, conferenceLocation: string, conferenceAbstractBookUrl?: string | null, tags?: Array<{ __typename?: 'TagNode', name: string } | null> | null, authors: { __typename?: 'AuthorNodeConnection', edges: Array<{ __typename?: 'AuthorNodeEdge', node?: { __typename?: 'AuthorNode', order?: number | null, person: { __typename?: 'PersonNode', initialNames?: string | null, teamMember?: { __typename?: 'TeamMemberNode', id: string, isFormerMember: boolean } | null } } | null } | null> } } | { __typename?: 'PosterNode', title: string, doi?: string | null, status: Types.BibliographyStatusEnum, type: Types.BibliographyTypeEnum, publicationDate?: any | null, posterUrl?: string | null, conferenceName: string, conferenceLocation: string, conferenceAbstractBookUrl?: string | null, tags?: Array<{ __typename?: 'TagNode', name: string } | null> | null, authors: { __typename?: 'AuthorNodeConnection', edges: Array<{ __typename?: 'AuthorNodeEdge', node?: { __typename?: 'AuthorNode', order?: number | null, person: { __typename?: 'PersonNode', initialNames?: string | null, teamMember?: { __typename?: 'TeamMemberNode', id: string, isFormerMember: boolean } | null } } | null } | null> } } | { __typename?: 'SoftwareNode', title: string, doi?: string | null, status: Types.BibliographyStatusEnum, type: Types.BibliographyTypeEnum, publicationDate?: any | null, repositoryUrl?: string | null, publicationPlace: string, tags?: Array<{ __typename?: 'TagNode', name: string } | null> | null, authors: { __typename?: 'AuthorNodeConnection', edges: Array<{ __typename?: 'AuthorNodeEdge', node?: { __typename?: 'AuthorNode', order?: number | null, person: { __typename?: 'PersonNode', initialNames?: string | null, teamMember?: { __typename?: 'TeamMemberNode', id: string, isFormerMember: boolean } | null } } | null } | null> } } | null } | null> } | null };


export const AllDeploymentsDocument = gql`
    query allDeployments($projectID: Decimal) {
  allDeployments(project_WebsiteProject_Id: $projectID) {
    results {
      id
      latitude
      longitude
      name
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
        id
        role
        contact {
          ... on PersonNode {
            firstName
            lastName
          }
          ... on TeamNode {
            name
          }
          ... on InstitutionNode {
            name
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
    `;
export const DeploymentByIdDocument = gql`
    query deploymentById($id: ID!) {
  annotationLabelsForDeploymentId(deploymentId: $id) {
    results {
      id
      name
      uses(deploymentId: $id)
    }
  }
  deploymentById(id: $id) {
    name
    latitude
    longitude
    deploymentDate
    deploymentVessel
    recoveryDate
    recoveryVessel
    bathymetricDepth
    description
    project {
      name
      accessibility
      projectGoal
      contacts {
        id
        role
        contact {
          ... on PersonNode {
            firstName
            lastName
            website
          }
          ... on TeamNode {
            name
            website
          }
          ... on InstitutionNode {
            name
            website
          }
        }
      }
    }
    site {
      name
    }
    campaign {
      name
    }
    platform {
      name
    }
    contacts {
      id
      role
      contact {
        ... on PersonNode {
          firstName
          lastName
          website
        }
        ... on TeamNode {
          name
          website
        }
        ... on InstitutionNode {
          name
          website
        }
      }
    }
  }
}
    `;
export const AllBibliographyDocument = gql`
    query allBibliography {
  allBibliography {
    edges {
      node {
        ... on ArticleNode {
          title
          doi
          status
          type
          publicationDate
          tags {
            name
          }
          authors {
            edges {
              node {
                order
                person {
                  initialNames
                  teamMember {
                    id
                    isFormerMember
                  }
                }
              }
            }
          }
          journal
          volumes
          pagesFrom
          pagesTo
          issueNb
          articleNb
        }
        ... on ConferenceNode {
          title
          doi
          status
          type
          publicationDate
          tags {
            name
          }
          authors {
            edges {
              node {
                order
                person {
                  initialNames
                  teamMember {
                    id
                    isFormerMember
                  }
                }
              }
            }
          }
          conferenceName
          conferenceLocation
          conferenceAbstractBookUrl
        }
        ... on PosterNode {
          title
          doi
          status
          type
          publicationDate
          tags {
            name
          }
          authors {
            edges {
              node {
                order
                person {
                  initialNames
                  teamMember {
                    id
                    isFormerMember
                  }
                }
              }
            }
          }
          posterUrl
          conferenceName
          conferenceLocation
          conferenceAbstractBookUrl
        }
        ... on SoftwareNode {
          title
          doi
          status
          type
          publicationDate
          tags {
            name
          }
          authors {
            edges {
              node {
                order
                person {
                  initialNames
                  teamMember {
                    id
                    isFormerMember
                  }
                }
              }
            }
          }
          repositoryUrl
          publicationPlace
        }
      }
    }
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();
const AllDeploymentsDocumentString = print(AllDeploymentsDocument);
const DeploymentByIdDocumentString = print(DeploymentByIdDocument);
const AllBibliographyDocumentString = print(AllBibliographyDocument);
export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    allDeployments(variables?: AllDeploymentsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: AllDeploymentsQuery; errors?: GraphQLError[]; extensions?: any; headers: Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<AllDeploymentsQuery>(AllDeploymentsDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'allDeployments', 'query', variables);
    },
    deploymentById(variables: DeploymentByIdQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: DeploymentByIdQuery; errors?: GraphQLError[]; extensions?: any; headers: Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<DeploymentByIdQuery>(DeploymentByIdDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'deploymentById', 'query', variables);
    },
    allBibliography(variables?: AllBibliographyQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: AllBibliographyQuery; errors?: GraphQLError[]; extensions?: any; headers: Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<AllBibliographyQuery>(AllBibliographyDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'allBibliography', 'query', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;