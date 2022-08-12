import { screen, render, fireEvent, waitFor } from '@testing-library/react'
import WS from 'jest-websocket-mock'
import URL from '../URL'

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

  test('init websocket', async () => {
    render(<Monitor />)
    const server = new WS(URL.socketURL)
    const client = new WebSocket(URL.socketURL)

    await server.connected

    expect(server).toReceiveMessage('Monitor connected')

    client.close()
    server.close()
  })

  // test('client received data', async () => {
  //   const server = new WS(URL.socketURL)
  //   const client = new WebSocket(URL.socketURL)

  //   const mockData = {
  //     data: [
  //       {
  //         id: 'bitcoin',
  //         rank: '1',
  //         symbol: 'BTC',
  //         name: 'Bitcoin',
  //         supply: '19118137.0000000000000000',
  //         maxSupply: '21000000.0000000000000000',
  //         marketCapUsd: '464701850052.6673634595936652',
  //         volumeUsd24Hr: '15574684698.6513599861678426',
  //         priceUsd: '24306.8584586807471596',
  //         changePercent24Hr: '6.1306159721180593',
  //         vwap24Hr: '23607.2408249399117351',
  //         explorer: 'https://blockchain.info/',
  //       },
  //     ],
  //   }
  //   client.send('sent')
  //   await expect(server).toReceiveMessage('sent')
  //   let message = null
  //   client.onmessage = (e) => {
  //     message = e.data
  //   }
  //   server.send(mockData)
  //   await expect(message).toEqual(mockData)
  //   client.close()
  //   server.close()
  // })
})
