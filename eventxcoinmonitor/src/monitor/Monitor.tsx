import React, { useCallback, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import DetailsCard from './DetailsCard/DetailsCard'
import './Monitor.scss'
import API from '../URL'

const Monitor = () => {
  const [streamingStatus, setStreamingStatus] = useState(0)
  const [cards, setCards] = useState([])

  const socket = useRef<WebSocket | null>(null)

  const webSocketInit = useCallback(() => {
    if (!socket.current || socket.current.readyState === 3) {
      socket.current = new WebSocket(API.socketURL)
      socket.current.onopen = () => {
        console.log('connected')
        socket.current.send('Monitor connected')
      }
      socket.current.onclose = (d) => {
        console.log('onclose: ', d)
      }
      socket.current.onerror = (e) => {
        console.log('onerror: ', e)
      }
      socket.current.onmessage = (res) => {
        // backend return 1 when first connected to the websocket
        if (res.data !== '1') {
          setCards(JSON.parse(res.data).data)
        }
      }
    }
  }, [socket])

  useEffect(() => {
    webSocketInit()
    return () => {
      console.log('close')
      socket.current?.close(1000, 'manually')
    }
  }, [socket, webSocketInit])

  const onStartStreaming = () => {
    setStreamingStatus(1)
    axios.get(API.startStreaming)
  }
  const onEndStreaming = () => {
    setStreamingStatus(0)
    axios.get(API.endStreaming)
  }
  return (
    <div className="monitor_container">
      <span className="monitor_title">Cryptocurrency Realtime Price</span>
      <div>
        <button
          type="button"
          className="monitor_start"
          disabled={Boolean(streamingStatus)}
          onClick={onStartStreaming}>
          Start
        </button>
        <button
          type="button"
          className="monitor_end"
          disabled={!streamingStatus}
          onClick={onEndStreaming}>
          End
        </button>
      </div>
      <div className="monitor_body">
        {cards.map((card) => {
          const total =
            Number(card.priceUsd) + Number(card.volumeUsd24Hr) + Number(card.changePercent24Hr)
          return (
            <DetailsCard
              key={total.toString()}
              title={card.id}
              price={Number(card.priceUsd)}
              volume={Number(card.volumeUsd24Hr)}
              change={Number(card.changePercent24Hr)}
            />
          )
        })}
      </div>
    </div>
  )
}

export default Monitor
