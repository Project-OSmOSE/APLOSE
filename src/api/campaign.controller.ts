import { Controller, Delete, Param, Body } from '@nestjs/common';
import { DetectorService } from '../services/detector.service';
import { AnnotatorService } from '../services/annotator.service';

@Controller('campaigns')
export class CampaignController {
  constructor(private readonly detectorService: DetectorService, private readonly annotatorService: AnnotatorService) {}

  @Delete(':campaignId/detectors/:detectorId')
  async removeDetector(@Param('campaignId') campaignId: string, @Param('detectorId') detectorId: string) {
    await this.detectorService.removeDetector(campaignId, detectorId);
    return { message: 'Detector removed successfully' };
  }

  @Delete(':campaignId/annotators/:annotatorId')
  async removeAnnotator(@Param('campaignId') campaignId: string, @Param('annotatorId') annotatorId: string) {
    await this.annotatorService.removeAnnotator(campaignId, annotatorId);
    return { message: 'Annotator removed successfully' };
  }
}
