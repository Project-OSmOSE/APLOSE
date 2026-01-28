import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { Author } from "../../api";

export const Authors: React.FC<{ authors: Author[] }> = ({ authors }) => <Fragment>

    { authors
        .sort((a, b) => (a.order ?? -1) - (b.order ?? -1))
        .map((author, key) => <Fragment key={ key }>
            { key !== 0 && <span>, </span> }

            { author.person.teamMember && !author.person.teamMember?.isFormerMember &&
                <Link to={ `/people/${ author.person.teamMember?.id }` }
                      onClick={ e => e.stopPropagation() }>
                    { author.person.initialNames }
                </Link> }
            { (!author.person.teamMember || author.person.teamMember?.isFormerMember) &&
                <span>{ author.person.initialNames }</span> }
        </Fragment>)
    }

</Fragment>