import React, { Fragment, useState } from 'react';
import { Checkbox, Field, Fieldset, Select } from '@/components/base';
import { ByteUnitEnum, type RecorderSpecificationInput } from '@/api/types.gql-generated';
import { ByteUnits } from '@/api/utils';
import styles from './styles.module.scss'

export const RecorderSpecificationFieldset: React.FC<{
    name: string,
    input?: RecorderSpecificationInput | null
}> = ({ name, input }) => {
    const [ isRecorder, setIsRecorder ] = useState<boolean>(!!input);
    return <Fieldset.Root>
        <Fieldset.Legend>Recorder</Fieldset.Legend>

        <Field.Root name={ name } horizontal>
            <Field.Label>Is a recorder</Field.Label>
            <Checkbox checked={ isRecorder } onCheckedChange={ setIsRecorder }/>
            <Field.Error/>
        </Field.Root>

        { isRecorder && <Fragment>

            <Field.Root name={ `${ name }-channelsCount` }>
                <Field.Label>Channels count</Field.Label>
                <Field.Control type="number" defaultValue={ input?.channelsCount || undefined }/>
                <Field.Error/>
            </Field.Root>

            <Field.Root name={ `${ name }-storageType` }>
                <Field.Label>Storage device type</Field.Label>
                <Field.Control type="text" defaultValue={ input?.storageType || undefined }/>
                <Field.Error/>
            </Field.Root>

            <Field.Root name={ `${ name }-storageSlotsCount` }>
                <Field.Label>Storage device slots count</Field.Label>
                <Field.Control type="number" defaultValue={ input?.storageSlotsCount || undefined }/>
                <Field.Error/>
            </Field.Root>

            <Field.Root>
                <Field.Label>Storage device maximum capacity supported</Field.Label>
                <div className={ styles.WithUnit }>
                    <Field.Control name={ `${ name }-storageMaximumCapacityAmount` }
                                   type="number"
                                   defaultValue={ input?.storageMaximumCapacityAmount || undefined }/>
                    <Select name={ `${ name }-storageMaximumCapacityUnit` }
                            items={ ByteUnits }
                            itemName="unit"
                            itemToStringValue={ item => item }
                            itemToElementLabel={ item => item }
                            defaultValue={ input?.storageMaximumCapacityUnit || ByteUnitEnum.Gb }/>
                </div>
                <Field.Error/>
            </Field.Root>

        </Fragment> }

    </Fieldset.Root>
}