import React from 'react';
import { Link } from "react-router-dom";
import { LightTeamMember } from "../../api";
import './CardMember.css';


export const CardMember: React.FC<{ member: LightTeamMember }> = ({ member }) => {

    const content = (<React.Fragment>
        <img src={ member.picture }
             alt={ `${ member.person.initialNames }'s Portrait` }
             title={ `${ member.person.initialNames }'s Portrait` }/>
        <h5>{ member.person.lastName } { member.person.firstName }</h5>
        <p><small className="text-muted">{ member.position }</small></p>
    </React.Fragment>)

    if (member.isFormerMember) return (<div id="card-member">{ content }</div>)

    return (<Link to={ `/people/${ member.id }` } id="card-member">{ content }</Link>
    )
};
