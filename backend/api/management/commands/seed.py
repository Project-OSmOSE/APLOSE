from datetime import datetime, timedelta
from random import randint, choice

from django.contrib.auth.hashers import make_password
from django.core import management
from django.utils import timezone
from django.utils.dateparse import parse_datetime
from faker import Faker
from metadatax.data.models import FileFormat

from backend.api.models import (
    FFT,
    Colormap,
    LegacySpectrogramConfiguration,
    Dataset,
    Spectrogram,
    SpectrogramAnalysis,
    LabelSet,
    ConfidenceSet,
    Confidence,
    ConfidenceIndicatorSetIndicator,
    AnnotationCampaign,
    AnnotationPhase,
    Archive,
    AnnotationFileRange,
    AnnotationTask,
    AnnotationComment,
    Annotation,
)
from backend.api.models.annotation.annotation_campaign import AnnotationCampaignAnalysis
from backend.api.models.data.scales import get_frequency_scales
from backend.api.schema.enums import AnnotationType
from backend.aplose.models import AploseUser
from backend.aplose.models.user import ExpertiseLevel, User
from backend.osmosewebsite.management.commands.seed import Command as WebsiteCommand


class Command(management.BaseCommand):
    help = "Seeds the DB with fake data (deletes all existing data first)"
    fake = Faker()

    data_nb = 5
    files_nb = 100

    admin: User
    legacy_fft: FFT
    wav_format: FileFormat

    dataset_names = [
        "Test Dataset",
        "Test archived",
        "porp_delph",
        "dual_lf_hf",
        "audible",
    ]
    datasets_colormap = {
        "Test Dataset": "Greys",  # +3 viridis added manually below
        "Test archived": "Greys",
        "porp_delph": "viridis",
        "dual_lf_hf": "Greys",
        "audible": "yiorrd",
    }

    def add_arguments(self, parser):
        parser.add_argument(
            "--data-nb",
            type=int,
            default=5,
            help="Give the amount of dataset/campaigns to create, useful to test request optimisations",
        )
        parser.add_argument(
            "--files-nb",
            type=int,
            default=100,
            help="Give the amount of files in dataset to create, useful to test request optimisations",
        )

    def handle(self, *args, **options):
        self.data_nb = options["data_nb"] or self.data_nb
        self.files_nb = options["files_nb"] or self.files_nb
        for _ in range(max(0, self.data_nb - 5)):
            self.dataset_names.append(self.fake.unique.city())

        # Cleanup
        print("# Cleanup")
        management.call_command("flush", verbosity=0, interactive=False)

        # Creation
        print("# Creation")
        self._create_users()
        self._create_metadata()
        self._create_datasets()
        self._create_label_sets()
        self._create_confidence_sets()
        self._create_annotation_campaigns()
        self._create_annotations()
        self._create_comments()
        WebsiteCommand().handle(*args, **options)

    def _create_users(self):
        print(" ###### _create_users ######")
        password = "osmose29"
        self.admin = AploseUser.objects.create(
            user=User.objects.create_user(
                "admin", "admin@osmose.xyz", password, is_superuser=True, is_staff=True
            ),
            expertise_level=ExpertiseLevel.EXPERT,
        ).user
        # WARNING : names like TestUserX are used for Cypress tests, do not change or remove
        users = [
            AploseUser(
                user=User.objects.create(
                    username="TestUser1",
                    email="TestUser1@osmose.xyz",
                    password=make_password(password),
                    first_name="User1",
                    last_name="Test",
                ),
                expertise_level=ExpertiseLevel.EXPERT,
            ),
            AploseUser(
                user=User.objects.create(
                    username="TestUser2",
                    email="TestUser2@osmose.xyz",
                    password=make_password(password),
                    first_name="User2",
                    last_name="Test",
                ),
                expertise_level=ExpertiseLevel.NOVICE,
            ),
            AploseUser(
                user=User.objects.create(
                    username="TestUser3",
                    email="TestUser3@osmose.xyz",
                    password=make_password(password),
                    first_name="User3",
                    last_name="Test",
                    is_superuser=True,
                    is_staff=True,
                ),
                expertise_level=ExpertiseLevel.NOVICE,
            ),
        ]
        names = [self.fake.unique.first_name() for _ in range(40)]
        for name in names:
            users.append(
                AploseUser(
                    user=User.objects.create(
                        username=name,
                        email=f"{name}@osmose.xyz",
                        password=make_password(password),
                        first_name=name,
                        last_name=self.fake.last_name(),
                    ),
                    expertise_level=ExpertiseLevel.NOVICE,
                ),
            )
        AploseUser.objects.bulk_create(users)

    def _create_metadata(self):
        print(" ###### _create_fft ######")
        self.legacy_fft = FFT.objects.create(
            legacy=True,
            nfft=4096,
            window_size=4096,
            overlap=0.90,
            sampling_frequency=327680,
        )
        self.wav_format = FileFormat.objects.create(name="wav")

    def __get_analysis(
        self, dataset: Dataset
    ) -> ([SpectrogramAnalysis], [LegacySpectrogramConfiguration]):
        analysis = [
            SpectrogramAnalysis(
                # AbstractDataset
                name="4096_4096_90",
                path="processed/spectrogram/4096_4096_90",
                owner=self.admin,
                legacy=True,
                # AbstractAnalysis
                start=timezone.make_aware(datetime.strptime("2010-08-19", "%Y-%m-%d")),
                end=timezone.make_aware(datetime.strptime("2010-11-02", "%Y-%m-%d")),
                dataset=dataset,
                # SpectrogramAnalysis
                data_duration=10,
                fft=self.legacy_fft,
                colormap=Colormap.objects.get_or_create(
                    name=self.datasets_colormap[dataset.name]
                    if dataset.name in self.datasets_colormap
                    else "Greys"
                )[0],
                dynamic_min=0,
                dynamic_max=0,
            )
        ]
        linear_scale, multi_linear_scale = get_frequency_scales(
            name=dataset.name, sample_rate=self.legacy_fft.sampling_frequency
        )
        legacy_configurations = [
            LegacySpectrogramConfiguration(
                spectrogram_analysis=analysis[0],
                folder="4096_4096_90",
                zoom_level=3,
                spectrogram_normalization="density",
                data_normalization="0",
                zscore_duration="0",
                hp_filter_min_frequency=0,
                window_type="Hamming",
                frequency_resolution=0,
                linear_frequency_scale=linear_scale,
                multi_linear_frequency_scale=multi_linear_scale,
            )
        ]

        if dataset.name == "Test Dataset":
            for scale in ["porp_delph", "dual_lf_hf", "audible"]:
                linear_scale, multi_linear_scale = get_frequency_scales(
                    name=scale, sample_rate=self.legacy_fft.sampling_frequency
                )
                a = SpectrogramAnalysis(
                    # AbstractDataset
                    name=f"4096_4096_90_{scale}",
                    path=f"processed/spectrogram/4096_4096_90_{scale}",
                    owner=self.admin,
                    legacy=True,
                    # AbstractAnalysis
                    start=timezone.make_aware(
                        datetime.strptime("2010-08-19", "%Y-%m-%d")
                    ),
                    end=timezone.make_aware(
                        datetime.strptime("2010-11-02", "%Y-%m-%d")
                    ),
                    dataset=dataset,
                    # SpectrogramAnalysis
                    data_duration=10,
                    fft=self.legacy_fft,
                    colormap=Colormap.objects.get_or_create(name="viridis")[0],
                    dynamic_min=0,
                    dynamic_max=0,
                )
                analysis.append(a)
                legacy_configurations.append(
                    LegacySpectrogramConfiguration(
                        spectrogram_analysis=a,
                        folder=f"4096_4096_90_{scale}",
                        zoom_level=3,
                        spectrogram_normalization="density",
                        data_normalization="0",
                        zscore_duration="0",
                        hp_filter_min_frequency=0,
                        window_type="Hamming",
                        frequency_resolution=0,
                        linear_frequency_scale=linear_scale,
                        multi_linear_frequency_scale=multi_linear_scale,
                    )
                )
        return analysis, legacy_configurations

    def __get_spectrograms(
        self, analysis: [SpectrogramAnalysis]
    ) -> ([Spectrogram], [Spectrogram.analysis.through]):
        spectrograms = []
        rels = []
        for k in range(1, self.files_nb):
            start = parse_datetime("2012-10-03T12:00:00+0200")
            end = start + timedelta(minutes=15)
            for a in analysis:
                s = Spectrogram(
                    # AbstractFile
                    filename="50h_0",
                    format=self.wav_format,
                    # TimeSegment
                    start=(start + timedelta(hours=k)),
                    end=(end + timedelta(hours=k)),
                    # Spectrogram
                )
                spectrograms.append(s)
                rels.append(
                    Spectrogram.analysis.through(
                        spectrogram=s,
                        spectrogramanalysis=a,
                    )
                )
        return spectrograms, rels

    def _create_datasets(self):
        print(" ###### _create_datasets ######")
        datasets = []
        spectrograms = []
        spectrogram_rels = []
        analysis = []
        legacy_configurations = []
        for name in self.dataset_names:

            # Create dataset
            dataset = Dataset(
                # Abstract Dataset
                name=name,
                path="seed/dataset_path",
                owner=self.admin,
                legacy=True,
            )
            datasets.append(dataset)

            # Create analysis
            dataset_analysis, dataset_legacy_conf = self.__get_analysis(dataset)
            analysis += dataset_analysis
            legacy_configurations += dataset_legacy_conf

            # Create spectrograms
            s, rel = self.__get_spectrograms(dataset_analysis)
            spectrograms += s
            spectrogram_rels += rel

        Dataset.objects.bulk_create(datasets)
        SpectrogramAnalysis.objects.bulk_create(analysis)
        LegacySpectrogramConfiguration.objects.bulk_create(legacy_configurations)
        Spectrogram.objects.bulk_create(spectrograms)
        Spectrogram.analysis.through.objects.bulk_create(spectrogram_rels)

    def _create_label_sets(self):
        print(" ###### _create_label_set ######")

        l = LabelSet.objects.create(
            name="Test SPM campaign",
            description="Label set made for Test SPM campaign",
        )
        for label in ["Mysticetes", "Odoncetes", "Boat", "Rain", "Other"]:
            l.labels.get_or_create(name=label)

        l = LabelSet.objects.create(
            name="Test DCLDE LF campaign",
            description="Test label set DCLDE LF 2015",
        )
        for label in ["Dcall", "40-Hz"]:
            l.labels.get_or_create(name=label)

        l = LabelSet.objects.create(
            name="Big label set",
            description="Test label set with lots of labels",
        )
        for _ in range(0, 20):
            l.labels.get_or_create(name=self.fake.color_name())

    def _create_confidence_sets(self):
        cs = ConfidenceSet.objects.create(
            name="Confident/NotConfident",
            desc=self.fake.paragraph(nb_sentences=5),
        )

        confidence_0 = Confidence.objects.create(label="not confident", level=0)
        ConfidenceIndicatorSetIndicator.objects.create(
            confidence=confidence_0,
            confidence_set=cs,
        )
        confidence_1 = Confidence.objects.create(label="confident", level=1)
        ConfidenceIndicatorSetIndicator.objects.create(
            confidence=confidence_1,
            confidence_set=cs,
            is_default=True,
        )

    def _create_annotation_campaigns(self):
        print(" ###### _create_annotation_campaigns ######")
        campaigns = []
        campaign_analysis_rels = []
        phases = []
        archives = []
        file_ranges = []

        dataset: Dataset
        for dataset in Dataset.objects.all():
            spectrograms = Spectrogram.objects.filter(analysis__dataset=dataset)

            # Create campaign
            c = AnnotationCampaign(
                name=f"{dataset.name} campaign",
                description=self.fake.sentence(),
                instructions_url=self.fake.uri(),
                deadline=timezone.make_aware(
                    datetime.strptime("2010-11-02", "%Y-%m-%d")
                ),
                label_set=LabelSet.objects.first(),
                confidence_set=ConfidenceSet.objects.first(),
                owner=self.admin,
                dataset=dataset,
            )

            # Create phase
            p = AnnotationPhase(
                annotation_campaign=c,
                phase=AnnotationPhase.Type.ANNOTATION,
                created_by=self.admin,
            )
            phases.append(p)

            # Create archive
            if dataset.name == "Test archived":
                c.archive = Archive(by_user=self.admin)
                archives.append(c.archive)

            # Add analysis
            for analysis in dataset.spectrogram_analysis.all():
                campaign_analysis_rels.append(
                    AnnotationCampaignAnalysis(annotation_campaign=c, analysis=analysis)
                )

            # Add file ranges
            file_ranges = []
            for user in User.objects.all():
                if user.username in ["TestUser2", "TestUser3"]:
                    continue
                last_index = spectrograms.count() - 1
                file_ranges.append(
                    AnnotationFileRange(
                        annotation_phase=p,
                        annotator_id=user.id,
                        first_file_index=0,
                        from_datetime=spectrograms.all()[0].start,
                        last_file_index=last_index,
                        to_datetime=spectrograms.all()[last_index - 1].end,
                        files_count=spectrograms.count(),
                    )
                )

            campaigns.append(c)

        Archive.objects.bulk_create(archives)
        AnnotationCampaign.objects.bulk_create(campaigns)
        AnnotationPhase.objects.bulk_create(phases)
        AnnotationCampaignAnalysis.objects.bulk_create(campaign_analysis_rels)
        AnnotationFileRange.objects.bulk_create(file_ranges)

    def _create_annotations(self):
        print(" ###### _create_annotations ######")
        phase: AnnotationPhase = AnnotationPhase.objects.first()
        labels = phase.annotation_campaign.label_set.labels
        confidences = phase.annotation_campaign.confidence_set.confidence_indicators

        tasks = []
        comments = []
        annotations = []

        file_range: AnnotationFileRange
        for file_range in phase.annotation_file_ranges.all():
            done_files = Spectrogram.objects.filter_for_file_range(file_range)[
                : randint(5, max(self.files_nb - 5, 5))
            ]
            for file in done_files:
                task = AnnotationTask(
                    spectrogram=file,
                    annotator=file_range.annotator,
                    status=AnnotationTask.Status.FINISHED,
                    annotation_phase=phase,
                )
                if randint(1, 3) >= 2:
                    comments.append(
                        AnnotationComment(
                            comment="a comment",
                            annotation_phase=phase,
                            spectrogram=task.spectrogram,
                            author_id=task.annotator_id,
                            annotation=None,
                        )
                    )
                for _ in range(randint(1, 5)):
                    start_time = randint(0, 600)
                    start_frequency = randint(0, 10000)
                    annotations.append(
                        Annotation(
                            start_time=start_time,
                            end_time=start_time + randint(30, 300),
                            start_frequency=start_frequency,
                            end_frequency=start_frequency + randint(2000, 5000),
                            label=choice(labels),
                            confidence=choice(confidences),
                            spectrogram=task.spectrogram,
                            annotator=task.annotator,
                            annotation_phase=phase,
                        )
                    )

                tasks.append(task)

        AnnotationTask.objects.bulk_create(tasks)
        Annotation.objects.bulk_create(annotations)
        AnnotationComment.objects.bulk_create(comments)

    def _create_comments(self):
        print(" ###### _create_comments ######")
        annotations = Annotation.objects.all()

        comments = []
        for a in annotations:
            if randint(1, 3) >= 2:
                comments.append(
                    AnnotationComment(
                        comment=f"a comment : {a.label.name}",
                        annotation_phase=a.annotation_phase,
                        spectrogram=a.spectrogram,
                        author_id=a.annotator_id,
                        annotation=a,
                    )
                )
        AnnotationComment.objects.bulk_create(comments)
