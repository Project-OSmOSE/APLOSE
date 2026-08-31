export const BaseColors = [
    'primary',
    'success',
    'warning',
    'danger',
    'medium',
    'dark'
]
export type BaseColor = typeof BaseColors[number];

export type Never<T> = {
    [key in keyof T]?: never;
};