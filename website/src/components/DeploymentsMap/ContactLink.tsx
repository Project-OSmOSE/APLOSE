import React, { Fragment, useMemo } from "react";
import { ContactUnion, InstitutionNode, PersonNode, TeamNode } from "../../api/types.gql-generated";


export const ContactLink: React.FC<{
    contact: Pick<ContactUnion, 'website'> & (
        Pick<PersonNode, '__typename' | 'firstName' | 'lastName'> | Pick<TeamNode, '__typename' | 'name'> | Pick<InstitutionNode, '__typename' | 'name'>
        )
}> = ({ contact }) => {
    const name = useMemo(() => {
        switch (contact?.__typename) {
            case 'PersonNode':
                return `${ contact.firstName } ${ contact.lastName }`
            case 'TeamNode':
            case 'InstitutionNode':
                return contact.name
        }
    }, [ contact ])

    if (contact.website) return <a href={ contact.website } target="_blank"
                                   rel="noopener noreferrer">{ name }</a>;
    else return <Fragment>{ name }</Fragment>;
}
