import { useCallback, useState } from 'react';

export const useModalOpenState = () => {
  const [ isOpen, setIsOpen ] = useState<boolean>(false);
  const toggle = useCallback(() => setIsOpen(prev => !prev), [ setIsOpen ])
  const open = useCallback(() => setIsOpen(true), [ setIsOpen ])
  const close = useCallback(() => setIsOpen(false), [ setIsOpen ])
  return { isOpen, toggle, open, close };
}
