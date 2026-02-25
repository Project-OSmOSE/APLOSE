export type ExtendedDivEvent =
    'drag'
    | 'resizeTop'
    | 'resizeBottom'
    | 'resizeLeft'
    | 'resizeRight'
    | 'resizeTopLeft'
    | 'resizeTopRight'
    | 'resizeBottomLeft'
    | 'resizeBottomRight'

export type ExtendedDivPosition = {
    x: number,
    y: number,
    width?: number,
    height?: number
}
