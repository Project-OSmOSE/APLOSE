import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ACCEPT_CSV_MIME_TYPE, ACCEPT_CSV_SEPARATOR, IMPORT_ANNOTATIONS_COLUMNS } from '@/consts/csv';
import { type ImportAnnotation, type SpectrogramAnalysisNode, useCurrentCampaign, useImportAnnotations } from '@/api';
import { QueryStatus } from '@reduxjs/toolkit/query';

const CHUNK_SIZE = 200;

class UnreadableFileError extends Error {
  message = 'Error reading file, check the file isn\'t corrupted'
}

class WrongMIMETypeError extends Error {
  constructor(type: string) {
    super(`Wrong MIME Type, found : ${ type } ; but accepted types are: ${ ACCEPT_CSV_MIME_TYPE }`);
  }
}

class UnsupportedCSVError extends Error {
  message = `The file is empty or it does not contain a string content.`
}

class EmptyCSVError extends Error {
  message = 'The CSV is empty'
}


type FileStatus = 'initial' | 'loading' | 'error' | 'loaded';
type FileContextState = {
  fileState: 'initial' | 'loading',
} | {
  fileState: 'error',
  error: any,
} | {
  fileState: 'loaded',
  file: File,
}

type UploadStatus = 'initial' | 'uploading' | 'error' | 'uploaded';
type UploadContextState = {
  uploadState: 'initial' | 'uploading' | 'uploaded',
} | {
  uploadState: 'error',
  error: any,
}

type DetectorConfiguration = { id: string, configuration: string } | { id?: never, configuration: string }

type ImportAnnotationsContext = {
  analysisID?: string;
  analysis?: Pick<SpectrogramAnalysisNode, 'id' | 'name'>;

  /** List of initial names (as in csv) */
  fileDetectorNames: string[],
  /** List of initial names (as in csv) */
  selectedDetectorsForImport: string[],
  /** Record of initial names (as in csv) and the ID of the known detector or undefined if its needs to be created */
  unknownToKnownDetectors: Record<string, undefined | string>;

  unknownToConfiguration: Record<string, DetectorConfiguration>;
  annotations: Annotation[],

  canImport: boolean;
  forceDatetime: boolean;
  forceMaxFrequency: boolean;
  canForceDatetime: boolean;
  canForceMaxFrequency: boolean;
  uploadedCount: number;
  uploadDuration: number;
  remainingUploadDuration?: number,

  load(file: File): Promise<void>;
  reset(): void;

  setAnalysisID(id: string): void;
  selectDetectorForImport(initialName: string): void;
  unselectDetectorForImport(initialName: string): void;
  createUnknownDetector(initialName: string): void;
  assignUnknownToKnownDetector(initialName: string, id: string): void;
  assignUnknownToConfiguration(initialName: string, configuration: DetectorConfiguration): void;
  upload(options?: {
    force_datetime?: boolean;
    force_max_frequency?: boolean;
  }): void;
} & FileContextState & UploadContextState

export const ImportAnnotationsContext = createContext<ImportAnnotationsContext>({
  fileState: 'initial',

  fileDetectorNames: [],
  selectedDetectorsForImport: [],
  unknownToKnownDetectors: {},
  unknownToConfiguration: {},
  annotations: [],

  canImport: false,
  forceDatetime: false,
  forceMaxFrequency: false,
  canForceDatetime: false,
  canForceMaxFrequency: false,
  uploadedCount: 0,
  uploadDuration: 0,

  load: async () => {
  },
  reset: () => {
  },
  setAnalysisID: () => {
  },
  selectDetectorForImport: () => {
  },
  unselectDetectorForImport: () => {
  },
  createUnknownDetector: () => {
  },
  assignUnknownToKnownDetector: () => {
  },
  assignUnknownToConfiguration: () => {
  },
  upload: () => {
  },

  uploadState: 'initial',
})

