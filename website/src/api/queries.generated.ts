import * as Types from './types.gql-generated';

import { GraphQLClient, RequestOptions } from 'graphql-request';
import { GraphQLError, print } from 'graphql'
import gql from 'graphql-tag';
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
export type AllProjectsQueryVariables = Types.Exact<{
  offset: Types.Scalars['Int']['input'];
  limit: Types.Scalars['Int']['input'];
}>;


export type AllProjectsQuery = { __typename?: 'Query', allWebsiteProjects?: { __typename?: 'WebsiteProjectNodeNodeConnection', totalCount?: number | null, results: Array<{ __typename?: 'WebsiteProjectNode', id: string, title: string, intro: string, start?: any | null, end?: any | null, thumbnail: string } | null> } | null };

export type ProjectByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type ProjectByIdQuery = { __typename?: 'Query', websiteProjectById?: { __typename?: 'WebsiteProjectNode', title: string, start?: any | null, end?: any | null, body: string, otherContacts?: Array<string> | null, osmoseMemberContacts: { __typename?: 'TeamMemberNodeConnection', edges: Array<{ __typename?: 'TeamMemberNodeEdge', node?: { __typename?: 'TeamMemberNode', id: string, person: { __typename?: 'PersonNode', initialNames?: string | null } } | null } | null> }, collaborators: { __typename?: 'CollaboratorNodeConnection', edges: Array<{ __typename?: 'CollaboratorNodeEdge', node?: { __typename?: 'CollaboratorNode', name: string, thumbnail: string, url?: string | null } | null } | null> } } | null };

export type HomeCollaboratorsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type HomeCollaboratorsQuery = { __typename?: 'Query', allCollaborators?: { __typename?: 'CollaboratorNodeNodeConnection', results: Array<{ __typename?: 'CollaboratorNode', name: string, thumbnail: string, url?: string | null } | null> } | null };

export type AllDeploymentsQueryVariables = Types.Exact<{
  projectID?: Types.InputMaybe<Types.Scalars['Decimal']['input']>;
}>;


export type AllDeploymentsQuery = { __typename?: 'Query', allDeployments?: { __typename?: 'DeploymentNodeNodeConnection', results: Array<{ __typename?: 'DeploymentNode', id: string, latitude: number, longitude: number, name?: string | null, deploymentDate?: any | null, recoveryDate?: any | null, project: { __typename?: 'ProjectNodeOverride', id: string, name: string }, site?: { __typename?: 'SiteNode', id: string, name: string } | null, campaign?: { __typename?: 'CampaignNode', id: string, name: string } | null, contacts?: Array<{ __typename?: 'ContactRelationNode', id: string, role?: Types.RoleEnum | null, contact?: { __typename?: 'InstitutionNode', name: string } | { __typename?: 'PersonNode', firstName: string, lastName: string } | { __typename?: 'TeamNode', name: string } | null } | null> | null, channelConfigurations: { __typename?: 'ChannelConfigurationNodeConnection', edges: Array<{ __typename?: 'ChannelConfigurationNodeEdge', node?: { __typename?: 'ChannelConfigurationNode', recorderSpecification?: { __typename?: 'ChannelConfigurationRecorderSpecificationNode', samplingFrequency: number } | null } | null } | null> } } | null> } | null };

export type DeploymentByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type DeploymentByIdQuery = { __typename?: 'Query', annotationLabelsForDeploymentId?: { __typename?: 'AnnotationLabelNodeNodeConnection', results: Array<{ __typename?: 'AnnotationLabelNode', id: string, name: string, uses: number } | null> } | null, deploymentById?: { __typename?: 'DeploymentNode', name?: string | null, latitude: number, longitude: number, deploymentDate?: any | null, deploymentVessel?: string | null, recoveryDate?: any | null, recoveryVessel?: string | null, bathymetricDepth?: number | null, description?: string | null, project: { __typename?: 'ProjectNodeOverride', name: string, accessibility?: Types.AccessibilityEnum | null, projectGoal?: string | null, contacts?: Array<{ __typename?: 'ContactRelationNode', id: string, role?: Types.RoleEnum | null, contact?: { __typename?: 'InstitutionNode', name: string, website?: string | null } | { __typename?: 'PersonNode', firstName: string, lastName: string, website?: string | null } | { __typename?: 'TeamNode', name: string, website?: string | null } | null } | null> | null }, site?: { __typename?: 'SiteNode', name: string } | null, campaign?: { __typename?: 'CampaignNode', name: string } | null, platform?: { __typename?: 'PlatformNode', name?: string | null } | null, contacts?: Array<{ __typename?: 'ContactRelationNode', id: string, role?: Types.RoleEnum | null, contact?: { __typename?: 'InstitutionNode', name: string, website?: string | null } | { __typename?: 'PersonNode', firstName: string, lastName: string, website?: string | null } | { __typename?: 'TeamNode', name: string, website?: string | null } | null } | null> | null } | null };

