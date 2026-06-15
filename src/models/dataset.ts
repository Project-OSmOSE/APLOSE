export class Dataset {
  public id: string;
  public name: string;
  public audioFiles: string[];
  public metadata: any;

  constructor(id: string, name: string, audioFiles: string[] = [], metadata: any = {}) {
    this.id = id;
    this.name = name;
    this.audioFiles = audioFiles;
    this.metadata = metadata;
  }
}