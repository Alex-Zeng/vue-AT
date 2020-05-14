
export function getSocketIO(namespace) {
  // namespace:命名空间或path
  const url = `ws://localhost:5002/${namespace}`
  const options = {
    path: '',
    transports: ['websocket'],
    reconnectionAttempts: 3,
    reconnectionDelay: 3000,
    timestampRequests: true,
    autoConnect: false
  }
  const socket = io(url, options)
  return socket
}
