import React, { Fragment, useState } from 'react';
import { Checkbox, Field, Fieldset, Select } from '@/components/base';
import { ByteUnitEnum, type StorageSpecificationInput } from '@/api/types.gql-generated';
import { ByteUnits } from '@/api/utils';
import styles from './styles.module.scss'

export const StorageSpecificationFieldset: React.FC<{
    name: string,
    input?: StorageSpecificationInput | null
}> = ({ name, input }) => {
    const [ isStorage, setIsStorage ] = useState<boolean>(!!input);
    return <Fieldset.Root>
        <Fieldset.Legend>Storage</Fieldset.Legend>

        <Field.Root name={ name } horizontal>
            <Field.Label>Is a storage device</Field.Label>
            <Checkbox checked={ isStorage } onCheckedChange={ setIsStorage }/>
            <Field.Error/>
        </Field.Root>

        { isStorage && <Fragment>

            <Field.Root>
                <Field.Label required>Capacity</Field.Label>
                <div className={ styles.WithUnit }>
                    <Field.Control name={ `${ name }-capacityAmount` }
                                   required
                                   type="number"
                                   defaultValue={ input?.capacityAmount || undefined }/>
                    <Select name={ `${ name }-capacityUnit` }
                            required
                            items={ ByteUnits }
                            itemName="unit"
                            itemToStringValue={ item => item }
                            itemToElementLabel={ item => item }
                            defaultValue={ input?.capacityUnit || ByteUnitEnum.Gb }/>
                </div>
                <Field.Error/>
            </Field.Root>

            <Field.Root name={ `${ name }-type` }>
                <Field.Label>Storage type</Field.Label>
                <Field.Control type="text" defaultValue={ input?.type || undefined }/>
                <Field.Error/>
            </Field.Root>

        </Fragment> }

    </Fieldset.Root>
}