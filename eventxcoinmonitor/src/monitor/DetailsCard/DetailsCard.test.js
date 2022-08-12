import { screen, render, fireEvent, waitFor } from '@testing-library/react'
import DetailsCard from './DetailsCard'

describe('Monitor', () => {
  test('render DetailsCard component', () => {
    render(<DetailsCard volume={0} change={0} price={0} title={'bitcoin'} />)
    expect(screen.getByText('volume:')).toBeInTheDocument()
    expect(screen.getByText('change:')).toBeInTheDocument()
    expect(screen.getByText('bitcoin')).toBeInTheDocument()
  })
})
