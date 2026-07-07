import type { ImportAnnotation } from '@/api/annotation/types';

export type Annotation = Omit<
    ImportAnnotation,
    'detector__name'
    | 'detector_configuration__configuration'
    | 'analysis'
> & Partial<Pick<
    ImportAnnotation,
    'detector__name'
    | 'detector_configuration__configuration'
>> & {
    initial__detector__name: string
}