export type AllBibliographyQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type AllBibliographyQuery = { __typename?: 'Query', allBibliography?: { __typename?: 'BibliographyUnionConnection', edges: Array<{ __typename?: 'BibliographyUnionEdge', node?: { __typename?: 'ArticleNode', title: string, doi?: string | null, status: Types.BibliographyStatusEnum, type: Types.BibliographyTypeEnum, publicationDate?: any | null, journal: string, volumes?: string | null, pagesFrom?: number | null, pagesTo?: number | null, issueNb?: number | null, articleNb?: number | null, tags?: Array<{ __typename?: 'TagNode', name: string } | null> | null, authors: { __typename?: 'AuthorNodeConnection', edges: Array<{ __typename?: 'AuthorNodeEdge', node?: { __typename?: 'AuthorNode', order?: number | null, person: { __typename?: 'PersonNode', initialNames?: string | null, teamMember?: { __typename?: 'TeamMemberNode', id: string, type?: Types.TeamMemberTypeEnum | null } | null } } | null } | null> } } | { __typename?: 'ConferenceNode', title: string, doi?: string | null, status: Types.BibliographyStatusEnum, type: Types.BibliographyTypeEnum, publicationDate?: any | null, conferenceName: string, conferenceLocation: string, conferenceAbstractBookUrl?: string | null, tags?: Array<{ __typename?: 'TagNode', name: string } | null> | null, authors: { __typename?: 'AuthorNodeConnection', edges: Array<{ __typename?: 'AuthorNodeEdge', node?: { __typename?: 'AuthorNode', order?: number | null, person: { __typename?: 'PersonNode', initialNames?: string | null, teamMember?: { __typename?: 'TeamMemberNode', id: string, type?: Types.TeamMemberTypeEnum | null } | null } } | null } | null> } } | { __typename?: 'PosterNode', title: string, doi?: string | null, status: Types.BibliographyStatusEnum, type: Types.BibliographyTypeEnum, publicationDate?: any | null, posterUrl?: string | null, conferenceName: string, conferenceLocation: string, conferenceAbstractBookUrl?: string | null, tags?: Array<{ __typename?: 'TagNode', name: string } | null> | null, authors: { __typename?: 'AuthorNodeConnection', edges: Array<{ __typename?: 'AuthorNodeEdge', node?: { __typename?: 'AuthorNode', order?: number | null, person: { __typename?: 'PersonNode', initialNames?: string | null, teamMember?: { __typename?: 'TeamMemberNode', id: string, type?: Types.TeamMemberTypeEnum | null } | null } } | null } | null> } } | { __typename?: 'SoftwareNode', title: string, doi?: string | null, status: Types.BibliographyStatusEnum, type: Types.BibliographyTypeEnum, publicationDate?: any | null, repositoryUrl?: string | null, publicationPlace: string, tags?: Array<{ __typename?: 'TagNode', name: string } | null> | null, authors: { __typename?: 'AuthorNodeConnection', edges: Array<{ __typename?: 'AuthorNodeEdge', node?: { __typename?: 'AuthorNode', order?: number | null, person: { __typename?: 'PersonNode', initialNames?: string | null, teamMember?: { __typename?: 'TeamMemberNode', id: string, type?: Types.TeamMemberTypeEnum | null } | null } } | null } | null> } } | null } | null> } | null };

export type AllTeamMembersQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type AllTeamMembersQuery = { __typename?: 'Query', allTeamMembers?: { __typename?: 'TeamMemberNodeNodeConnection', results: Array<{ __typename?: 'TeamMemberNode', id: string, picture: string, position: string, type?: Types.TeamMemberTypeEnum | null, person: { __typename?: 'PersonNode', initialNames?: string | null, firstName: string, lastName: string, currentInstitutions?: Array<{ __typename?: 'InstitutionNode', name: string } | null> | null } } | null> } | null };

