import React from 'react'
import './App.css'
import Monitor from './monitor/Monitor'

function App() {
  // const tradeWs = new WebSocket('wss://ws.coincap.io/trades/binance')

  // tradeWs.onmessage = function (msg) {
  //     console.log(msg.data)
  // }
  return (
    <div className="App">
      <Monitor />
    </div>
  )
}

export default App
