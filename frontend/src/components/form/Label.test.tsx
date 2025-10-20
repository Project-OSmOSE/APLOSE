import { Label } from './Label'
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'
// @ts-expect-error: scss module does exist
import styles from './form.module.scss';

const label = 'Test label'

describe('Label component', () => {

  it('can show given label', async () => {
    render(<Label label={ label }/>)

    const item = screen.getByTestId('label')
    expect(item).toBeInTheDocument()
    expect(item).toHaveTextContent(label)
    expect(item).not.toHaveClass(styles.required)
    expect(item).not.toHaveTextContent('*')
  })

  it('doesn\'t show without label', async () => {
    render(<Label/>)
    const item = screen.queryByTestId('label')
    expect(item).not.toBeInTheDocument()
  })

  it('can show required label', async () => {
    render(<Label label={ label } required/>)

    const item = screen.getByTestId('label')
    expect(item).toBeInTheDocument()
    expect(item).toHaveTextContent(label)
    expect(item).toHaveClass(styles.required)
    expect(item).toHaveTextContent('*')
  })
})
