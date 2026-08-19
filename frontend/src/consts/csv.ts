export type FileType = 'csv' | 'xls' | 'xlsx';
export const MIME_TYPES: { [key in FileType]: string } = {
    'csv': 'text/csv',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
}


export const ACCEPT_CSV_SEPARATOR = ',';
export const IMPORT_ANNOTATIONS_COLUMNS = {
    required: [
        'start_frequency' as const,
        'end_frequency' as const,
        'start_datetime' as const,
        'end_datetime' as const,
        'annotation' as const,
        'annotator' as const,
    ],
    optional: [
        'confidence_indicator_label' as const,
        'confidence_indicator_level' as const,
    ],
}