export type TeamMemberByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type TeamMemberByIdQuery = { __typename?: 'Query', teamMemberById?: { __typename?: 'TeamMemberNode', position: string, picture: string, biography?: string | null, personalWebsiteUrl?: string | null, githubUrl?: string | null, mailAddress?: string | null, linkedinUrl?: string | null, researchGateUrl?: string | null, person: { __typename?: 'PersonNode', firstName: string, lastName: string, initialNames?: string | null } } | null };

export type AllNewsQueryVariables = Types.Exact<{
  offset: Types.Scalars['Int']['input'];
  limit: Types.Scalars['Int']['input'];
}>;


export type AllNewsQuery = { __typename?: 'Query', allNews?: { __typename?: 'NewsNodeNodeConnection', totalCount?: number | null, results: Array<{ __typename?: 'NewsNode', id: string, title: string, thumbnail: string, date?: any | null, intro: string } | null> } | null };

export type NewsByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type NewsByIdQuery = { __typename?: 'Query', newsById?: { __typename?: 'NewsNode', title: string, date?: any | null, body: string, otherAuthors?: Array<string> | null, osmoseMemberAuthors: { __typename?: 'TeamMemberNodeConnection', edges: Array<{ __typename?: 'TeamMemberNodeEdge', node?: { __typename?: 'TeamMemberNode', id: string, person: { __typename?: 'PersonNode', initialNames?: string | null } } | null } | null> } } | null };

export type AllScientificTalksQueryVariables = Types.Exact<{
  offset: Types.Scalars['Int']['input'];
  limit: Types.Scalars['Int']['input'];
}>;


export type AllScientificTalksQuery = { __typename?: 'Query', allScientificTalks?: { __typename?: 'ScientificTalkNodeNodeConnection', totalCount?: number | null, results: Array<{ __typename?: 'ScientificTalkNode', title: string, thumbnail: string, date?: any | null, intro?: string | null, otherPresenters?: Array<string> | null, osmoseMemberPresenters: { __typename?: 'TeamMemberNodeConnection', edges: Array<{ __typename?: 'TeamMemberNodeEdge', node?: { __typename?: 'TeamMemberNode', id: string, person: { __typename?: 'PersonNode', initialNames?: string | null } } | null } | null> } } | null> } | null };


export const AllProjectsDocument = gql`
    query allProjects($offset: Int!, $limit: Int!) {
  allWebsiteProjects(limit: $limit, offset: $offset) {
    totalCount
    results {
      id
      title
      intro
      start
      end
      thumbnail
    }
  }
}
    `;
export const ProjectByIdDocument = gql`
    query projectById($id: ID!) {
  websiteProjectById(id: $id) {
    title
    start
    end
    body
    osmoseMemberContacts {
      edges {
        node {
          id
          person {
            initialNames
          }
        }
      }
    }
    otherContacts
    collaborators {
      edges {
        node {
          name
          thumbnail
          url
        }
      }
    }
  }
}
    `;
export const HomeCollaboratorsDocument = gql`
    query homeCollaborators {
  allCollaborators(showOnHomePage: true) {
    results {
      name
      thumbnail
      url
    }
  }
}
    `;
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
                    type
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
                    type
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
                    type
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
                    type
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
export const AllTeamMembersDocument = gql`
    query allTeamMembers {
  allTeamMembers {
    results {
      id
      picture
      person {
        initialNames
        firstName
        lastName
        currentInstitutions {
          name
        }
      }
      position
      type
    }
  }
}
    `;
export const TeamMemberByIdDocument = gql`
    query teamMemberById($id: ID!) {
  teamMemberById(id: $id) {
    position
    picture
    biography
    person {
      firstName
      lastName
      initialNames
    }
    personalWebsiteUrl
    githubUrl
    mailAddress
    linkedinUrl
    researchGateUrl
  }
}
    `;
export const AllNewsDocument = gql`
    query allNews($offset: Int!, $limit: Int!) {
  allNews(limit: $limit, offset: $offset) {
    totalCount
    results {
      id
      title
      thumbnail
      date
      intro
    }
  }
}
    `;
