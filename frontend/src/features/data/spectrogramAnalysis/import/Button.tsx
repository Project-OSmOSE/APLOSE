import React, { Fragment } from "react";
import { useModal } from "@/service/ui/modal.ts";
import { IonButton, IonIcon } from "@ionic/react";
import { downloadOutline } from "ionicons/icons";
import { createPortal } from "react-dom";
import { ImportAnalysisModal } from "./Modal.tsx";

export const ImportAnalysisButton: React.FC = () => {
  const modal = useModal();

  return <Fragment>
    <IonButton color='primary' fill='clear'
               style={ { zIndex: 2, justifySelf: 'center' } }
               onClick={ modal.toggle }>
      <IonIcon icon={ downloadOutline } slot='start'/>
      Import analysis
    </IonButton>

    { modal.isOpen && createPortal(<ImportAnalysisModal onClose={ modal.close }/>, document.body) }
  </Fragment>
}
