import React from 'react';

import { type ComboboxSelectProps } from '@/components/base/Combobox'

import * as API from '../api'

import { InstitutionSelect } from './InstitutionSelect';
import { TeamSelect } from './TeamSelect';
import { PersonSelect } from './PersonSelect';

type BaseProps<Fragment> = Omit<ComboboxSelectProps<Fragment>, 'items' | 'itemToStringLabel' | 'itemToStringValue' | 'isItemEqualToValue' | 'itemName'> & {
    defaultStringValue?: string;
}
type ContactSelectProps =
    ({ type: API.ContactTypeEnum.Institution } & BaseProps<API.InstitutionFragment>) |
    ({ type: API.ContactTypeEnum.Team } & BaseProps<API.TeamFragment>) |
    ({ type: API.ContactTypeEnum.Person } & BaseProps<API.PersonFragment>);

export const ContactSelect: React.FC<ContactSelectProps> = ({ type, ...props }) => {
    switch (type) {
        case API.ContactTypeEnum.Institution:
            return <InstitutionSelect { ...props as BaseProps<API.InstitutionFragment> }/>
        case API.ContactTypeEnum.Team:
            return <TeamSelect { ...props as BaseProps<API.TeamFragment> }/>
        case API.ContactTypeEnum.Person:
            return <PersonSelect { ...props as BaseProps<API.PersonFragment> }/>
    }
}
