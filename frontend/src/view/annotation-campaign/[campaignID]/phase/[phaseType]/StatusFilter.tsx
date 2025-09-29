import React, { Fragment, useState } from "react";
import styles from './styles.module.scss'
import { IonIcon } from "@ionic/react";
import { funnel, funnelOutline } from "ionicons/icons";
import { createPortal } from "react-dom";
import { Modal } from "@/components/ui";
import { Switch } from "@/components/form";
import { TaskStatus } from "@/features/gql/api";
import { useSpectrogramFilters } from "@/service/slices/filter.ts";

export const StatusFilter: React.FC<{
  onUpdate: () => void
}> = ({ onUpdate }) => {
  const { params, updateParams } = useSpectrogramFilters()
  const [ filterModalOpen, setFilterModalOpen ] = useState<boolean>(false);

  function setState(option: string) {
    let is_submitted = undefined;
    switch (option) {
      case TaskStatus.created:
        is_submitted = false;
        break;
      case TaskStatus.finished:
        is_submitted = true;
        break;
    }
    updateParams({ is_submitted })
    onUpdate()
  }

  function valueToBooleanOption(value?: boolean | null): 'Unset' | 'Created' | 'Finished' {
    switch (value) {
      case true:
        return TaskStatus.finished;
      case false:
        return TaskStatus.created;
      default:
        return 'Unset';
    }
  }

  return <Fragment>
    { params.is_submitted !== undefined ?
      <IonIcon onClick={ () => setFilterModalOpen(true) } color='primary' icon={ funnel }/> :
      <IonIcon onClick={ () => setFilterModalOpen(true) } color='dark' icon={ funnelOutline }/> }

    { filterModalOpen && createPortal(<Modal className={ styles.filterModal }
                                             onClose={ () => setFilterModalOpen(false) }>

      <Switch label='Status' options={ [ 'Unset', 'Created', 'Finished' ] }
              value={ valueToBooleanOption(params.is_submitted) } onValueSelected={ setState }/>

    </Modal>, document.body) }
  </Fragment>
}