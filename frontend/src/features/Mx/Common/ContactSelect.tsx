import React from 'react';

import { type ComboboxSelectProps } from '@/components/base/Combobox'

import { InstitutionSelect } from './InstitutionSelect';
import { TeamSelect } from './TeamSelect';
import { PersonSelect } from './PersonSelect';
import * as API from './api'

type BaseProps<Fragment> = Omit<ComboboxSelectProps<Fragment>, 'items' | 'itemToStringLabel' | 'itemToStringValue' | 'isItemEqualToValue' | 'itemName'>
type ContactSelectProps =
    ({ type: 'Institution' } & BaseProps<API.InstitutionFragment>) |
    ({ type: 'Team' } & BaseProps<API.TeamFragment>) |
    ({ type: 'Person' } & BaseProps<API.PersonFragment>);

export const ContactSelect: React.FC<ContactSelectProps> = ({ type, ...props }) => {
    switch (type) {
        case 'Institution':
            return <InstitutionSelect { ...props as BaseProps<API.InstitutionFragment> }/>
        case 'Team':
            return <TeamSelect { ...props as BaseProps<API.TeamFragment> }/>
        case 'Person':
            return <PersonSelect { ...props as BaseProps<API.PersonFragment> }/>
    }
}
