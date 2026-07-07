import React from 'react';
import { NavigationMenu } from '@base-ui/react/navigation-menu';
import styles from './NavigationMenu.module.scss';


export const Portal: React.FC = () => (
    <NavigationMenu.Portal>
        <NavigationMenu.Positioner side="right"
                                   sideOffset={ 10 }
                                   collisionPadding={ { top: 5, bottom: 20, left: 20, right: 20 } }
                                   collisionAvoidance={ { side: 'none' } }>
            <NavigationMenu.Popup className={ styles.Popup }>
                <NavigationMenu.Arrow/>
                <NavigationMenu.Viewport/>
            </NavigationMenu.Popup>
        </NavigationMenu.Positioner>
    </NavigationMenu.Portal>
)
