import { Model, Document } from 'mongoose';
import { Phase } from './phase.model';

export interface Campaign extends Document {
  name: string;
  phases: Phase[];
  detectors: Detector[];
  annotators: Annotator[];
}

export interface Detector {
  id: string;
  name: string;
  enabled: boolean;
}

export interface Annotator {
  id: string;
  name: string;
  enabled: boolean;
}

export const CampaignSchema = new Schema({
  name: { type: String, required: true },
  phases: [{ type: Schema.Types.ObjectId, ref: 'Phase' }],
  detectors: [{ type: Detector }],
  annotators: [{ type: Annotator }],
});

export const CampaignModel: Model<Campaign> = model('Campaign', CampaignSchema);
