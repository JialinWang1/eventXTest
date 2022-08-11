const express = require('express')
const axios = require('axios')
var cors = require('cors')
const ws = require('nodejs-websocket')
const PORT = 3001
const PORT_WS = 3002

const app = express()
app.use(cors())
let interval = null
// app.use(express.static('assets'))

const wss = ws
  .createServer((connection) => {
    console.log(`wss created ${connection}`)
    connection.on('text', (text) => {
      connection.sendText('hello w')
    })
    connection.on('close', (code, reason) => {
      console.log(`on close: ${code} / ${reason}`)
    })
    connection.on('error', (code, reason) => {
      console.log(`on error:  ${code} / ${reason}`)
    })
  })
  .listen(PORT_WS)

app.get('/start', (req, res) => {
  interval = setInterval(() => {
    axios
      .get('https://api.coincap.io/v2/assets?limit=20')
      .then((res) => {
        wss.connections[0].send(JSON.stringify(res.data))
      })
      .catch((error) => console.log(error.message))
  }, 1000)
  console.log('started')
  res.send('started')
})

app.get('/end', (req, res) => {
  clearInterval(interval)
  console.log('ended')
  res.end('ended')
})

app.listen(PORT, () => {
  console.log(`server is running under ${PORT}`)
})
