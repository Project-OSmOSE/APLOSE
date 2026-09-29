import React, { useCallback } from "react";
import { CheckCircleBoldDuotoneIcon, DocumentTextLinearIcon } from "@solar-icons/react";
import { BehaviorNode, SourceNode, VisualObservationNode } from "@/api/types.gql-generated.ts";
import { Chip, Note, Popover } from "@/components/base";
import { Table, Tbody, Td, Th, Thead, Tr } from "@/components/ui";
import styles from './styles.module.scss'

type Obs =
    Omit<VisualObservationNode, 'behaviors' | 'reactionsToBoat' | 'deployment' | 'source' | '__typename' | 'id'>
    & {
    source: Pick<SourceNode, 'displayName'>,
    behaviors?: (Pick<BehaviorNode, 'name'> | null)[] | null,
    reactionsToBoat?: (Pick<BehaviorNode, 'name'> | null)[] | null,
}
export const VisualObservationTable: React.FC<{ obs: Obs[] }> = ({ obs }) => {

    return <Table className={ styles.Table }>
        <colgroup>
            <col className={ styles.Source }/>
            <col className={ styles.Count }/>
            <col className={ styles.Time }/>
            <col className={ styles.Distance }/>
            <col className={ styles.OtherHumanActivity }/>
            <col className={ styles.YoungPresence }/>
            <col className={ styles.Behavior }/>
            <col className={ styles.ReactionToBoat }/>
            <col className={ styles.Other }/>
        </colgroup>
        <Thead>
            <Tr>
                <Th scope="col" start>Source</Th>
                <Th scope="col">Count</Th>
                <Th scope="col">Time</Th>
                <Th scope="col">Distance</Th>
                <Th scope="col">Other human activity</Th>
                <Th scope="col">Young presence</Th>
                <Th scope="col">Behavior</Th>
                <Th scope="col">Reaction to boat</Th>
                <Th scope="col" start>Other</Th>
            </Tr>
        </Thead>
        { obs.map((o, key) => <VisualObservationBody obs={ o } key={ key }/>) }
    </Table>
}

const VisualObservationBody: React.FC<{ obs: Obs }> = ({
                                                           obs: {
                                                               additionalInformation,
                                                               behaviors,
                                                               countMax,
                                                               countMin,
                                                               endDatetime,
                                                               endDistanceMax,
                                                               endDistanceMin,
                                                               otherHumanActivityPresence,
                                                               reactionsToBoat,
                                                               source,
                                                               startDatetime,
                                                               startDistanceMax,
                                                               startDistanceMin,
                                                               youngPresence,
                                                           }
                                                       }) => {
    const formatMinMax = useCallback((min?: number | null, max?: number | null) => {
        if (!min && !max) return '-'
        if (!max) return `> ${ min }`
        if (!min) return `< ${ max }`
        return `${ min } < ${ max }`
    }, [])

    const formatTime = useCallback((time: string) => {
        const date = new Date(time);
        return date.toLocaleString('fr-FR', {
                day: 'numeric',
                month: 'numeric',
                year: 'numeric',
            })
            + '\n'
            + date.toLocaleString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZoneName: 'short',
            })
    }, [])

    const formatBool = useCallback((info?: boolean | null) => {
        if (info) return <CheckCircleBoldDuotoneIcon size={ 20 } className={ styles.successIcon }/>
        return <Note color='medium' data>-</Note>
    }, [])

    return <Tbody>
        <Tr>
            <Th scope='row' rowSpan={ 2 }><Note data>{ source.displayName }</Note></Th>
            <Td rowSpan={ 2 } center><Note data>{ formatMinMax(countMin, countMax) }</Note></Td>
            <Td rowSpan={ 1 } bottom center><Note data>{ formatTime(startDatetime) }</Note></Td>
            <Td rowSpan={ 1 } bottom center><Note data>{ formatMinMax(startDistanceMin, startDistanceMax) }</Note></Td>
            <Td rowSpan={ 2 } center>{ formatBool(otherHumanActivityPresence) }</Td>
            <Td rowSpan={ 2 } center>{ formatBool(youngPresence) }</Td>
            <Td rowSpan={ 2 }>
                <div className={ styles.Chips }>
                    { behaviors?.map((b, key) =>
                        <Chip key={ key } color='primary'>{ b?.name }</Chip>) }
                </div>
            </Td>
            <Td rowSpan={ 2 }>
                <div className={ styles.Chips }>
                    { reactionsToBoat?.map((b, key) =>
                        <Chip key={ key } color='primary'>{ b?.name }</Chip>) }
                </div>
            </Td>
            <Td rowSpan={ 2 }>
                { additionalInformation && <Popover.Root>
                    <Popover.Trigger color='primary'><DocumentTextLinearIcon/></Popover.Trigger>
                    <Popover.Content align='end'>
                        <Note data color='medium' className={ styles.OtherNote }>{ additionalInformation }</Note>
                    </Popover.Content>
                </Popover.Root> }
            </Td>
        </Tr>
        <Tr>
            <Td rowSpan={ 1 } top center><Note data>{ formatTime(endDatetime) }</Note></Td>
            <Td rowSpan={ 1 } top center><Note data>{ formatMinMax(endDistanceMin, endDistanceMax) }</Note></Td>
        </Tr>
    </Tbody>
}
