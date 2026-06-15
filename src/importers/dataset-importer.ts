import { Dataset } from '../models/dataset';

export class DatasetImporter {
  private audioFilesRequired: boolean;

  constructor(audioFilesRequired: boolean = true) {
    this.audioFilesRequired = audioFilesRequired;
  }

  public async importDataset(dataset: Dataset): Promise<Dataset> {
    if (this.audioFilesRequired && !dataset.audioFiles.length) {
      throw new Error('Audio files are required for this dataset.');
    }

    // Rest of the import logic here...
    return dataset;
  }
}