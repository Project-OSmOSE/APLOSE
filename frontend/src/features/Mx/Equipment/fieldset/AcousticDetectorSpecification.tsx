import React, { Fragment, useState } from 'react';
import { Checkbox, Field, Fieldset, Note } from '@/components/base';
import { type AcousticDetectorSpecificationInput } from '@/api/types.gql-generated';
import { MxOntology } from '@/features/Mx';
import styles from './styles.module.scss'

export const AcousticDetectorSpecificationFieldset: React.FC<{
    name: string,
    input?: AcousticDetectorSpecificationInput | null
}> = ({ name, input }) => {
    const [ isDetector, setIsDetector ] = useState<boolean>(!!input);
    return <Fieldset.Root>
        <Fieldset.Legend>Acoustic detector</Fieldset.Legend>

        <Field.Root name={ name } horizontal>
            <Field.Label>Is an acoustic detector device</Field.Label>
            <Checkbox checked={ isDetector } onCheckedChange={ setIsDetector }/>
            <Field.Error/>
        </Field.Root>

        { isDetector && <Fragment>

            <Field.Root name={ `${ name }-algorithmName` }>
                <Field.Label>Algorithm name</Field.Label>
                <Field.Control type="text" defaultValue={ input?.algorithmName || undefined }/>
                <Field.Error/>
            </Field.Root>

            <Field.Root name={ `${ name }-detectedLabels` }>
                <Field.Label>Detected labels</Field.Label>
                <MxOntology.LabelMultiCombobox defaultValueIDs={ input?.detectedLabels || undefined }/>
                <Field.Error/>
            </Field.Root>

            <Field.Root>
                <Field.Label>Frequency range</Field.Label>
                <div className={ [ styles.MinMax, styles.WithUnit ].join(' ') }>
                    <Field.Control name={ `${ name }-minFrequency` }
                                   type="number"
                                   placeholder="min"
                                   defaultValue={ input?.minFrequency || undefined }/>
                    <Field.Control name={ `${ name }-maxFrequency` }
                                   type="number"
                                   placeholder="max"
                                   defaultValue={ input?.maxFrequency || undefined }/>
                    <Note color="medium">Hz</Note>
                </div>
                <Field.Error/>
            </Field.Root>

        </Fragment> }

    </Fieldset.Root>
}