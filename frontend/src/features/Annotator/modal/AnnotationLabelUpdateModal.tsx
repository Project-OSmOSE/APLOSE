import React, { Fragment, useCallback, useMemo } from "react";
import styles from "../styles.module.scss";
import { createPortal } from "react-dom";
import { Button, Modal, ModalHeader } from "@/components/ui";
import { IonNote } from "@ionic/react";
import { AnnotationLabelNode } from "@/features/gql/types.generated.ts";
import { useAnnotatorAnnotations, useAnnotatorQuery } from "@/features/Annotator";

export const AnnotationLabelUpdateModal: React.FC<{
  isModalOpen: boolean,
  setIsModalOpen: (value: boolean) => void
}> = ({ isModalOpen, setIsModalOpen }) => {
  const { data } = useAnnotatorQuery()
  const {
    annotation,
    correctedAnnotation,
    update
  } = useAnnotatorAnnotations()


  const updateLabel = useCallback((newLabel: Pick<AnnotationLabelNode, 'name'>) => {
    if (!annotation) return;
    update(annotation, { label: newLabel })
    setIsModalOpen(false)
  }, [ setIsModalOpen, annotation ]);

  const currentLabel = useMemo(() => correctedAnnotation?.label ?? annotation?.label, [ correctedAnnotation, annotation ])
  const labels = useMemo(() => data?.annotationCampaignLabelSet?.labels?.results.filter(l => l !== null), [ data ])

  if (!isModalOpen) return <Fragment/>
  return createPortal(<Modal onClose={ () => setIsModalOpen(false) }>
    <ModalHeader title="Update annotation label" onClose={ () => setIsModalOpen(false) }/>
    <IonNote>Choose a new label</IonNote>
    <div className={ styles.labelsButtons }>
      { labels?.map((label, index) => <Button key={ label.name }
                                              fill='outline'
                                              disabled={ label.name === currentLabel?.name }
                                              className={ `ion-color-${ index % 10 }` }
                                              onClick={ () => updateLabel(label) }>
        { label.name }
      </Button>) }
    </div>
  </Modal>, document.body)
}