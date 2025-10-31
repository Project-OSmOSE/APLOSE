import type { SpectrogramNode } from '../../../../src/api/types.gql-generated';

type Spectrogram = Omit<SpectrogramNode, 'analysis' | 'annotationComments' | 'annotations' | 'annotationTasks' | 'format' | 'annotationCount' | 'taskStatus' | 'validatedAnnotationCount'>
const start = new Date()
const end = new Date()
end.setSeconds(end.getSeconds() + 10)
export const spectrogram: Spectrogram = {
  id: '1',
  start: start.toISOString(),
  end: end.toISOString(),
  filename: 'filename',
  duration: 10,
}
export const AUDIO_PATH = 'filepath.wav'
export const SPECTROGRAM_PATH = 'path'
