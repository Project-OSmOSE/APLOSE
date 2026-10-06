import type { ImportAnnotation } from '@/api/annotation/types';

export type Annotation = Omit<
    ImportAnnotation,
    'detector'
    | 'detector_configuration'
    | 'analysis'
> & Partial<Pick<
    ImportAnnotation,
    'detector'
    | 'detector_configuration'
>> & {
    initial__detector: string
}