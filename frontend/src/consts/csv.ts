export type FileType = 'csv' | 'xls' | 'xlsx';
export const MIME_TYPES: { [key in FileType]: string } = {
    'csv': 'text/csv',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
}


export const ACCEPT_CSV_SEPARATOR = ',';
export const IMPORT_ANNOTATIONS_COLUMNS = {
    required: [
        'min_frequency' as const,
        'max_frequency' as const,
        'start_datetime' as const,
        'end_datetime' as const,
        'label' as const,
        'detector' as const,
    ],
    optional: [
        'detector_configuration' as const,
        'confidence_indicator_label' as const,
        'confidence_indicator_level' as const,
    ],
}
