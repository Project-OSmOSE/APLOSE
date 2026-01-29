import React, { Fragment, useEffect, useState } from 'react';
import { PageTitle } from '../../components/PageTitle';
import { CardMember } from '../../components/CardMember/CardMember';
import imgTitle from '../../img/illust/pexels-daniel-torobekov-5901263_1280_thin.jpg';
import { LightTeamMember, useGqlSdk } from '../../api';
import './People.css';
import { TeamMemberTypeEnum } from '../../api/types.gql-generated';


export const People: React.FC = () => {

  const [ members, setMembers ] = useState<Array<LightTeamMember>>([])
  const [ collaborators, setCollaborators ] = useState<Array<LightTeamMember>>([])
  const [ formerMembers, setFormerMembers ] = useState<Array<LightTeamMember>>([])

  const sdk = useGqlSdk()

  useEffect(() => {
    let isMounted = true;
    sdk.allTeamMembers().then(({ data }) => {
      if (!isMounted) return;

      const allMembers = data.allTeamMembers?.results.filter(t => t !== null) ?? []
      setMembers(allMembers.filter(m => m?.type === TeamMemberTypeEnum.Active) as any)
      setCollaborators(allMembers.filter(m => m?.type === TeamMemberTypeEnum.Collaborator) as any)
      setFormerMembers(allMembers.filter(m => m?.type === TeamMemberTypeEnum.Former) as any)
    })

    return () => {
      isMounted = false;
    }
  }, []);

  return (
    <div id="people-page">

      <PageTitle img={ imgTitle } imgAlt="People Banner">
        OUR TEAM
      </PageTitle>

      <section>
        <div className="members-grid">
          {
            members.map(member => (<CardMember key={ member.id } member={ member }></CardMember>))
          }
        </div>
        { collaborators.length > 0 && <Fragment>
            <h2>Collaborators</h2>
            <div className="members-grid">
              {
                collaborators.map(member => (<CardMember key={ member.id } member={ member }></CardMember>))
              }
            </div>
        </Fragment> }
        <h2>Former members</h2>
        <div className="members-grid">
          {
            formerMembers.map(member => (<CardMember key={ member.id } member={ member }></CardMember>))
          }
        </div>
      </section>

    </div>
  )
    ;
}
