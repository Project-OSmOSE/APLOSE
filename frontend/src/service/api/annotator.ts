import { ID } from '@/service/type.ts';
import {
  AcousticFeatures,
  AnnotationCampaign,
  AnnotationComment,
  AnnotationPhase,
  AnnotationResult,
  AnnotationResultValidations,
  DetectorConfiguration
} from "@/service/types";
import { useParams } from "react-router-dom";
import { useAppSelector } from "@/service/app.ts";
import { useCallback, useEffect, useRef } from "react";
import { useRetrieveCurrentCampaign } from "@/service/api/campaign.ts";
import { useRetrieveCurrentPhase } from "@/service/api/campaign-phase.ts";
import { API } from "@/service/api/index.ts";
import { AnnotatorState } from "@/features/Annotator";

type WriteAnnotationResult =
  Omit<AnnotationResult, "id" | "comments" | "validations" | "dataset_file" | "confidence_indicator" | "detector_configuration" | 'type' | 'updated_to'>
  & {
  id?: number;
  confidence_indicator: string | undefined;
  detector_configuration: DetectorConfiguration & { detector: string } | undefined;
  comments: Array<WriteAnnotationComment>;
  validations: Array<Omit<AnnotationResultValidations, "id" | "annotator" | "result"> & { id?: number }>;
  acoustic_features: AcousticFeatures | null;
  is_update_of: number | null; // id of updated result
};

type WriteAnnotationComment =
  Omit<AnnotationComment, "id" | "annotation_result" | "annotation_campaign" | "author" | "dataset_file">
  & { id?: number; }

export const AnnotatorAPI = API.injectEndpoints({
  endpoints: builder => ({
    postAnnotator: builder.mutation<void, {
      campaign: AnnotationCampaign,
      phase: AnnotationPhase,
      fileID: ID,
      results: WriteAnnotationResult[],
      task_comments: WriteAnnotationComment[],
      sessionStart: Date,
    }>({
      query: ({ campaign, phase, fileID, results, task_comments, sessionStart }) => {
        return {
          url: `annotator/campaign/${ campaign.id }/phase/${ phase.id }/file/${ fileID }/`,
          method: 'POST',
          body: {
            results,
            task_comments,
            session: {
              start: sessionStart.toISOString(),
              end: (new Date()).toISOString(),
            }
          }
        }
      },
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      invalidatesTags: (result, error, arg) => [ {
        type: 'Annotator',
        id: `${ arg.campaign.id }-${ arg.phase.id }-${ arg.fileID }`
      }, 'FileRangeFiles', { type: "CampaignPhase", id: arg.phase.id } ]
    })
  })
})

export const usePostAnnotator = () => {
  const { campaign } = useRetrieveCurrentCampaign()
  const { phase } = useRetrieveCurrentPhase()
  const { spectrogramID } = useParams<{ spectrogramID: string }>();
  const [ _post ] = AnnotatorAPI.endpoints.postAnnotator.useMutation()
  const slice: AnnotatorState = useAppSelector(state => state.AnnotatorSlice);
  const _slice = useRef<AnnotatorState>(slice)
  const _campaign = useRef<AnnotationCampaign | undefined>(campaign)
  const _phase = useRef<AnnotationPhase | undefined>(phase)
  const _spectrogramID = useRef<string | undefined>(spectrogramID)
  useEffect(() => {
    _slice.current = slice;
  }, [ slice ]);
  useEffect(() => {
    _campaign.current = campaign;
  }, [ campaign ]);
  useEffect(() => {
    _phase.current = phase;
  }, [ phase ]);
  useEffect(() => {
    _spectrogramID.current = spectrogramID;
  }, [ spectrogramID ]);

  return useCallback(() => {
    if (!_campaign.current || !_phase.current || !_spectrogramID.current) return;
    return _post({
      campaign: _campaign.current,
      phase: _phase.current,
      fileID: _spectrogramID.current,
      results: _slice.current.annotations.map(a => ({
        id: +a.pk > -1 ? +a.pk : undefined,
        annotator: a.annotator ? +a.annotator.pk : null,
        detector_configuration: a.detectorConfiguration ? {
          id: +a.detectorConfiguration.pk,
          detector: a.detectorConfiguration.detector.name,
          configuration: a.detectorConfiguration.configuration ?? ''
        } : undefined,
        start_time: typeof a.startTime === 'number' ? a.startTime : null,
        end_time: typeof a.endTime === 'number' ? a.endTime : null,
        start_frequency: typeof a.startFrequency === 'number' ? a.startFrequency : null,
        end_frequency: typeof a.endFrequency === 'number' ? a.endFrequency : null,
        is_update_of: a.isUpdateOfId ? +a.isUpdateOfId : null,
        label: a.label.name,
        confidence_indicator: a.confidence?.label,
        annotation_campaign_phase: +a.annotationPhase.pk,
        comments: _slice.current.comments.filter(c => c.annotationId === a.pk).map(c => ({
          id: +c.pk > -1 ? +c.pk : undefined,
          comment: c.comment,
        } as WriteAnnotationComment)),
        acoustic_features: a.acousticFeatures ? {
          start_frequency: a.acousticFeatures.startFrequency ?? null,
          end_frequency: a.acousticFeatures.endFrequency ?? null,
          trend: a.acousticFeatures.trend ?? null,
          has_harmonics: a.acousticFeatures.hasHarmonics ?? null,
          relative_min_frequency_count: a.acousticFeatures.relativeMinFrequencyCount ?? null,
          relative_max_frequency_count: a.acousticFeatures.relativeMaxFrequencyCount ?? null,
          steps_count: a.acousticFeatures.stepsCount ?? null,
        } : null,
        validations: a.validations?.results.filter(v => v !== null).map(v => ({
          id: +v.pk > -1 ? +v.pk : undefined,
          is_valid: v.isValid
        })) ?? (_phase.current?.phase === "Verification" ? [ { id: undefined, is_valid: true } ] : []),
      } satisfies WriteAnnotationResult)),
      task_comments: _slice.current.comments.filter(c => c.annotationId === null).map(c => ({
        id: +c.pk > -1 ? +c.pk : undefined,
        comment: c.comment,
      } as WriteAnnotationComment)),
      sessionStart: new Date(_slice.current.__utils.sessionStart ?? Date.now()),
    }).unwrap()
  }, [ _post, _campaign.current, _phase.current, _slice.current, _spectrogramID.current ])
}
