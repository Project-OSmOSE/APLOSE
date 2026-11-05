import { Toggle } from '@/components/base'
import * as API from '../api'

type Props = Toggle.RadioGroupProps<API.LabelDisplayPreferenceType>

export function LabelPreferenceToggle(props: Props) {
    return <Toggle.Group { ...props }>
        <Toggle.Item value={ API.LabelDisplayPreferenceType.English }>
            { API.LabelDisplayPreferenceType.English }
        </Toggle.Item>
        <Toggle.Item value={ API.LabelDisplayPreferenceType.French }>
            { API.LabelDisplayPreferenceType.French }
        </Toggle.Item>
        <Toggle.Item value={ API.LabelDisplayPreferenceType.Code }>
            { API.LabelDisplayPreferenceType.Code }
        </Toggle.Item>
    </Toggle.Group>
}
