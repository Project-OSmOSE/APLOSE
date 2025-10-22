import graphene


class AnnotationTaskIndexesNode(graphene.ObjectType):

    current = graphene.Int()
    total = graphene.Int()
