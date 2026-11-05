import { Combobox } from '@/components/base';
import type { BaseComboboxSelectProps } from './types';

type PortalProps<Value, Multiple extends boolean = false> = Pick<BaseComboboxSelectProps<Value, Multiple>, 'itemName'>
    & Required<Pick<BaseComboboxSelectProps<Value, Multiple>, 'itemToElementLabel'>>
     & Pick<Combobox.PositionerProps, 'side'>

export function Portal<Value>({
                                  itemName,
                                  itemToElementLabel,
                                  side,
                              }: PortalProps<Value>) {
    return <Combobox.Portal>
        <Combobox.Positioner side={ side }>
            <Combobox.Popup data-testid={ `${ itemName.replace(' ', '-') }-select-popup` }>
                <Combobox.Empty>No { itemName } found.</Combobox.Empty>
                <Combobox.List>
                    { (item, k) => (
                        <Combobox.Item key={ k } value={ item }>
                            <Combobox.ItemIndicator/>
                            { itemToElementLabel(item) }
                        </Combobox.Item>
                    ) }
                </Combobox.List>
            </Combobox.Popup>
        </Combobox.Positioner>
    </Combobox.Portal>
}