export const useImportAnnotationsContext = () => {
  const context = useContext(ImportAnnotationsContext);
  if (!context) {
    throw new Error('useImportAnnotationsContext must be used within a ImportAnnotationsContextProvider');
  }
  return context;
}

type Annotation = Omit<
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

export const ImportAnnotationsContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { allAnalysis } = useCurrentCampaign();
  const {
    importAnnotations,
    status,
    originalArgs,
    error,
    startedTimeStamp,
    fulfilledTimeStamp,
  } = useImportAnnotations()

  const [ analysisID, setAnalysisID ] = useState<string>();
  useEffect(() => {
    if (allAnalysis && allAnalysis.length === 1) {
      setAnalysisID(allAnalysis[0].id)
    }
  }, [ allAnalysis ]);
  const analysis = useMemo(() => {
    return allAnalysis?.find(a => a.id == analysisID)
  }, [ analysisID, allAnalysis ])
  const [ fileState, setFileState ] = useState<FileStatus>('initial')
  const [ fileError, setFileError ] = useState<any>();
  const [ file, setFile ] = useState<File>();
  const [ selectedDetectorsForImport, setSelectedDetectorsForImport ] = useState<string[]>([]);
  const [ unknownToKnownDetectors, setUnknownToKnownDetectors ] = useState<Record<string, string | undefined>>({});
  const [ unknownToConfiguration, setUnknownToConfiguration ] = useState<Record<string, DetectorConfiguration>>({});

  const [ uploadState, setUploadState ] = useState<UploadStatus>('initial')
  const [ uploadError, setUploadError ] = useState<any>();

  const [ canForceDatetime, setCanForceDatetime ] = useState<boolean>(false);
  const [ canForceMaxFrequency, setCanForceMaxFrequency ] = useState<boolean>(false);
  const [ forceDatetime, setForceDatetime ] = useState<boolean>(false);
  const [ forceMaxFrequency, setForceMaxFrequency ] = useState<boolean>(false);
  const [ uploadedCount, setUploadedCount ] = useState<number>(0);
  const [ uploadDuration, setUploadDuration ] = useState<number>(0);

  const [ annotations, setAnnotations ] = useState<Annotation[]>([]);
  const fileDetectorNames = useMemo(() => [ ...new Set(annotations.map(a => a.initial__detector__name)) ], [ annotations ])

  const remainingUploadDuration = useMemo<number | undefined>(() => {
    if (!uploadDuration) return undefined;
    return (annotations.length - uploadedCount) * uploadDuration / uploadedCount
  }, [ annotations, uploadedCount, uploadDuration ]);

  const load = useCallback(async (file: File) => {
    setFileState('loading');
    if (!ACCEPT_CSV_MIME_TYPE.includes(file.type)) {
      setFileState('error');
      return setFileError(new WrongMIMETypeError(file.type))
    }

    let rows: string[][] = []
    try {
      rows = await new Promise<string[][]>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        reader.onerror = () => reject(new UnreadableFileError())
        reader.onload = (event) => {
          const result = event.target?.result;
          if (!result || typeof result !== 'string') {
            reject(new UnsupportedCSVError())
            return;
          }

          let lines = result.replaceAll('\r', '').split('\n').map(l => [ l ]);
          lines = lines.map(l => l.flatMap(l => l.split(ACCEPT_CSV_SEPARATOR))).filter(d => d.length > 1);
          if (lines.length === 0) reject(new EmptyCSVError())

          const missingColumns = [];
          const headers = lines[0]
          for (const column of IMPORT_ANNOTATIONS_COLUMNS.required) {
            if (!headers.includes(column)) missingColumns.push(column);
          }
          if (missingColumns.length > 0)
            throw new Error(`Missing columns: ${ missingColumns.join(', ') }`);
          resolve(lines)
        }
      })
    } catch (error) {
      setFileState('error');
      return setFileError(error)
    }

    const contentRows = rows
    contentRows.reverse()
    const header = contentRows.pop()!
    contentRows.reverse()
    setAnnotations(contentRows.map(r => {
      const confidence__level = r[header.indexOf('confidence_indicator_level')].split('/')
      return {
        start_datetime: r[header.indexOf('start_datetime')],
        end_datetime: r[header.indexOf('end_datetime')],
        start_frequency: +r[header.indexOf('start_frequency')],
        end_frequency: +r[header.indexOf('end_frequency')],
        label__name: r[header.indexOf('label')],
        confidence__label: r[header.indexOf('confidence_indicator_label')],
        confidence__level: confidence__level.length > 0 ? +confidence__level[0] : undefined,
        initial__detector__name: r[header.indexOf('annotator')],
      } as Annotation
    }))
    setFileState('loaded');
    setFile(file)
  }, [])

  const reset = useCallback(() => {
    setFile(undefined)
    setFileState('initial')
    setFileError(undefined)
    setSelectedDetectorsForImport([])
    setUnknownToKnownDetectors({})
    setUnknownToConfiguration({})
    setUploadState('initial')
    setUploadError(undefined)
    setCanForceDatetime(false)
    setCanForceMaxFrequency(false)
    setForceDatetime(false)
    setForceMaxFrequency(false)
    setAnalysisID(undefined)
    setUploadedCount(0)
    setUploadDuration(0)
  }, [])

  const selectDetectorForImport = useCallback((initialName: string) => {
    setSelectedDetectorsForImport(prev => [ ...new Set([ ...prev, initialName ]) ])
  }, [ setSelectedDetectorsForImport ])

  const unselectDetectorForImport = useCallback((initialName: string) => {
    setSelectedDetectorsForImport(prev => prev.filter(n => n !== initialName))
  }, [ setSelectedDetectorsForImport, setSelectedDetectorsForImport ])

  const createUnknownDetector = useCallback((initialName: string) => {
    setUnknownToKnownDetectors(prev => ({ ...prev, [initialName]: undefined }))
    setSelectedDetectorsForImport(prev => [ ...new Set([ ...prev, initialName ]) ])
  }, [ setUnknownToKnownDetectors ])

  const assignUnknownToKnownDetector = useCallback((initialName: string, id: string) => {
    setUnknownToKnownDetectors(prev => ({ ...prev, [initialName]: id }))
    setSelectedDetectorsForImport(prev => [ ...new Set([ ...prev, initialName ]) ])
  }, [ setUnknownToKnownDetectors, setSelectedDetectorsForImport ])

  const assignUnknownToConfiguration = useCallback((initialName: string, configuration: DetectorConfiguration) => {
    setUnknownToConfiguration(prev => ({ ...prev, [initialName]: configuration }))
  }, [ setUnknownToConfiguration ])

  const fileContextValue: FileContextState = useMemo(() => {
    switch (fileState) {
      case 'loaded':
        return { fileState: 'loaded', file: file! }
      case 'error':
        return { fileState: 'error', error: fileError }
      default:
        return { fileState }
    }
  }, [ fileState, fileError, file ])

  const uploadContextValue: UploadContextState = useMemo(() => {
    switch (uploadState) {
      case 'error':
        return { uploadState: 'error', error: uploadError }
      default:
        return { uploadState }
    }
  }, [ uploadState, uploadError, file ])

  const canImport = useMemo<boolean>(() => {
    if (!analysisID) return false;
    if (fileState !== 'loaded') return false
    if (selectedDetectorsForImport.length === 0) return false
    return selectedDetectorsForImport.map(initialName => {
      return !!unknownToConfiguration[initialName];
    }).reduce((a, b) => a && b, true)
  }, [ analysisID, fileState, uploadState, selectedDetectorsForImport, unknownToConfiguration ])

  const uploadChunk = useCallback((start: number = 0, options?: {
    bypassUploadState?: true;
    force_datetime?: boolean;
    force_max_frequency?: boolean;
  }) => {
    if (!canImport) return;
    if (uploadState !== 'uploading' && !options?.bypassUploadState) return;
    importAnnotations(annotations.slice(start, start + CHUNK_SIZE).map(a => ({
        ...a,
        analysis: analysisID!,
        detector__name: unknownToKnownDetectors[a.initial__detector__name] ?? a.initial__detector__name,
        detector_configuration__configuration: unknownToConfiguration[a.initial__detector__name]?.configuration,
      }
    )))
  }, [ importAnnotations, annotations, canImport, uploadState, unknownToKnownDetectors, unknownToConfiguration ])

  const upload = useCallback((options?: {
    force_datetime?: boolean;
    force_max_frequency?: boolean;
  }) => {
    if (!canImport) return;
    if (uploadState === 'uploading') return;
    const isDatetimeForced = options?.force_datetime !== undefined ? options.force_datetime : (uploadState === 'initial' ? false : forceDatetime)
    const isMaxFrequencyForced = options?.force_max_frequency !== undefined ? options.force_max_frequency : (uploadState === 'initial' ? false : forceMaxFrequency)
    setUploadState('uploading')
    setForceDatetime(isDatetimeForced)
    setForceMaxFrequency(isMaxFrequencyForced)
    if (uploadState === 'initial') {
      setUploadedCount(0)
      setUploadDuration(0)
    }
    uploadChunk(uploadState === 'initial' ? 0 : uploadedCount, {
      bypassUploadState: true,
      force_datetime: isDatetimeForced,
      force_max_frequency: isMaxFrequencyForced,
    })
  }, [ canImport, uploadState, forceDatetime, forceMaxFrequency, uploadedCount ])

  // Update duration and remainingDurationEstimation
  useEffect(() => {
    if (uploadState !== 'uploading') return;
    if (!fulfilledTimeStamp || !startedTimeStamp) return;
    setUploadDuration(uploadDuration + (fulfilledTimeStamp - startedTimeStamp))
  }, [ startedTimeStamp, fulfilledTimeStamp ]);

  // Manage chunk import failed
  useEffect(() => {
    if (uploadState !== 'uploading') return;
    if (!error) return;
    setUploadState('error')
    setUploadError(error)
    try {
      setCanForceDatetime((error as any).canForceDatetime)
      setCanForceMaxFrequency((error as any).canForceMaxFrequency)
    } finally {
      /* empty */
    }
  }, [ error ]);

  // Manage chunk import fulfilled
  useEffect(() => {
    if (uploadState !== 'uploading') return;
    if (status !== QueryStatus.fulfilled) return;
    if (!originalArgs) return;
    const uploaded = uploadedCount + originalArgs.annotations.length;
    const state = annotations.length > uploaded ? 'uploading' : 'uploaded' as UploadStatus;
    setUploadState(state)
    setUploadedCount(uploadedCount + originalArgs.annotations.length)
    if (state === 'uploading') uploadChunk(uploaded, {
      force_datetime: forceDatetime,
      force_max_frequency: forceMaxFrequency,
    });
  }, [ status, originalArgs ]);

  return <ImportAnnotationsContext.Provider children={ children }
                                            value={ {
                                              ...fileContextValue,
                                              ...uploadContextValue,
                                              fileDetectorNames,
                                              selectedDetectorsForImport,
                                              unselectDetectorForImport,
                                              unknownToKnownDetectors,
                                              createUnknownDetector,
                                              assignUnknownToKnownDetector,
                                              unknownToConfiguration,
                                              assignUnknownToConfiguration,
                                              load,
                                              reset,
                                              selectDetectorForImport,
                                              canImport,
                                              remainingUploadDuration,
                                              canForceDatetime,
                                              canForceMaxFrequency,
                                              forceDatetime,
                                              forceMaxFrequency,
                                              annotations,
                                              upload,
                                              analysisID,
                                              analysis,
                                              setAnalysisID,
                                              uploadDuration,
                                              uploadedCount,
                                            } }/>;
}
