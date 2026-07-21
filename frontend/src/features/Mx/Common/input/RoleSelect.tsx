import React from 'react';
import { Select, type SelectProps } from '@/components/base';
import { RoleEnum } from '@/api';

const ALL_ROLES: RoleEnum[] = [
    RoleEnum.MainContact,
    RoleEnum.Funder,
    RoleEnum.DatasetProducer,
    RoleEnum.DatasetSupplier,
    RoleEnum.ProductionDatabase,
    RoleEnum.ProjectOwner,
    RoleEnum.ProjectManager,
    RoleEnum.ContactPoint,
]
export const RoleSelect: React.FC<Omit<SelectProps<RoleEnum>, 'items' | 'itemToElementLabel' | 'itemToStringLabel' | 'itemToStringValue' | 'isItemEqualToValue' | 'itemName'>> = (props) => {
    return <Select itemName="role"
                   items={ ALL_ROLES }
                   itemToStringValue={ item => item }
                   itemToStringLabel={ item => item }
                   itemToElementLabel={ item => item }
                   isItemEqualToValue={ (a, b) => a === b }
                   { ...props }/>
}
