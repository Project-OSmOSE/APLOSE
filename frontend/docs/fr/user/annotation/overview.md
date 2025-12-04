# Présentation

::: details Terminologie

**Tâches d'annotation - Annotation Task**

<!--@include: ../terminology/task.md-->

**Analyse**

<!--@include: ../terminology/analysis.md-->

:::

Pour annoter un fichier, vous devez accéder à une campagne, puis cliquer sur un lien d'accès au fichier ou sur le bouton Reprendre :
![](/annotation-campaign/button-resume.png)

![](/annotator/full_page.png)

Cette page permet d'annoter des enregistrements audio grâce à leur spectrogramme.

### Visualisation des spectrogrammes

Le spectrogramme est présenté avec des axes de temps et fréquence.

Un sélecteur situé au-dessus du spectrogramme vous permet de choisir parmi les paramètres FFT disponibles pour votre
spectrogramme. Vous pouvez également utiliser différentes échelles de fréquence.

![](/annotator/spectro-config.png)

::: details Available frequency scales

| Scale      | Description                                                                                                                     |
|------------|---------------------------------------------------------------------------------------------------------------------------------|
| linear     | Linear scale from 0 to sample rate / 2                                                                                          |
| audible    | Linear scale from 0 to 22kHz                                                                                                    |
| porp_delph | Multi-linear scale:<ul><li>0-50%: 0 to 30kHz</li><li>50-70%: 30kHz to 80kHz</li><li>70-100%: 80kHz to sample rate / 2</li></ul> |
| dual_lf_hf | Multi-linear scale:<ul><li>0-50%: 0 to 22kHz</li><li>50-100%: 22kHz to sample rate / 2</li></ul>                                |
:::


### Zoomer dans le spectrogramme

Une fonction de zoom est disponible, sur le temps uniquement. Vous pouvez zoomer à l'aide des boutons de zoom situés à
côté du sélecteur de configuration de spectrogramme ou à l'aide de la molette de la souris sur le spectrogramme.

![](/annotator/zoom.png)

Le zoom est discret : chaque niveau de zoom offre un spectrogramme pré-calculé, ce qui signifie que les niveaux de zoom
sont décidés par le créateur du jeu de donnée.

### Écouter le fichier audio

Vous pouvez écouter l'enregistrement grâce au bouton play/pause situé sous le spectrogramme (à gauche). Vous pouvez
définir la position temporelle à partir de laquelle vous souhaitez commencer l'écoute en cliquant sur le spectrogramme.

![](/annotator/audio.png)
::: tip Raccourci :keyboard:
La touche “espace” de votre clavier est un raccourci pour lire et mettre en pause le fichier audio
:::

À côté du bouton play/pause, vous pouvez choisir la vitesse de lecture (de 0,25x à 4x). Cela vous permet
d'entendre les hautes fréquences en ralentissant la lecture, ou les basses fréquences en l'accélérant.

::: tip Recommendation :bulb:
Utilisez un casque ou des écouteurs pour une meilleure qualité !
:::
::: warning Attention
Les fichiers ayant un taux d'échantillonnage très élevé peuvent ne pas être compatibles avec votre navigateur.
La limite de compatibilité dépend du navigateur.
Firefox a tendance à avoir la plus large compatibilité.
:::
