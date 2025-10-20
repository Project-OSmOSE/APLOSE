// @ts-ignore
import React, { type ReactNode } from 'react';
import { Input } from './Input'
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'
// @ts-expect-error: scss module does exist
import styles from './form.module.scss';
import { AppStore, StoreProvider } from '../../features/App';
import { egg } from 'ionicons/icons';

const Container: React.FC<{ children: ReactNode }> = ({ children }) => (
  <StoreProvider>
    { children }
  </StoreProvider>
)

describe('Label component', () => {

  it('can show given label', async () => {
    const label = 'Test label'
    render(<Container><Input label={ label }/></Container>)

    const labelItem = screen.getByTestId('label')
    expect(labelItem).toBeInTheDocument()
    expect(labelItem).toHaveTextContent(label)
    expect(labelItem).not.toHaveClass(styles.required)
    expect(labelItem).not.toHaveTextContent('*')
    const inputItem = screen.getByTestId('input')
    expect(inputItem).toBeInTheDocument()
    expect(inputItem).toHaveProperty('id', label)
  })

  it('can show startIcon', async () => {
    const startIcon = egg
    render(<Container><Input startIcon={ startIcon }/></Container>)

    const inputItem = screen.getByTestId('input')
    expect(inputItem).toBeInTheDocument()
    expect(inputItem).toHaveClass(styles.hasStartIcon)
    const iconItem = screen.getByTestId('input-icon')
    expect(iconItem).toHaveProperty('icon', startIcon)
  })

  it('can show given note', async () => {
    const note = 'Test node'
    render(<Container><Input note={ note }/></Container>)

    const noteItem = screen.getByTestId('input-note')
    expect(noteItem).toBeInTheDocument()
    expect(noteItem).toHaveTextContent(note)
  })

  it('can show given error', async () => {
    const error = 'Test error'
    render(<Container><Input error={ error }/></Container>)

    const errorItem = screen.getByTestId('input-error')
    expect(errorItem).toBeInTheDocument()
    expect(errorItem).toHaveTextContent(error)
  })

  it('can be required', async () => {
    render(<Container><Input required/></Container>)

    const inputItem = screen.getByTestId('input')
    expect(inputItem).toBeInTheDocument()
    expect(inputItem).toBeRequired()
  })

  it('handle password type', async () => {
    render(<Container><Input type="password"/></Container>)

    const inputItem = screen.getByTestId('input')
    expect(inputItem).toBeInTheDocument()
    expect(inputItem).toHaveClass(styles.hasEndIcon)
    expect(inputItem).toHaveProperty('type', 'password')
    let pwdIconItem = screen.getByTestId('input-pwd-icon')
    expect(pwdIconItem).toBeInTheDocument()

    fireEvent.click(pwdIconItem)

    expect(inputItem).toHaveProperty('type', 'text')
    const txtIconItem = screen.getByTestId('input-txt-icon')
    expect(pwdIconItem).not.toBeInTheDocument()
    expect(txtIconItem).toBeInTheDocument()

    fireEvent.click(txtIconItem)

    expect(inputItem).toHaveProperty('type', 'password')
    pwdIconItem = screen.getByTestId('input-pwd-icon')
    expect(pwdIconItem).toBeInTheDocument()
    expect(txtIconItem).not.toBeInTheDocument()
  })

  it('handle focus and blur', async () => {
    render(<Container><Input/></Container>)
    // @ts-expect-error: areKbdShortcutsEnabled is a property of EventSlice
    expect(AppStore.getState().event.areKbdShortcutsEnabled).toEqual(true)

    const inputItem = screen.getByTestId('input')
    fireEvent.focus(inputItem)

    // @ts-expect-error: areKbdShortcutsEnabled is a property of EventSlice
    expect(AppStore.getState().event.areKbdShortcutsEnabled).toEqual(false)

    fireEvent.blur(inputItem)
    // @ts-expect-error: areKbdShortcutsEnabled is a property of EventSlice
    expect(AppStore.getState().event.areKbdShortcutsEnabled).toEqual(true)
  })
})
