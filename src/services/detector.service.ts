import { Injectable } from '@nestjs/common';
import { CampaignModel } from '../models/campaign.model';

@Injectable()
export class DetectorService {
  async removeDetector(campaignId: string, detectorId: string) {
    const campaign = await CampaignModel.findById(campaignId);
    if (!campaign) {
      throw new Error('Campaign not found');
    }
    campaign.detectors = campaign.detectors.filter(detector => detector.id !== detectorId);
    await campaign.save();
  }
}
