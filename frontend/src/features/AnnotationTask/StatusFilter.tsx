import React, { Fragment, useState } from "react";
import styles from './styles.module.scss'
import { IonIcon } from "@ionic/react";
import { funnel, funnelOutline } from "ionicons/icons";
import { createPortal } from "react-dom";
import { Modal } from "@/components/ui";
import { Switch } from "@/components/form";
import { AnnotationTaskStatus, useAllTasksFilters } from "@/api";

export const StatusFilter: React.FC<{
  onUpdate: () => void
}> = ({ onUpdate }) => {
  const { params, updateParams } = useAllTasksFilters()
  const [ filterModalOpen, setFilterModalOpen ] = useState<boolean>(false);

  function setState(option: string) {
    let status: AnnotationTaskStatus | undefined = undefined;
    switch (option) {
      case AnnotationTaskStatus.Created:
      case AnnotationTaskStatus.Finished:
        status = option
        break;
    }
    updateParams({ status })
    onUpdate()
  }

  function valueToBooleanOption(value?: AnnotationTaskStatus | null): 'Unset' | 'Created' | 'Finished' {
    return value ?? 'Unset'
  }

  return <Fragment>
    { params.status !== undefined ?
      <IonIcon onClick={ () => setFilterModalOpen(true) } color='primary' icon={ funnel }/> :
      <IonIcon onClick={ () => setFilterModalOpen(true) } color='dark' icon={ funnelOutline }/> }

    { filterModalOpen && createPortal(<Modal className={ styles.filterModal }
                                             onClose={ () => setFilterModalOpen(false) }>

      <Switch label='Status' options={ [ 'Unset', 'Created', 'Finished' ] }
              value={ valueToBooleanOption(params.status) }
              onValueSelected={ setState }/>

    </Modal>, document.body) }
  </Fragment>
}