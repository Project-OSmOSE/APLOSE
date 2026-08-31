import React, { useMemo } from 'react';
import { InfoCircle } from '@solar-icons/react';
import { Dialog, Note } from '@/components/base';
import { Key, KEYS, useFormatKey } from './keys';
import styles from './styles.module.scss'

export const InfoDialog = React.memo(() =>
    <Dialog.Root>
        <Dialog.Trigger>
            <InfoCircle weight="Linear" size={ 16 }/> All fields
        </Dialog.Trigger>
        <Dialog.Portal>
            <Dialog.Content>
                <Dialog.Title>Available fields</Dialog.Title>
                <Dialog.CloseIcon/>

                <div className={ styles.Info }>
                    <Note color="medium">Base fields on channel configuration</Note>
                    <Info keys={ KEYS.allForBase }/>

                    <br/>
                    <Note color="medium">With recordings</Note>
                    <Info keys={ KEYS.allForRecording }/>

                    <br/>
                    <Note color="medium">With detections</Note>
                    <Info keys={ KEYS.allForDetection }/>
                </div>
            </Dialog.Content>
        </Dialog.Portal>
    </Dialog.Root>,
)

const Info: React.FC<{ keys: Key[] }> = ({ keys }) => {

    const directInfo = useMemo(() => {
        return keys.filter(k => k.split('-').length === 1)
    }, [ keys ])

    const innerGroup = useMemo(() => {
        return keys.filter(key => key.split('-').length > 1)
            .reduce((aggregate, key) => {
                const groupName = key.split('-')[0]
                const groupChild = key.split('-').slice(1).join('-')
                if (groupName in aggregate) aggregate[groupName].push(groupChild)
                else aggregate[groupName] = [ groupChild ]
                return aggregate
            }, {} as Record<string, string[]>)
    }, [ keys ])

    const formatKey = useFormatKey()

    return <ul>

        { directInfo.map(key => <li key={ key }>{ formatKey(key) }</li>) }

        { Object.entries(innerGroup).map(([ name, children ]) => <li key={ name }>
            <i>{ name }</i>
            <Info keys={ children as Key[] }/>
        </li>) }

    </ul>
}
