import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'
import DetailsCard from './DetailsCard/DetailsCard'
import './Monitor.scss'

const Monitor = () => {
  const [streamingStatus, setStreamingStatus] = useState(0)
  const [cards, setCards] = useState([])

  let socket = useRef<WebSocket | null>(null)
  const webSocketInit = useCallback(() => {
    if (!socket.current || socket.current.readyState === 3) {
      socket.current = new WebSocket('ws://localhost:3002')
      socket.current.onopen = (_e) => () => {
        console.log('connected')
        socket.current.send('abc')
      }
      socket.current.onclose = (_e) => (d) => {
        console.log(d)
      }
      socket.current.onerror = (e) => (e) => {
        console.log(e)
      }
      socket.current.onmessage = (res) => {
        setCards(JSON.parse(res.data).data)
        console.log(Array.isArray(JSON.parse(res.data).data))
      }
    }
  }, [socket])

  useEffect(() => {
    webSocketInit()
    return () => {
      console.log('close')
      socket.current?.close(1000, 'manually')
    }
  }, [socket])

  const onStartStreaming = () => {
    setStreamingStatus(1)
    axios.get('http://localhost:3001/start', { headers: { 'Access-Control-Allow-Origin': '*' } })
  }
  const onEndStreaming = () => {
    setStreamingStatus(0)
    axios.get('http://localhost:3001/end')
  }
  return (
    <div className="monitor_container">
      <span className="monitor_title">Cryptocurrency Realtime Price</span>
      <div>
        <button
          className="monitor_start"
          disabled={Boolean(streamingStatus)}
          onClick={onStartStreaming}>
          Start
        </button>
        <button className="monitor_end" disabled={!streamingStatus} onClick={onEndStreaming}>
          End
        </button>
      </div>
      <div className="monitor_body">
        {cards.map((card) => (
          <DetailsCard
            title={card.id}
            price={+card.priceUsd}
            volume={+card.volumeUsd24Hr}
            change={+card.changePercent24Hr}
          />
        ))}
      </div>
    </div>
  )
}

export default Monitor
