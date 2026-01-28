import React from "react";
import { Link } from "react-router-dom";
import './ContactList.css';
import { PersonNode, TeamMemberNode } from "../../api/types.gql-generated";

type Contact = (
    Pick<TeamMemberNode, 'id'> & { person: Pick<PersonNode, 'initialNames'> }
    ) | string

interface ContactListProps {
    label?: string;
    contacts: Contact[];
}

export const ContactList: React.FC<ContactListProps> = ({
                                                            label,
                                                            contacts
                                                        }) => {
    if (contacts.length === 0)
        return <React.Fragment></React.Fragment>;

    return (
        <p id="contact-list" className="text-muted">
            { label && <span>{ label }: </span> }

            { contacts.map((contact, index) => (
                <span key={ index }>
                    { typeof contact === 'string' && contact }
                    { typeof contact === 'object' && <Link to={ `/people/${ contact.id }` }>
                        { contact.person.initialNames }
                    </Link> }

                    { index < (contacts.length - 1) && ', ' }
                </span>
            )) }
        </p>
    );
}
