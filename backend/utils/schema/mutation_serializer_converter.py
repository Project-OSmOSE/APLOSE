from collections import OrderedDict

import graphene
from django_extension.serializers import EnumField
from graphene_django.registry import get_global_registry
from graphene_django.rest_framework.serializer_converter import (
    get_graphene_type_from_serializer_field,
)
from rest_framework import serializers

from backend.api.models import (
    AcousticFeatures,
    AnnotationPhase,
    AnnotationTask,
    Annotation,
)
from backend.api.schema.enums import AnnotationType
from backend.api.schema.enums import (
    SignalTrendType,
    AnnotationPhaseType,
    AnnotationTaskStatus,
)


def convert_serializer_field(
    field, is_input=True, convert_choices_to_enum=True, force_optional=False
):
    """
    Converts a django rest frameworks field to a graphql field
    and marks the field as required if we are creating an input type
    and the field itself is required
    """

    if isinstance(field, serializers.ChoiceField) and not convert_choices_to_enum:
        graphql_type = graphene.String
    elif isinstance(field, EnumField) and field.enum == AcousticFeatures.SignalTrend:
        graphql_type = SignalTrendType
    elif isinstance(field, EnumField) and field.enum == AnnotationPhase.Type:
        graphql_type = AnnotationPhaseType
    elif isinstance(field, EnumField) and field.enum == AnnotationTask.Status:
        graphql_type = AnnotationTaskStatus
    elif isinstance(field, EnumField) and field.enum == Annotation.Type:
        graphql_type = AnnotationType
    else:
        graphql_type = get_graphene_type_from_serializer_field(field)

    args = []
    kwargs = {
        "description": field.help_text,
        "required": is_input and field.required and not force_optional,
    }

    # if it is a tuple or a list it means that we are returning
    # the graphql type and the child type
    if isinstance(graphql_type, (list, tuple)):
        kwargs["of_type"] = graphql_type[1]
        graphql_type = graphql_type[0]

    if isinstance(field, serializers.ModelSerializer):
        if is_input:
            graphql_type = convert_serializer_to_input_type(field.__class__)
        else:
            global_registry = get_global_registry()
            field_model = field.Meta.model
            args = [global_registry.get_type_for_model(field_model)]
    elif isinstance(field, serializers.ListSerializer):
        field = field.child
        if is_input:
            kwargs["of_type"] = convert_serializer_to_input_type(field.__class__)
        else:
            del kwargs["of_type"]
            global_registry = get_global_registry()
            field_model = field.Meta.model
            args = [global_registry.get_type_for_model(field_model)]

    return graphql_type(*args, **kwargs)


def convert_serializer_to_input_type(serializer_class):
    cached_type = convert_serializer_to_input_type.cache.get(
        serializer_class.__name__, None
    )
    if cached_type:
        return cached_type
    serializer = serializer_class()

    items = {
        name: convert_serializer_field(field)
        for name, field in serializer.fields.items()
    }
    ret_type = type(
        f"{serializer.__class__.__name__}Input",
        (graphene.InputObjectType,),
        items,
    )
    convert_serializer_to_input_type.cache[serializer_class.__name__] = ret_type
    return ret_type


convert_serializer_to_input_type.cache = {}


def fields_for_serializer(
    serializer,
    only_fields,
    exclude_fields,
    is_input=False,
    convert_choices_to_enum=True,
    lookup_field=None,
    optional_fields=(),
):
    fields = OrderedDict()
    for name, field in serializer.fields.items():
        is_not_in_only = only_fields and name not in only_fields
        is_excluded = any(
            [
                name in exclude_fields,
                field.write_only
                and not is_input,  # don't show write_only fields in Query
                field.read_only
                and is_input
                and lookup_field != name,  # don't show read_only fields in Input
                isinstance(
                    field, serializers.HiddenField
                ),  # don't show hidden fields in Input
            ]
        )

        if is_not_in_only or is_excluded:
            continue
        is_optional = name in optional_fields or "__all__" in optional_fields

        fields[name] = convert_serializer_field(
            field,
            is_input=is_input,
            convert_choices_to_enum=convert_choices_to_enum,
            force_optional=is_optional,
        )
    return fields
