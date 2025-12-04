# Ajouter une phase d'"Annotation"

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


Pour créer une phase « Annotation », cliquez sur l'onglet « Annotation ».

![](/annotation-campaign/add-annotation-phase.png)

Vous devrez renseigner l'ensemble de labels (Label set) et un ensemble de niveaux de confiance (Confidence indicator
set). Vous pourrez également spécifier si l'annotation de type "Point" est autorisée.

::: details Créer un ensemble de labels

Accédez à la partie administration de APLOSE en cliquant sur le lien "Admin".

Cherchez "Label sets" dans le bloc "API" et cliquez sur "Add".

![](/annotation-campaign/label-set/nav.png)

Vous pouvez remplir le formulaire avec le nom de votre ensemble (Name), le propriétaire (owner), et sélectionner les
labels dont vous avez besoin pour vos campagnes d'annotation.
Si vous ne trouvez pas les labels souhaités, vous pouvez cliquer sur le bouton « + » près de la liste des labels pour en
créer un nouveau.

![](/annotation-campaign/label-set/form.png)

Lorsque votre formulaire est rempli, vous pouvez le sauvegarder (save).
:::

::: details Créer un ensemble de confiance

Accédez à la partie administration de APLOSE en cliquant sur le lien "Admin".

Cherchez "Confidence indicator set" dans le bloc "API" et cliquez sur "Add".

![](/annotation-campaign/confidence-set/nav-set.png)

Vous pouvez remplir le formulaire avec le nom de votre set (name) et le sauvegarder (save).

![](/annotation-campaign/confidence-set/form-set.png)

Vous pouvez ensuite rechercher les "Confidence indicators" dans le bloc "API" et "Add" pour ajouter autant d'indicateurs
de confiance que nécessaire.

![](/annotation-campaign/confidence-set/nav-indicator.png)

Pour chaque indicateur, vous devez renseigner le nom (label), le niveau (level) et l'ensemble associé (included in this
set) que vous venez de créer.
Vous pouvez définir un indicateur comme indicateur par défaut pour votre ensemble en cochant la case "is default".

![](/annotation-campaign/confidence-set/form-indicator.png)

:::
