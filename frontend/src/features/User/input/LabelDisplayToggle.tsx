import { Toggle } from '@/components/base'
import * as API from '../api'

type Props = Toggle.RadioGroupProps<API.LabelDisplayEnum>

export function LabelDisplayToggle(props: Props) {
    return <Toggle.Group { ...props }>
        <Toggle.Item value={ API.LabelDisplayEnum.English }>
            { API.LabelDisplayEnum.English }
        </Toggle.Item>
        <Toggle.Item value={ API.LabelDisplayEnum.French }>
            { API.LabelDisplayEnum.French }
        </Toggle.Item>
        <Toggle.Item value={ API.LabelDisplayEnum.Code }>
            { API.LabelDisplayEnum.Code }
        </Toggle.Item>
    </Toggle.Group>
}
