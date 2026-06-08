import React from 'react';
import { Tooltip, type TooltipPositionerProps as BaseTooltipPositionerProps } from '@base-ui/react'

export type TooltipPositionerProps = BaseTooltipPositionerProps

export const Positioner: React.FC<TooltipPositionerProps> = React.memo(({
                                                                            side = 'top',
                                                                            sideOffset = 8,
                                                                            ...props
                                                                        }) => (
    <Tooltip.Positioner side={ side }
                        sideOffset={ sideOffset }
                        { ...props } />
))
