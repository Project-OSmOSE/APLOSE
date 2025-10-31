"""View for file downloads"""
import csv
import io
import zipfile

from dateutil import parser
from django.db import models
from django.db.models import (
    Case,
    When,
    Exists,
    OuterRef,
    Subquery,
    QuerySet,
    F,
)
from django.db.models.functions import Lower
from django.http import HttpResponse
from rest_framework.decorators import action
from rest_framework.generics import get_object_or_404
from rest_framework.viewsets import ViewSet

from backend.api.models import (
    AnnotationPhase,
    AnnotationValidation,
    AnnotationFileRange,
    Spectrogram,
    AnnotationTask,
)
from backend.api.models import (
    SpectrogramAnalysis,
)
from backend.api.context_filters import AnnotationPhaseContextFilter
from backend.utils.renderers import CSVRenderer

REPORT_HEADERS = [  # headers
    "dataset",
    "filename",
    "result_id",
    "is_update_of_id",
    "start_time",
    "end_time",
    "start_frequency",
    "end_frequency",
    "annotation",
    "annotator",
    "annotator_expertise",
    "start_datetime",
    "end_datetime",
    "is_box",
    "type",
    "confidence_indicator_label",
    "confidence_indicator_level",
    "comments",
    "signal_quality",
    "signal_start_frequency",
    "signal_end_frequency",
    "signal_relative_max_frequency_count",
    "signal_relative_min_frequency_count",
    "signal_has_harmonics",
    "signal_trend",
    "signal_steps_count",
    "created_at_phase",
]


