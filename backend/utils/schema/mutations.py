from typing import Optional

from django.db.models import QuerySet
import graphene
from graphene import InputField, ClientIDMutation, InputObjectType
from graphene.types.utils import yank_fields_from_attrs
from graphene_django.rest_framework.mutation import (
    SerializerMutationOptions,
)
from graphene_django.types import ErrorType

from backend.utils.schema import GraphQLResolve, GraphQLPermissions
from .mutation_serializer_converter import fields_for_serializer


class ListSerializerMutation(ClientIDMutation):
    class Meta:
        abstract = True

    errors = graphene.List(
        graphene.List(
            ErrorType, description="May contain more than one error for same field."
        )
    )

    @classmethod
    def __init_subclass_with_meta__(
        cls,
        lookup_field=None,
        serializer_class=None,
        model_class=None,
        model_operations=("create", "update"),
        only_fields=(),
        exclude_fields=(),
        convert_choices_to_enum=False,
        _meta=None,
        optional_fields=(),
        **options,
    ):
        if not serializer_class:
            raise Exception("serializer_class is required for the SerializerMutation")

        if "update" not in model_operations and "create" not in model_operations:
            raise Exception('model_operations must contain "create" and/or "update"')

        serializer = serializer_class()
        if model_class is None:
            serializer_meta = getattr(serializer_class, "Meta", None)
            if serializer_meta:
                model_class = getattr(serializer_meta, "model", None)

        if lookup_field is None and model_class:
            lookup_field = model_class._meta.pk.name

        SerializerInput = type(
            f"{model_class.__name__}Input",
            (InputObjectType,),
            dict(
                yank_fields_from_attrs(
                    fields_for_serializer(
                        serializer,
                        only_fields,
                        exclude_fields,
                        is_input=True,
                        convert_choices_to_enum=convert_choices_to_enum,
                        lookup_field=lookup_field,
                        optional_fields=optional_fields,
                    ),
                    _as=InputField,
                )
            ),
        )
        input_fields = {"list": graphene.List(SerializerInput, required=True)}

        if not _meta:
            _meta = SerializerMutationOptions(cls)
        _meta.lookup_field = lookup_field
        _meta.model_operations = model_operations
        _meta.serializer_class = serializer_class
        _meta.model_class = model_class

        input_fields = yank_fields_from_attrs(input_fields, _as=InputField)
        super().__init_subclass_with_meta__(
            _meta=_meta, input_fields=input_fields, **options
        )

    @classmethod
    def get_serializer_context(cls, root, info, **input) -> dict:
        """Get serializer context value"""
        return {}

    @classmethod
    def get_serializer_queryset(cls, root, info, **input) -> Optional[QuerySet]:
        """Get serializer queryset"""
        return None

    @classmethod
    def get_serializer_kwargs(cls, root, info, **input):
        return {
            "instance": cls.get_serializer_queryset(root, info, **input),
            "data": input["list"],
            "many": True,
            "context": {
                **cls.get_serializer_context(root, info, **input),
                "request": info.context,
            },
        }

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        GraphQLResolve(permission=GraphQLPermissions.AUTHENTICATED).check_permission(
            info.context.user
        )
        kwargs = cls.get_serializer_kwargs(root, info, **input)
        serializer = cls._meta.serializer_class(**kwargs)

        if serializer.is_valid():
            serializer.save()
            return cls(errors=None)
        else:
            errors = []
            for e in serializer.errors:
                errors.append(ErrorType.from_errors(e))
            return cls(errors=errors)
