import React from 'react';

import { type ComboboxSelectProps } from '@/components/base/Combobox'

import { InstitutionSelect } from './InstitutionSelect';
import { TeamSelect } from './TeamSelect';
import { PersonSelect } from './PersonSelect';
import * as API from './api'

type BaseProps<Fragment> = Omit<ComboboxSelectProps<Fragment>, 'items' | 'itemToStringLabel' | 'itemToStringValue' | 'isItemEqualToValue' | 'itemName'>
type ContactSelectProps =
    ({ type: 'institution' } & BaseProps<API.InstitutionFragment>) |
    ({ type: 'team' } & BaseProps<API.TeamFragment>) |
    ({ type: 'person' } & BaseProps<API.PersonFragment>);

export const ContactSelect: React.FC<ContactSelectProps> = ({ type, ...props }) => {
    switch (type) {
        case 'institution':
            return <InstitutionSelect { ...props as BaseProps<API.InstitutionFragment> }/>
        case 'team':
            return <TeamSelect { ...props as BaseProps<API.TeamFragment> }/>
        case 'person':
            return <PersonSelect { ...props as BaseProps<API.PersonFragment> }/>
    }
}
