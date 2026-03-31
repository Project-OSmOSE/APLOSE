import graphene
from django.db import transaction
from django_extension.schema.permissions import GraphQLResolve, GraphQLPermissions
from graphene import Mutation, String
from graphene_django.types import ErrorType
from graphql import GraphQLError

from backend.api.schema import DatasetNode
from backend.background_tasks.models import (
    ImportAnalysisBackgroundTask,
)
from backend.background_tasks.tasks import process_background_task
from backend.storage.resolvers import Resolver
from backend.storage.types import FailedItem
from backend.storage.utils import join


class AnalysisImportReturnType(graphene.ObjectType):

    path = graphene.String(required=True)
    background_task_id = graphene.ID()
    errors = graphene.List(ErrorType)


class ImportDatasetMutation(Mutation):
    """ "Import Analysis mutation"""

    class Arguments:
        dataset_path = String(required=True)
        analysis_path = String()

    dataset = graphene.Field(DatasetNode, required=True)
    analysis_result = graphene.List(AnalysisImportReturnType)

    @GraphQLResolve(permission=GraphQLPermissions.STAFF_OR_SUPERUSER)
    @transaction.atomic
    def mutate(self, info, dataset_path: str, analysis_path: str | None = None):
        """Do the mutation: create required analysis"""

        full_path = join(dataset_path, analysis_path or "")
        resolver = Resolver(full_path)

        if not resolver.dataset:
            raise GraphQLError("Dataset not found")
        if isinstance(resolver.dataset, FailedItem):
            raise GraphQLError(
                str(resolver.dataset.error), original_error=resolver.dataset.error
            )
        if resolver.dataset.pk is None:
            resolver.dataset.owner = info.context.user
        resolver.dataset.save()

        analysis = []
        if analysis_path:
            if isinstance(resolver.analysis, FailedItem):
                raise GraphQLError(
                    str(resolver.analysis.error), original_error=resolver.analysis.error
                )
            analysis.append(resolver.analysis)
        else:
            for a in resolver.all_analysis:
                if isinstance(a, FailedItem):
                    continue
                analysis.append(a)

        analysis_result = []
        for sa in analysis:
            if sa.pk is not None:
                continue
            result = {"path": sa.path}

            try:
                bg_task = ImportAnalysisBackgroundTask.objects.create(
                    dataset=resolver.dataset,
                    analysis_path=sa.path,
                    requested_by=info.context.user,
                )
                process_background_task.delay(bg_task.task_identifier)
                result["background_task_id"] = bg_task.pk
            except Exception as e:
                sa.delete()
                result["errors"] = ErrorType.from_errors([e])
            analysis_result.append(result)

        return ImportDatasetMutation(
            dataset=resolver.dataset,
            analysis_result=analysis_result,
        )


ImportDatasetMutationField = ImportDatasetMutation.Field()
__all__ = ["ImportDatasetMutationField", "ImportDatasetMutation"]
