const express = require('express')
const axios = require('axios')
const PORT = 3001

const app = express()
let interval = null
// app.use(express.static('assets'))

app.get('/start', (req, res) => {
  interval = setInterval(() => {
    axios
      .get('https://api.coincap.io/v2/assets?ids=bitcoin,ethereum,monero')
      .then((res) => console.log(res.data))
      .catch((error) => console.log(error.message))
  }, 1000)
  console.log('started')
  res.end('started')
})

app.get('/end', (req, res) => {
  clearInterval(interval)
  console.log('ended')
  res.end('ended')
})

app.listen(PORT, () => {
  console.log(`server is running under ${PORT}`)
})
