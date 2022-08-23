import { screen, render, fireEvent, waitFor } from '@testing-library/react'
import WS from 'jest-websocket-mock'
import { v4 } from 'uuid'
import URL from '../URL'
import { getUserToken } from '../utils'
import Monitor from './Monitor'

describe('Monitor', () => {
  test('render monitor component', () => {
    render(<Monitor />)
    expect(screen.getByText('Cryptocurrency Realtime Price')).toBeInTheDocument()
    expect(screen.getByText('End')).toBeDisabled()
    expect(screen.getByText('Start')).toBeEnabled()
  })

  test('click start to show the cards', async () => {
    render(<Monitor />)
    fireEvent.click(screen.getByText('Start'))

    expect(screen.getByText('End')).toBeEnabled()
    expect(screen.getByText('Start')).not.toBeEnabled()
    const cards = await waitFor(() => screen.findAllByTestId('DetailsCard'), {
      timeout: 5000,
      interval: 20,
    })
    expect(cards).toHaveLength(20)
  })

  test('click end to show the cards', async () => {
    render(<Monitor />)
    fireEvent.click(screen.getByText('Start'))

    await screen.findAllByTestId('DetailsCard')

    fireEvent.click(screen.getByText('End'))

    expect(screen.getByText('End')).not.toBeEnabled()
    expect(screen.getByText('Start')).toBeEnabled()
    const cards = await waitFor(() => screen.findAllByTestId('DetailsCard'), {
      timeout: 5000,
      interval: 20,
    })
    expect(cards[0]).toBeInTheDocument()
  })
})
