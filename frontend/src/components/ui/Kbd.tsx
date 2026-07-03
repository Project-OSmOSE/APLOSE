import React, { useMemo } from 'react';
import styles from './ui.module.scss'

type Key =
  | 'command'
  | 'shift'
  | 'ctrl'
  | 'option'
  | 'enter'
  | 'delete'
  | 'escape'
  | 'tab'
  | 'capslock'
  | 'up'
  | 'right'
  | 'down'
  | 'left'
  | 'pageup'
  | 'pagedown'
  | 'home'
  | 'end'
  | 'help'
  | 'space'
  | string
  | number;
const isMac = navigator.platform.toUpperCase().indexOf('MAC')>=0;

const KEY_MAP: Record<Key, string> = {
  command: '⌘',
  shift: '⇧',
  ctrl: isMac ? '⌃' : 'Ctrl',
  option: '⌥',
  enter: '↵',
  delete: '⌫',
  escape: '⎋',
  tab: '⇥',
  capslock: '⇪',
  up: '↑',
  right: '→',
  down: '↓',
  left: '←',
  pageup: '⇞',
  pagedown: '⇟',
  home: '↖',
  end: '↘',
  help: '?',
  space: '␣',
};

export const Kbd: React.FC<{
  keys: Key | Array<Key> | undefined,
  className?: string
  annotationColorIndex?: number;
}> = ({ keys, className, annotationColorIndex }) => {

  const content: string[] = useMemo(() => {
    if (!keys) return []
    let data: Array<Key>;
    switch (typeof keys) {
      case 'string':
      case 'number':
        data = [ keys ]
        break;
      default:
        data = keys
    }
    return data.map(k => {
      if (typeof k === 'number') return k.toString();
      if (Object.keys(KEY_MAP).includes(k)) return KEY_MAP[k];
      return k;
    })
  }, [ keys ])

  const classes = useMemo(() => {
    const classes = [styles.kbd, className]
    if (annotationColorIndex !== undefined) classes.push(styles['index-' + annotationColorIndex%10])
    return classes;
  }, [annotationColorIndex, className])

  return (
    <kbd className={ classes.join(' ') }>{ content.map((k, id) => <kbd key={ id }>{ k }</kbd>) }</kbd>
  )
}