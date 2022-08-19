const express = require('express')
const qs = require('querystring')
const axios = require('axios')
var cors = require('cors')
const ws = require('nodejs-websocket')

const PORT = 3001
const PORT_WS = 3002

const app = express()
app.use(cors())

const userInfoMap = new Map()
let interval = null
let intervalStarted = false

const wss = ws
  .createServer((connection) => {
    // connection will be extended with userToken: string and needStreaming: boolean
    const { userToken } = getUserParam(connection.path)

    if (userToken) {
      connection.userToken = userToken
      updateUserInfoMap(userToken, connection)
    } else {
      connection.close()
    }

    connection.on('text', (text) => {
      connection.sendText('1')
    })
    connection.on('close', (code, reason) => {
      console.log(`on close: ${code} / ${reason}`)
      removeItemFromUserInfoMap(userToken)
      checkToClearInterval()
    })
    connection.on('error', (code, reason) => {
      console.log(`on error:  ${code} / ${reason}, connection closing`)
    })
  })
  .listen(PORT_WS)

const getCoinsData = (limit) => {
  axios
    .get(`https://api.coincap.io/v2/assets?limit=${limit}`)
    .then((res) => {
      let connections = wss.connections
      for (let i = 0; i < connections.length; i++) {
        console.log(connections[i].userToken + ':' + connections[i].needStreaming)
        if (connections[i].needStreaming) {
          connections[i].sendText(JSON.stringify(res.data))
        }
      }
    })
    .catch((error) => {
      console.log(error.message)
      clearIntervalWithState()
    })
}

const clearIntervalWithState = () => {
  clearInterval(interval)
  intervalStarted = false
}

const updateUserInfoMap = (userToken, connection) => {
  userInfoMap.set(userToken, connection)
}

const removeItemFromUserInfoMap = (userToken) => {
  if (userInfoMap.has(userToken)) {
    userInfoMap.delete(userToken)
  }
}

const getUserParam = (path) => {
  return qs.parse(path.replace('/?', ''))
}

const updateConnectionNeedStreaming = (userToken, needStreaming) => {
  userInfoMap.get(userToken).needStreaming = needStreaming
}

const checkToClearInterval = () => {
  if (!wss.connections) {
    clearIntervalWithState()
  }
}

app.get('/start', (req, res) => {
  const { userToken } = req.query
  updateConnectionNeedStreaming(userToken, true)
  getCoinsData(20)
  if (!intervalStarted) {
    intervalStarted = true
    interval = setInterval(() => {
      getCoinsData(20)
    }, 1000)
  }
  console.log('started')
  res.send('started')
})

app.get('/end', (req, res) => {
  const { userToken } = req.query
  updateConnectionNeedStreaming(userToken, false)
  checkToClearInterval()
  console.log('ended')
  res.end('ended')
})

app.listen(PORT, () => {
  console.log(`server is running under ${PORT}`)
})
