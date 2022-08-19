const { hostname } = window.location
export default {
  startStreaming: `http://${hostname}:3001/start`,
  endStreaming: `http://${hostname}:3001/end`,
  socketURL: `ws://${hostname}:3002`,
}
