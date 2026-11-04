# Add an "Annotation" phase

::: details Terminology

**Annotation Phase**

<!--@include: ../terminology/phase.md-->

**Annotation Campaign**

<!--@include: ../terminology/campaign.md-->

**Ontology**

<!--@include: ../terminology/ontology.md-->

**Confidence**

<!--@include: ../terminology/confidence.md-->


:::


To create an "Annotation" phase, click on the "Annotation" tab.

(/annotation-campaign/add-annotation-phase.png)

You will need to fill in the labels. 
You can also define a Confidence set and specify whether the "Point" annotation is authorised.

::: details Create a confidence set
Access APLOSEs administration part with the "Admin" link

Look for “Confidence indicator sets” in the “API” block and click on “Add”

![](/annotation-campaign/confidence-set/nav-set.png)

You can fill in the form with the name of your set and save it.

![](/annotation-campaign/confidence-set/form-set.png)

You can then look for the “Confidence indicators” in the “API” block and “Add” as many indicators as you need.

![](/annotation-campaign/confidence-set/nav-indicator.png)

For each indicator you must fill the label, the level and the associated set that you have just created.
You can define an indicator as the default one for your set by checking the “is default” checkbox.

![](/annotation-campaign/confidence-set/form-indicator.png)

:::
