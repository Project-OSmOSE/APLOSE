import React from 'react';

import { type ComboboxSelectProps } from '@/components/base/Combobox'

import * as API from '../api'

import { InstitutionSelect } from './InstitutionSelect';
import { TeamSelect } from './TeamSelect';
import { PersonSelect } from './PersonSelect';
import { ContactTypeEnum } from '@/api';

type BaseProps<Fragment> = Omit<ComboboxSelectProps<Fragment>, 'items' | 'itemToStringLabel' | 'itemToStringValue' | 'isItemEqualToValue' | 'itemName'> & {
    defaultStringValue?: string;
}
type ContactSelectProps =
    ({ type: ContactTypeEnum.Institution } & BaseProps<API.InstitutionFragment>) |
    ({ type: ContactTypeEnum.Team } & BaseProps<API.TeamFragment>) |
    ({ type: ContactTypeEnum.Person } & BaseProps<API.PersonFragment>);

export const ContactSelect: React.FC<ContactSelectProps> = ({ type, ...props }) => {
    switch (type) {
        case ContactTypeEnum.Institution:
            return <InstitutionSelect { ...props as BaseProps<API.InstitutionFragment> }/>
        case ContactTypeEnum.Team:
            return <TeamSelect { ...props as BaseProps<API.TeamFragment> }/>
        case ContactTypeEnum.Person:
            return <PersonSelect { ...props as BaseProps<API.PersonFragment> }/>
    }
}
