import { DownloadRestAPI } from '@/api/download/api';

const {
  downloadAnalysis,
} = DownloadRestAPI.endpoints


export const useDownloadAnalysis = downloadAnalysis.useMutation
