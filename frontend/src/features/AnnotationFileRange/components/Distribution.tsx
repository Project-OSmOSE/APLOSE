import React from 'react';
import type { AnnotationFileRangeNode } from '@/api/types.gql-generated';
import { Note, Popover } from '@/components/base';
import type { BaseColor } from '@/components/base/types';
import styles from './styles.module.scss'


type UpdateFileRangeDialogProps = {
    label?: string,
    color: BaseColor,
    spectrogramsCount: number,
    fileRanges: Pick<AnnotationFileRangeNode, 'firstFileIndex' | 'lastFileIndex'>[],
}
export const FileRangeDistribution: React.FC<UpdateFileRangeDialogProps> = ({
                                                                                label,
                                                                                color,
                                                                                fileRanges,
                                                                                spectrogramsCount,
                                                                            }) => (
    <div className={ styles.DistributionContainer }>
        { label && <Note className={ styles.Label } color={ color }>{ label }</Note> }

        <Note data color="medium">0</Note>

        <div className={ styles.Distribution }>
            { fileRanges.map(({ firstFileIndex, lastFileIndex }, index) =>
                <Popover.Root key={ index }>
                    <Popover.Trigger className={ styles.Range }
                                     color={ color }
                                     style={ {
                                         left: `${ firstFileIndex / spectrogramsCount * 100 }%`,
                                         width: `${ (lastFileIndex - firstFileIndex) / spectrogramsCount * 100 }%`,
                                     } }/>
                    <Popover.Content>
                        <Note data color="medium">{ firstFileIndex } - { lastFileIndex }</Note>
                    </Popover.Content>
                </Popover.Root>,
            ) }
        </div>
        <Note data color="medium">{ spectrogramsCount }</Note>
    </div>
)