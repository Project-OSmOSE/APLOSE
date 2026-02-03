import React, { Fragment, useMemo } from 'react';
import styles from './Tooltip.module.scss';
import { LightDeployment } from "../../../api";
import { ContactRelationNode, InstitutionNode, Maybe, PersonNode, TeamNode } from "../../../api/types.gql-generated";

export const MarkerTooltip: React.FC<{ deployment: LightDeployment }> = ({ deployment }) => {
    const contacts = useMemo(() => {
        return (deployment.contacts ?? []).filter(c => c !== null)
    }, [ deployment ])
    return (
        <div className={ styles.tooltip }>
            <p><small>Project:</small> { deployment.project.name }</p>
            { deployment.site && <p><small>Site:</small> { deployment.site.name }</p> }
            { deployment.campaign && <p><small>Campaign:</small> { deployment.campaign.name }</p> }
            <p><small>Deployment:</small> { deployment.name }</p>
            { contacts.map((e, i) => e && <ContactInfo key={ i } node={ e }/>) }
            { deployment.deploymentDate && <p><small>Launch:</small> { deployment.deploymentDate }</p> }
            { deployment.recoveryDate && <p><small>Recovery:</small> { deployment.recoveryDate }</p> }
        </div>
    )
}

const ContactInfo: React.FC<{
    node?: Pick<ContactRelationNode, 'role'> & {
        contact?: Maybe<Pick<PersonNode, 'firstName' | 'lastName' | '__typename'> | Pick<TeamNode, 'name' | '__typename'> | Pick<InstitutionNode, 'name' | '__typename'>>;
    }
}> = ({ node }) => {
    const name = useMemo(() => {
        switch (node?.contact?.__typename) {
            case 'PersonNode':
                return `${ node.contact.firstName } ${ node.contact.lastName }`
            case 'TeamNode':
            case 'InstitutionNode':
                return node.contact.name
        }
    }, [ node ])

    if (node)
        return <p><small>{ node.role }:</small> { name }</p>
    return <Fragment/>
}