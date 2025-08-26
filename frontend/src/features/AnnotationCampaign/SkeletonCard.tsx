import React from "react";
import styles from "./styles.module.scss";
import { IonBadge, IonIcon, IonSkeletonText } from "@ionic/react";
import { crop } from "ionicons/icons";
import { SkeletonProgress } from "@/components/ui";

export const SkeletonCards: React.FC = () => (Array.from(new Array(7)).map((_, i) => <SkeletonCard key={ i }/>))

export const SkeletonCard: React.FC = () => (
  <div className={ styles.card }>

    <div className={ styles.head }>
      <IonBadge color='light'>
        <IonSkeletonText animated style={ { width: 64 } }/>
      </IonBadge>
      <IonSkeletonText className={ styles.campaign } animated style={ { width: 128, height: '1ch' } }/>
      <IonSkeletonText className={ styles.dataset } animated style={ { width: 192, height: '1ch' } }/>
    </div>

    <div className={ styles.property }>
      <IonIcon className={ styles.icon } icon={ crop }/>
      <IonSkeletonText animated style={ { width: 128, height: '1ch' } }/>
    </div>

    <SkeletonProgress className={ styles.userProgression }/>
    <SkeletonProgress className={ styles.progression }/>
  </div>
)
