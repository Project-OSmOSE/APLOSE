# Import annotations

::: details Terminology

**Annotation**

<!--@include: ../terminology/annotation.md-->

**Annotation Campaign**

<!--@include: ../terminology/campaign.md-->

**Annotation Phase**

<!--@include: ../terminology/phase.md-->

:::

You may want to verify annotations from a automatic detector for exemple.

From an "Annotation" phase, you can import new annotations with the import button:

![](/annotation-campaign/button-import-annotations.png)

![](/annotation-campaign/import-annotations/form.png)

### Select an analysis

If your campaign has more than one analysis, you must select the analysis on which annotations were made.

### Upload a CSV file

You can either click on the "Import annotation" zone or drag a file in it. The file should be a csv with the following
columns:

| Column                     |          Type          | Description                                                                                                       |
|----------------------------|:----------------------:|-------------------------------------------------------------------------------------------------------------------|
| dataset                    |         string         | Name of the dataset. If it doesn't correspond to the campaign dataset, you will have the choice to keep it or not |
| start_datetime             |       timestamp        | Start of the annotation                                                                                           |
| end_datetime               |       timestamp        | End of the annotation                                                                                             |
| start_frequency            |          int           | Lower frequency of the annotation                                                                                 |
| end_frequency              |          int           | Higher frequency of the annotation                                                                                |
| annotation                 |         string         | Label of the annotation                                                                                           |
| annotator                  |         string         | Detector or annotator that created the annotation                                                                 |
| is_box                     |        boolean         | Either the annotation is a box or a weak annotation                                                               |
| confidence_indicator_label |         string         | The name of the level of confidence (if exists)                                                                   |
| confidence_indicator_level | string<br/>[int]/[int] | The level of confidence on the maximum level available (if exists)                                                |

In the case of weak annotations, start/end datetime and start/end frequency should be the ones of the file.

### Configure detectors

After submitting your file, you will need to configure the detectors as they will be saved in the database.

![](/annotation-campaign/import-annotations/detectors.png)

You will be asked to assign the CSV detectors to an existing one or to create a new one.
Here you can also select only the detectors you want to check, in case the file contains multiple ones.

You can then specify each detector configuration (existing or new one).

![](/annotation-campaign/import-annotations/detectors-configuration.png)

### Submit

When you're done you can click on "Import".
The upload will start. It will be split in chunks of 200 lines to easy large file import. You can follow the progression
and an estimated remaining time is given.

:::info
If you encounter an error, reset the import and load a corrected file.
The annotations won't be duplicated.
:::