export const NewsByIdDocument = gql`
    query newsById($id: ID!) {
  newsById(id: $id) {
    title
    date
    body
    osmoseMemberAuthors {
      edges {
        node {
          id
          person {
            initialNames
          }
        }
      }
    }
    otherAuthors
  }
}
    `;
export const AllScientificTalksDocument = gql`
    query allScientificTalks($offset: Int!, $limit: Int!) {
  allScientificTalks(limit: $limit, offset: $offset) {
    totalCount
    results {
      title
      thumbnail
      date
      intro
      osmoseMemberPresenters {
        edges {
          node {
            id
            person {
              initialNames
            }
          }
        }
      }
      otherPresenters
    }
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();
const AllProjectsDocumentString = print(AllProjectsDocument);
const ProjectByIdDocumentString = print(ProjectByIdDocument);
const HomeCollaboratorsDocumentString = print(HomeCollaboratorsDocument);
const AllDeploymentsDocumentString = print(AllDeploymentsDocument);
const DeploymentByIdDocumentString = print(DeploymentByIdDocument);
const AllBibliographyDocumentString = print(AllBibliographyDocument);
const AllTeamMembersDocumentString = print(AllTeamMembersDocument);
const TeamMemberByIdDocumentString = print(TeamMemberByIdDocument);
const AllNewsDocumentString = print(AllNewsDocument);
const NewsByIdDocumentString = print(NewsByIdDocument);
const AllScientificTalksDocumentString = print(AllScientificTalksDocument);
export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    allProjects(variables: AllProjectsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: AllProjectsQuery; errors?: GraphQLError[]; extensions?: any; headers: Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<AllProjectsQuery>(AllProjectsDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'allProjects', 'query', variables);
    },
    projectById(variables: ProjectByIdQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: ProjectByIdQuery; errors?: GraphQLError[]; extensions?: any; headers: Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<ProjectByIdQuery>(ProjectByIdDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'projectById', 'query', variables);
    },
    homeCollaborators(variables?: HomeCollaboratorsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: HomeCollaboratorsQuery; errors?: GraphQLError[]; extensions?: any; headers: Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<HomeCollaboratorsQuery>(HomeCollaboratorsDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'homeCollaborators', 'query', variables);
    },
    allDeployments(variables?: AllDeploymentsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: AllDeploymentsQuery; errors?: GraphQLError[]; extensions?: any; headers: Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<AllDeploymentsQuery>(AllDeploymentsDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'allDeployments', 'query', variables);
    },
    deploymentById(variables: DeploymentByIdQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: DeploymentByIdQuery; errors?: GraphQLError[]; extensions?: any; headers: Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<DeploymentByIdQuery>(DeploymentByIdDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'deploymentById', 'query', variables);
    },
    allBibliography(variables?: AllBibliographyQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: AllBibliographyQuery; errors?: GraphQLError[]; extensions?: any; headers: Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<AllBibliographyQuery>(AllBibliographyDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'allBibliography', 'query', variables);
    },
    allTeamMembers(variables?: AllTeamMembersQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: AllTeamMembersQuery; errors?: GraphQLError[]; extensions?: any; headers: Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<AllTeamMembersQuery>(AllTeamMembersDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'allTeamMembers', 'query', variables);
    },
    teamMemberById(variables: TeamMemberByIdQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: TeamMemberByIdQuery; errors?: GraphQLError[]; extensions?: any; headers: Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<TeamMemberByIdQuery>(TeamMemberByIdDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'teamMemberById', 'query', variables);
    },
    allNews(variables: AllNewsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: AllNewsQuery; errors?: GraphQLError[]; extensions?: any; headers: Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<AllNewsQuery>(AllNewsDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'allNews', 'query', variables);
    },
    newsById(variables: NewsByIdQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: NewsByIdQuery; errors?: GraphQLError[]; extensions?: any; headers: Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<NewsByIdQuery>(NewsByIdDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'newsById', 'query', variables);
    },
    allScientificTalks(variables: AllScientificTalksQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: AllScientificTalksQuery; errors?: GraphQLError[]; extensions?: any; headers: Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<AllScientificTalksQuery>(AllScientificTalksDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'allScientificTalks', 'query', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;