class DownloadViewSet(ViewSet):
    """Download view set"""

    @action(
        detail=False,
        url_path="analysis-export/(?P<pk>[^/.]+)",
        url_name="analysis-export",
    )
    def download_analysis_export(self, request, pk=None):
        """
        Download analysis export
        For legacy analysis: audio metadata and spectro config csv
        For current analysis: TODO: translate in new osekit
        """
        analysis: SpectrogramAnalysis = get_object_or_404(
            SpectrogramAnalysis.objects.all(), pk=pk
        )

        # Create a buffer to write the zipfile into
        zip_buffer = io.BytesIO()

        # Create the zipfile, giving the buffer as the target
        with zipfile.ZipFile(zip_buffer, "w") as zip_file:
            if analysis.legacy:
                zip_file.writestr(
                    "audio_metadatum.csv",
                    data=analysis.legacy_audio_metadatum_csv().encode("utf-8"),
                )
                zip_file.writestr(
                    "spectrogram_configuration.csv",
                    data=analysis.legacy_spectrogram_configuration_csv().encode(
                        "utf-8"
                    ),
                )
            else:
                zip_file.writestr(
                    "create_analyse.py",
                    data=f"""import numpy as np
from osekit.public_api.analysis import Analysis, AnalysisType
from pandas import Timestamp, Timedelta
from scipy.signal import ShortTimeFFT

fft = ShortTimeFFT(
    mfft={analysis.fft.nfft},
    win=np.array({list(int(item) for item in analysis.fft.window) if analysis.fft.window else []}),
    hop={round(analysis.fft.window_size * (1 - analysis.fft.overlap))},
    fs={analysis.fft.sampling_frequency},
    scale_to={analysis.fft.scaling if analysis.fft.scaling in ["magnitude", "psd"] else None},
)

analysis = Analysis(
    analysis_type=AnalysisType.SPECTROGRAM,  # Spectro only
    begin=Timestamp.fromisoformat("{parser.parse(analysis.start_date.isoformat()).isoformat()}").tz_localize(0),
    end=Timestamp.fromisoformat("{parser.parse(analysis.end_date.isoformat()).isoformat()}").tz_localize(0),
    data_duration=Timedelta(f"{analysis.data_duration}s"),
    sample_rate={analysis.fft.sampling_frequency},
    name="{analysis.name}",
    fft=fft,
    colormap="{analysis.colormap.name}",
)
                    """.encode(
                        "utf-8"
                    ),
                )

        response = HttpResponse(content_type="application/x-zip-compressed")
        response["Content-Disposition"] = f"attachment; filename={analysis.name}.zip"
        # Write the value of our buffer to the response
        response.write(zip_buffer.getvalue())
        return response

    @action(
        detail=False,
        url_path="phase-annotations/(?P<pk>[^/.]+)",
        url_name="phase-annotations",
        renderer_classes=[CSVRenderer],
    )
    def download_phase_annotations(self, request, pk=None):
        """Download annotation results csv"""
        phase: AnnotationPhase = AnnotationPhaseContextFilter.get_node_or_fail(
            request, pk
        )
        campaign = phase.annotation_campaign

        response = HttpResponse(content_type="text/csv")
        filename = f"{campaign.name.replace(' ', '_')}_status.csv"
        response["Content-Disposition"] = f'attachment; filename="{filename}"'

        validate_users = list(
            AnnotationValidation.objects.filter(
                annotation__annotation_phase__annotation_campaign_id=phase.annotation_campaign_id
            )
            .select_related("annotator")
            .order_by("annotator__username")
            .values_list("annotator__username", flat=True)
            .distinct()
        )

        # CSV
        headers = REPORT_HEADERS
        if phase.phase == AnnotationPhase.Type.VERIFICATION:
            headers = headers + validate_users
        writer = csv.DictWriter(response, fieldnames=headers)
        writer.writeheader()

        def map_validations(user: str) -> [str, Case]:
            validation_sub = AnnotationValidation.objects.filter(
                annotator__username=user,
                result_id=OuterRef("id"),
            )

            query = Case(
                When(Exists(Subquery(validation_sub.filter(is_valid=True))), then=True),
                When(
                    Exists(Subquery(validation_sub.filter(is_valid=False))), then=False
                ),
                default=None,
                output_field=models.BooleanField(null=True),
            )
            return [user, query]

        results = (
            self._report_get_results()
            .annotate(**dict(map(map_validations, validate_users)))
            .values(*headers)
        )
        comments = self._report_get_task_comments().values(
            "dataset",
            "filename",
            "annotator",
            "start_datetime",
            "end_datetime",
            "comments",
        )

        writer.writerows(list(results) + list(comments))

        return response

    @action(
        detail=False,
        url_path="phase-progression/(?P<pk>[^/.]+)",
        url_name="phase-progression",
        renderer_classes=[CSVRenderer],
    )
    def download_phase_progression(self, request, pk=None):
        """Returns the CSV report on tasks status for the given campaign"""
        phase: AnnotationPhase = AnnotationPhaseContextFilter.get_node_or_fail(
            request, pk
        )
        campaign = phase.annotation_campaign

        response = HttpResponse(content_type="text/csv")
        filename = f"{campaign.name.replace(' ', '_')}_status.csv"
        response["Content-Disposition"] = f'attachment; filename="{filename}"'

        # Headers
        header = ["dataset", "filename"]
        file_ranges: QuerySet[AnnotationFileRange] = phase.annotation_file_ranges
        annotators = (
            file_ranges.values("annotator__username")
            .distinct()
            .order_by(Lower("annotator__username"))
            .values_list("annotator__username", flat=True)
        )
        header += annotators
        writer = csv.DictWriter(response, fieldnames=header)
        writer.writeheader()

        # Content
        all_files: QuerySet[Spectrogram] = campaign.get_sorted_files().select_related(
            "dataset"
        )
        finished_tasks: QuerySet[AnnotationTask] = phase.annotation_tasks.filter(
            status=AnnotationTask.Status.FINISHED,
        )

        def map_annotators(user: str) -> [str, Case]:
            task_sub = finished_tasks.filter(
                spectrogram_id=OuterRef("pk"), annotator__username=user
            )
            range_sub = file_ranges.filter(
                from_datetime__gte=OuterRef("start"),
                to_datetime__lte=OuterRef("end"),
                annotator__username=user,
            )
            query = Case(
                When(Exists(Subquery(task_sub)), then=models.Value("FINISHED")),
                When(Exists(Subquery(range_sub)), then=models.Value("CREATED")),
                default=models.Value("UNASSIGNED"),
                output_field=models.CharField(),
            )
            return [user, query]

        data = dict(map(map_annotators, annotators))

        writer.writerows(
            list(
                all_files.values("analysis__dataset__name", "filename", "pk")
                .annotate(dataset=F("analysis__dataset__name"), **data)
                .values(*header)
            )
        )
        return response
