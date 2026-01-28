import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SiGithub, SiLinkedin, SiResearchgate } from "react-icons/si";
import { IoMailOutline } from "react-icons/io5";
import { Back } from "../../../components/Back/Back";
import { TeamMember, useGqlSdk } from "../../../api";
import './PeopleDetail.css';

export const PeopleDetail: React.FC = () => {
    const { id: memberID } = useParams<{ id: string; }>();
    const [ member, setMember ] = useState<TeamMember>();

    const sdk = useGqlSdk()

    useEffect(() => {
        let isMounted = true;

        sdk.teamMemberById({ id: memberID }).then(({ data }) => {
            if (!isMounted) return;
            setMember(data.teamMemberById ?? undefined)
        })

        return () => {
            isMounted = false;
        }
    }, [ memberID ]);

    return (
        <div id="member-page">
            <Back path="/people" pageName="People"></Back>

            <div className="title">
                <h2>{ member?.person.lastName } { member?.person.firstName }</h2>
                <h5 className="text-muted">{ member?.position }</h5>
            </div>

            <img src={ member?.picture } alt={ `${ member?.person.initialNames }'s Portrait` }/>

            { member?.biography && <blockquote>❝&nbsp;{ member?.biography }&nbsp;❞</blockquote> }

            <div className="links">

                { member?.personalWebsiteUrl &&
                    <a href={ member.personalWebsiteUrl } target="_blank" rel="noreferrer">Personal website</a> }

                { member?.researchGateUrl &&
                    <a href={ member.researchGateUrl } target="_blank" rel="noreferrer">
                        <SiResearchgate/>
                        ResearchGate
                    </a> }

                <div className="socials">
                    { member?.githubUrl &&
                        <a href={ member.githubUrl } target="_blank" rel="noreferrer">
                            <SiGithub/>
                            Github
                        </a>
                    }

                    { member?.mailAddress &&
                        <a href={ `mailto:${ member.mailAddress }` } target="_blank" rel="noreferrer">
                            <IoMailOutline/>
                            Mail
                        </a>
                    }

                    { member?.linkedinUrl &&
                        <a href={ member.linkedinUrl } target="_blank" rel="noreferrer">
                            <SiLinkedin/>
                            LinkedIn
                        </a>
                    }
                </div>
            </div>
        </div>
    )
}
