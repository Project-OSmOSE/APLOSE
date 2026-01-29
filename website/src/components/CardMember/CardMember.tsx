import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { LightTeamMember } from '../../api';
import './CardMember.css';
import { TeamMemberTypeEnum } from '../../api/types.gql-generated';


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
        <img src={ member.picture }
             alt={ `${ member.person.initialNames }'s Portrait` }
             title={ `${ member.person.initialNames }'s Portrait` }/>
        <h5>{ member.person.lastName } { member.person.firstName }</h5>
        <p><small className="text-muted">{ description }</small></p>
    </React.Fragment>)

    if (member.type !== TeamMemberTypeEnum.Active) return (<div id="card-member">{ content }</div>)

    return (<Link to={ `/people/${ member.id }` } id="card-member">{ content }</Link>
    )
};
