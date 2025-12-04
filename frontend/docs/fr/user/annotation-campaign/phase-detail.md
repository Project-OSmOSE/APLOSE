# Détail d'une phase

::: details Terminologie

**Campagne d'annotation - Annotation Campaign**

<!--@include: ../terminology/campaign.md-->

**Phase d'annotation - Annotation Phase**

<!--@include: ../terminology/phase.md-->

**Label**

<!--@include: ../terminology/label.md-->

**Confiance - Confidence**

<!--@include: ../terminology/confidence.md-->

:::

Une fois que vous êtes sur la page [détails de la campagne](detail), vous pouvez sélectionner l'onglet de la phase à
laquelle vous souhaitez accéder.

![](/annotation-campaign/phase-detail.png)

La page affiche les fichiers ue dataset qui vous ont été attribués pour annotation. Vous pouvez rechercher un fichier
spécifique ou afficher uniquement les fichiers non soumis ou uniquement les fichiers avec annotations.
Vous pouvez également reprendre l'annotation, ce qui vous mènera au premier fichier non soumis.

Le tableau des fichiers contient les colonnes suivantes :

| Colonne               |    Phase     | Description                                                                |
|:----------------------|:------------:|:---------------------------------------------------------------------------|
| Filename              |    _all_     | Nom du fichier                                                             |
| Date                  |    _all_     | Début de l'enregistrement                                                  |
| Duration              |    _all_     | Durée de l'enregistrement                                                  |
| Annotations           |  Annotation  | Nombre d'annotations que vous avez créées                                  |
| Annotations to check  | Vérification | Nombre d'annotations de la phase « Annotation » qui doivent être vérifiées |
| Validated annotations | Vérification | Nombre d'annotations que vous avez validées                                |
| Statut                |    _all_     | Vous avez soumis votre travail sur le fichier                              |
| Access                |    _all_     | Lien direct pour accéder à l'[annotateur](/fr/user/annotation/overview)    |

## Filtrer les fichiers

En cliquant sur l'icône en forme d'entonnoir dans l'en-tête du tableau des fichiers, vous pouvez filtrer les fichiers.

![](/annotation-campaign/funnel.png)

#### Date filters

![](/annotation-campaign/date-filters.png)

#### Annotation filters

![](/annotation-campaign/annotations-filters.png)

#### Status filters

![](/annotation-campaign/status-filters.png)
