import { Injectable } from '@nestjs/common';
import { CampaignModel } from '../models/campaign.model';

@Injectable()
export class AnnotatorService {
  async removeAnnotator(campaignId: string, annotatorId: string) {
    const campaign = await CampaignModel.findById(campaignId);
    if (!campaign) {
      throw new Error('Campaign not found');
    }
    campaign.annotators = campaign.annotators.filter(annotator => annotator.id !== annotatorId);
    await campaign.save();
  }
}
