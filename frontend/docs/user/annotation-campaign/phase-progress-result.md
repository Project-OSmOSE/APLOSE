# Annotation phase progress and results

::: details Terminology

**Annotation Phase**

<!--@include: ../terminology/phase.md-->

**Annotation Campaign**

<!--@include: ../terminology/campaign.md-->

**Annotator**

<!--@include: ../terminology/annotator.md-->

**Annotation**

<!--@include: ../terminology/annotation.md-->

**Label**

<!--@include: ../terminology/label.md-->

**Confidence**

<!--@include: ../terminology/confidence.md-->

**Acoustic features**

<!--@include: ../terminology/acoustic_features.md-->

:::

From the [phase detail](phase-detail), you can access its progression through the button:
![](/annotation-campaign/button-progression.png)

![](/campaign-creator/annotator-progression.png)

From here, you can then download the results and status CSV files.

### Results

A table containing all annotations and comments left by the campaign annotators.

| Column                                |                   Type                    | Description                                                                                            |
|---------------------------------------|:-----------------------------------------:|--------------------------------------------------------------------------------------------------------|
| dataset                               |                  string                   | Name of the dataset.                                                                                   |
| analysis                              |                  string                   | Name of the analysis.                                                                                  |
| filename                              |                  string                   | Name of the file.                                                                                      |
| annotation_id                         |                    int                    | ID of the annotation                                                                                   |
| is_update_of_id                       |                    int                    | In the case this annotation is an update/correction of an other, this is the ID of the base annotation |
| start_time                            |                   float                   | Relative start of the annotation                                                                       |
| end_time                              |                   float                   | Relative end of the annotation                                                                         |
| ~~start_frequency~~<br/>min_frequency |                    int                    | Lower frequency of the annotation                                                                      |
| ~~end_frequency~~<br/>max_frequency   |                    int                    | Higher frequency of the annotation                                                                     |
| annotation                            |                  string                   | Label of the annotation                                                                                |
| annotator                             |                  string                   | Author of the annotation or comment                                                                    |
| annotator_expertise                   |         NOVICE / AVERAGE / EXPERT         | Expertise level of the annotator at the time the annotation was made                                   |
| start_datetime                        |                 timestamp                 | Absolute start of the annotation                                                                       |
| end_datetime                          |                 timestamp                 | Absolute end of the annotation                                                                         |
| ~~is_box~~                            |                ~~boolean~~                | ~~Either the annotation is a box or a weak annotation~~                                                |
| type                                  |            WEAK / POINT / BOX             | Type of the annotation                                                                                 |
| confidence_indicator_label            |                  string                   | The name of the level of confidence (if exists)                                                        |
| confidence_indicator_level            |          string<br/>[int]/[int]           | The level of confidence on the maximum level available (if exists)                                     |
| comments                              |                  string                   | Comment left by the annotator.                                                                         |
| created_at_phase                      |         ANNOTATION / VERIFICATION         | Phase on which the annotation was created                                                              |
| signal_quantity                       |             SINGLE / MULTIPLE             | The amount of signals in the box. If multiple, none of the following are filled                        |
| signal_is_intensity_too_low           |                  boolean                  | If the signal intensity is too low to correctly fill the features                                      |
| signal_does_overlap_other_signals     |                  boolean                  | If the signal overlaps other signals                                                                   |
| signal_start_frequency                |                    int                    | Frequency at start of signal (in Hz)                                                                   |
| signal_end_frequency                  |                    int                    | Frequency at the end of the signal (in Hz))                                                            |
| signal_relative_min_frequency_count   |                    int                    | Number of relative minimums                                                                            |
| signal_relative_max_frequency_count   |                    int                    | Number of relative maxima                                                                              |
| signal_steps_count                    |                    int                    | Number of steps in the signal                                                                          |
| signal_has_harmonics                  |                  boolean                  | If the signal contains harmonics                                                                       |
| signal_trend                          | FLAT / ASCENDING / DESCENDING / MODULATED | General trend of the signal                                                                            |
| signal_sidebands                      |                  boolean                  | If the signal has sidebands                                                                            |
| signal_subharmonics                   |                  boolean                  | If the signal has subharmonics                                                                         |
| signal_frequency_jumps                |               boolean / int               | If the signal has frequency jumps, if it does it can contain the jump counts                           |
| signal_deterministic_chaos            |                  boolean                  | If the signal has deterministic chaos                                                                  |

### Status

A table indicating the submission status for all files and by all annotators.

| Column       |                  Type                  | Description                                                      |
|--------------|:--------------------------------------:|------------------------------------------------------------------|
| dataset      |                 string                 | Name of the dataset.                                             |
| filename     |                 string                 | Name of the file.                                                |
| [Annotators] | UNASSIGNED <br/>CREATED <br/> FINISHED | State of submission of the annotator (column) on the file (line) |
