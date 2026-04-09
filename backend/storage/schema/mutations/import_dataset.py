import traceback

import graphene
from django.db import transaction
from django_extension.schema.permissions import GraphQLResolve, GraphQLPermissions
from graphene import Mutation, String
from graphene_django.types import ErrorType
from graphql import GraphQLError

from backend.api.models import SpectrogramAnalysis
from backend.api.schema import DatasetNode
from backend.background_tasks.tasks import process_background_task
from backend.background_tasks.types import ImportAnalysisBackgroundTask
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
        path = String(required=True)

    dataset = graphene.Field(DatasetNode, required=True)
    analysis_result = graphene.List(AnalysisImportReturnType)

    @GraphQLResolve(permission=GraphQLPermissions.STAFF_OR_SUPERUSER)
    @transaction.atomic
    def mutate(self, info, path: str):
        """Do the mutation: create required analysis"""

        resolver = Resolver(path)

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
        if path != resolver.dataset.path:
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
            if sa.is_import_completed:
                continue
            result = {"path": sa.path}

            try:
                bg_task = ImportAnalysisBackgroundTask(
                    dataset_id=resolver.dataset.id,
                    analysis_id=sa.pk,
                    analysis_path=join(resolver.dataset.path, sa.path),
                    requested_by=info.context.user,
                )
                process_background_task.delay(bg_task.identifier)
                result["background_task_id"] = bg_task.identifier
            except Exception as e:
                traceback.print_exc()
                result["errors"] = ErrorType.from_errors({"analysis": e})
            analysis_result.append(result)

        return ImportDatasetMutation(
            dataset=resolver.dataset,
            analysis_result=analysis_result,
        )


ImportDatasetMutationField = ImportDatasetMutation.Field()
__all__ = ["ImportDatasetMutationField", "ImportDatasetMutation"]
