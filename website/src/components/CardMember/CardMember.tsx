import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { LightTeamMember } from '../../api';
import './CardMember.css';
import { TeamMemberTypeEnum } from '../../api/types.gql-generated';

export const PeopleIcon = React.memo(() =>
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" color="#0f4159" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="6" r="4" fill="currentColor"></circle>
        <ellipse opacity="0.5" cx="12" cy="17" rx="7" ry="4" fill="currentColor"></ellipse>
    </svg>
)

export const CardMember: React.FC<{ member: LightTeamMember }> = ({ member }) => {

    const description = useMemo(() => {
        if (member.type === TeamMemberTypeEnum.Collaborator) {
            return member.person.currentInstitutions
              ?.filter(i => i !== null)
              .map(i => i!.name)
              .join(', ')
        } else return member.position
    }, [ member ])

    const content = (<React.Fragment>
        <object data={member.picture} title={ `${ member.person.initialNames }'s Portrait` }>
            <PeopleIcon/>
        </object>
        <h5>{ member.person.lastName } { member.person.firstName }</h5>
        <p><small className="text-muted">{ description }</small></p>
    </React.Fragment>)

    if (member.type !== TeamMemberTypeEnum.Active) return (<div id="card-member">{ content }</div>)

    return (<Link to={ `/people/${ member.id }` } id="card-member">{ content }</Link>
    )
};
