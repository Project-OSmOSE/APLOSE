import graphene

from ..acoustic_features.features_input import AcousticFeaturesInput


class AnnotationInput(graphene.InputObjectType):

    id = graphene.ID()
    start_time = graphene.Float()
    end_time = graphene.Float()
    start_frequency = graphene.Float()
    end_frequency = graphene.Float()

    label_name = graphene.String(required=True)
    confidence_id = graphene.ID()

    is_update_of_id = graphene.ID()

    acoustic_features = AcousticFeaturesInput()

    annotation_phase_id = graphene.ID(required=True)
    annotator_id = graphene.ID()
    analysis_id = graphene.ID(required=True)
