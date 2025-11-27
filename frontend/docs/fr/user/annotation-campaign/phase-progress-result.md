# Progression et résultats

::: details Terminologie

**Campagne d'annotation - Annotation Campaign**

<!--@include: ../terminology/campaign.md-->

**Phase d'annotation - Annotation Phase**

<!--@include: ../terminology/phase.md-->

**Annotateur**

<!--@include: ../terminology/annotator.md-->

**Annotation**

<!--@include: ../terminology/annotation.md-->

**Label**

<!--@include: ../terminology/label.md-->

**Confiance - Confidence**

<!--@include: ../terminology/confidence.md-->

**Paramètres acoustiques - Acoustic features**

<!--@include: ../terminology/acoustic_features.md-->

:::

À partir des [détails de la phase](phase-detail), vous pouvez accéder à sa progression via le bouton :
![](/annotation-campaign/button-progression.png)

![](/campaign-creator/annotator-progression.png)

À partir de là, vous pouvez télécharger les fichiers CSV contenant les résultats et le statut.

### Résultats

Tableau contenant toutes les annotations et tous les commentaires laissés par les annotateurs de la campagne.

| Colonne                               |                   Type                    | Description                                                                                               |
|---------------------------------------|:-----------------------------------------:|-----------------------------------------------------------------------------------------------------------|
| dataset                               |                  string                   | Nom du dataset.                                                                                           |
| analysis                              |                  string                   | Nom de l'analyse.                                                                                         |
| filename                              |                  string                   | Nom du fichier.                                                                                           |
| annotation_id                         |                    int                    | ID de l'annotation                                                                                        |
| is_update_of_id                       |                    int                    | Si cette annotation est une mise à jour/correction d'une autre, il s'agit de l'ID de l'annotation de base |
| start_time                            |                   float                   | Début relatif de l'annotation                                                                             |
| end_time                              |                   float                   | Fin relative de l'annotation                                                                              |
| ~~start_frequency~~<br/>min_frequency |                    int                    | Fréquence minimum de l'annotation                                                                         |
| ~~end_frequency~~<br/>max_frequency   |                    int                    | Fréquence maximum de l'annotation                                                                         |
| annotation                            |                  string                   | Label de l'annotation                                                                                     |
| annotator                             |                  string                   | Auteur de l'annotation ou du commentaire                                                                  |
| annotator_expertise                   |         NOVICE / AVERAGE / EXPERT         | Niveau d'expertise de l'annotateur au moment où l'annotation a été effectuée                              |
| start_datetime                        |                 timestamp                 | Début absolu de l'annotation                                                                              |
| end_datetime                          |                 timestamp                 | Fin absolue de l'annotation                                                                               |
| ~~is_box~~                            |                ~~boolean~~                | ~~L'annotation est soit une boîte, soit une annotation faible~~                                           |
| type                                  |            WEAK / POINT / BOX             | Type d'annotation                                                                                         |
| confidence_indicator_label            |                  string                   | Nom du niveau de confiance (le cas échéant)                                                               |
| confidence_indicator_level            |          string<br/>[int]/[int]           | Niveau de confiance par rapport au niveau maximal disponible (le cas échéant)                             |
| comments                              |                  string                   | Commentaire laissé par l'annotateur.                                                                      |
| signal_quality                        |                GOOD / BAD                 | Si le signal est suffisamment qualitatif pour préciser ses caractéristiques                               |
| signal_start_frequency                |                    int                    | Fréquence au début du signal (en Hz)                                                                      |
| signal_end_frequency                  |                    int                    | Fréquence à la fin du signal (en Hz)                                                                      |
| signal_relative_max_frequency_count   |                    int                    | Nombre de maxima relatifs                                                                                 |
| signal_relative_min_frequency_count   |                    int                    | Nombre de minima relatifs                                                                                 |
| signal_steps_count                    |                    int                    | Nombre d'étapes dans le signal                                                                            |
| signal_has_harmonics                  |                  boolean                  | Si le signal contient des harmoniques                                                                     |
| signal_trend                          | FLAT / ASCENDING / DESCENDING / MODULATED | Tendance générale du signal                                                                               |
| created_at_phase                      |         ANNOTATION / VERIFICATION         | Phase sur laquelle l'annotation a été créée                                                               |

### Status

Tableau indiquant le statut de soumission de tous les fichiers et de tous les annotateurs.

| Colonne       |                  Type                  | Description                                                         |
|---------------|:--------------------------------------:|---------------------------------------------------------------------|
| dataset       |                 string                 | Nom du dataset.                                                     |
| filename      |                 string                 | Nom du fichier.                                                     |
| [Annotateurs] | UNASSIGNED <br/>CREATED <br/> FINISHED | État de soumission de l'annotateur (colonne) sur le fichier (ligne) |
