import React from "react";
import styles from './styles.module.scss';
import { Textarea } from "@/components/form";
import { IonButton, IonIcon } from "@ionic/react";
import { chatbubbleEllipses, chatbubbleOutline, trashBinOutline } from "ionicons/icons";
import { useAnnotatorAnnotations, useCommentsForAnnotator } from "@/features/Annotator";


export const Comment: React.FC = () => {
  const { comment, removeCurrent, updateCurrent } = useCommentsForAnnotator()
  const { blur } = useAnnotatorAnnotations()

  return (
    <div className={ [ styles.bloc, styles.comments ].join(' ') }>
      <h6 className={ styles.header }>Comments</h6>
      <div className={ [ styles.body, styles.comment ].join(' ') }>

        <Textarea maxLength={ 255 }
                  rows={ 5 }
                  placeholder="Enter your comment"
                  style={ { resize: 'none' } }
                  value={ comment?.comment ?? '' }
                  onChange={ e => updateCurrent(e.target.value) }/>

        <IonButton color='danger' size='small' className={ styles.removeButton } onClick={ removeCurrent }>
          Remove
          <IonIcon slot='end' icon={ trashBinOutline }/>
        </IonButton>
      </div>


      <div className={ styles.footer }>
        <IonButton fill='clear' color='medium' onClick={ blur }>
          Task Comment
          <IonIcon slot='end' icon={ comment ? chatbubbleEllipses : chatbubbleOutline }/>
        </IonButton>
      </div>
    </div>
  )
}
