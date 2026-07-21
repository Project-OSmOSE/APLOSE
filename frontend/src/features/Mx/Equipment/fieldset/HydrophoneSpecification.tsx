import React, { Fragment, useState } from 'react';
import { Checkbox, Field, Fieldset, Note, PopoverInfo, Select } from '@/components/base';
import { type HydrophoneSpecificationInput } from '@/api/types.gql-generated';
import { HydrophoneDirectivities } from '@/api/utils';
import styles from './styles.module.scss'

export const HydrophoneSpecificationFieldset: React.FC<{
    name: string,
    input?: HydrophoneSpecificationInput | null
}> = ({ name, input }) => {
    const [ isHydrophone, setIsHydrophone ] = useState<boolean>(!!input);
    return <Fieldset.Root>
        <Fieldset.Legend>Hydrophone</Fieldset.Legend>

        <Field.Root name={ name } horizontal>
            <Field.Label>Is a hydrophone</Field.Label>
            <Checkbox checked={ isHydrophone } onCheckedChange={ setIsHydrophone }/>
            <Field.Error/>
        </Field.Root>

        { isHydrophone && <Fragment>

            <Field.Root name={ `${ name }-directivity` }>
                <Field.Label>Directivity</Field.Label>
                <Select items={ HydrophoneDirectivities }
                        itemName="directivity"
                        itemToStringValue={ item => item }
                        itemToElementLabel={ item => item }
                        defaultValue={ input?.directivity || undefined }/>
                <Field.Error/>
            </Field.Root>

            <Field.Root>

                <Field.Root>
                    <Field.Label>
                        Dynamic range
                        <PopoverInfo>
                            Dynamic range which the hydrophone can handle (dB SPL RMS or peak), pre-amplification included if applicable.
                        </PopoverInfo>
                    </Field.Label>
                    <div className={ [ styles.MinMax, styles.WithUnit ].join(' ') }>
                        <Field.Control name={ `${ name }-minDynamicRange` }
                                       type="number"
                                       placeholder="min"
                                       defaultValue={ input?.minDynamicRange || undefined }/>
                        <Field.Control name={ `${ name }-maxDynamicRange` }
                                       type="number"
                                       placeholder="max"
                                       defaultValue={ input?.maxDynamicRange || undefined }/>
                        <Note color="medium">dB SPL RMS or peak</Note>
                    </div>
                    <Field.Error/>
                </Field.Root>

                <Field.Label>
                    Bandwidth
                    <PopoverInfo>
                        Bandwidth within a more or less flat response of the hydrophone, pre-amplification included if applicable.
                    </PopoverInfo>
                </Field.Label>
                <div className={ [ styles.MinMax, styles.WithUnit ].join(' ') }>
                    <Field.Control name={ `${ name }-minBandwidth` }
                                   type="number"
                                   placeholder="min"
                                   defaultValue={ input?.minBandwidth || undefined }/>
                    <Field.Control name={ `${ name }-maxBandwidth` }
                                   type="number"
                                   placeholder="max"
                                   defaultValue={ input?.maxBandwidth || undefined }/>
                    <Note color="medium">Hz</Note>
                </div>
                <Field.Error/>
            </Field.Root>

            <Field.Root>
                <Field.Label>Operating depth</Field.Label>
                <div className={ [ styles.MinMax, styles.WithUnit ].join(' ') }>
                    <Field.Control name={ `${ name }-minOperatingDepth` }
                                   type="number"
                                   placeholder="min"
                                   defaultValue={ input?.minOperatingDepth || undefined }/>
                    <Field.Control name={ `${ name }-maxOperatingDepth` }
                                   type="number"
                                   placeholder="max"
                                   defaultValue={ input?.maxOperatingDepth || undefined }/>
                    <Note color="medium">m</Note>
                </div>
                <Field.Error/>
            </Field.Root>

            <Field.Root>
                <Field.Label>Operating temperature</Field.Label>
                <div className={ [ styles.MinMax, styles.WithUnit ].join(' ') }>
                    <Field.Control name={ `${ name }-operatingMinTemperature` }
                                   type="number"
                                   placeholder="min"
                                   defaultValue={ input?.operatingMinTemperature || undefined }/>
                    <Field.Control name={ `${ name }-operatingMaxTemperature` }
                                   type="number"
                                   placeholder="max"
                                   defaultValue={ input?.operatingMaxTemperature || undefined }/>
                    <Note color="medium">°C</Note>
                </div>
                <Field.Error/>
            </Field.Root>

            <Field.Root name={ `${ name }-noiseFloor` }>
                <Field.Label>
                    Noise floor
                    <PopoverInfo>
                        Self noise of the hydrophone (dB re 1µPa^2/Hz), pre-amplification included if applicable.<br/>
                        Average on bandwidth or a fix frequency (generally @5kHz for example).<br/>
                        Possibility to 'below sea-state zero' (equivalent to around 30dB @5kHz) could be nice because it
                        is often described like that.
                    </PopoverInfo>
                </Field.Label>
                <div className={ [ styles.WithUnit ].join(' ') }>
                    <Field.Control type="number" defaultValue={ input?.noiseFloor || undefined }/>
                    <Note color="medium">dB re 1µPa^2/Hz</Note>
                </div>
                <Field.Error/>
            </Field.Root>

        </Fragment> }

    </Fieldset.Root>
}