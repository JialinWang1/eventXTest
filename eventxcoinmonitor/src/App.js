import React, { useEffect } from 'react'
import axios from 'axios'
import './App.css'
import Monitor from './monitor/Monitor'

function App() {
  useEffect(() => {
    axios.get('http://localhost:3001', { headers: {} }).then(console.log)
  }, [])
  return (
    <div className="App">
      <Monitor />
    </div>
  )
}

export default App
