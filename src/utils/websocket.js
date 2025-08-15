class WebSocketManager {
  constructor() {
    this.connections = new Map()
    this.reconnectAttempts = new Map()
    this.maxReconnectAttempts = 5
    this.reconnectDelay = 1000
  }

  // 连接到WebSocket
  connect(taskId, onMessage, onError, onClose) {
    // 如果已有连接，先关闭
    if (this.connections.has(taskId)) {
      this.disconnect(taskId)
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const host = window.location.hostname
    const port = '8080' // 后端端口
    const wsUrl = `${protocol}//${host}:${port}/ws?taskId=${taskId}`

    try {
      const ws = new WebSocket(wsUrl)
      
      ws.onopen = () => {
        console.log(`WebSocket连接已建立: ${taskId}`)
        this.reconnectAttempts.set(taskId, 0)
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (onMessage) {
            onMessage(data)
          }
        } catch (error) {
          console.error('解析WebSocket消息失败:', error)
        }
      }

      ws.onerror = (error) => {
        console.error(`WebSocket错误 [${taskId}]:`, error)
        if (onError) {
          onError(error)
        }
      }

      ws.onclose = (event) => {
        console.log(`WebSocket连接已关闭 [${taskId}]:`, event.code, event.reason)
        
        // 如果不是正常关闭，尝试重连
        if (event.code !== 1000 && event.code !== 1001) {
          this.attemptReconnect(taskId, onMessage, onError, onClose)
        }
        
        if (onClose) {
          onClose(event)
        }
      }

      this.connections.set(taskId, ws)
      return ws

    } catch (error) {
      console.error('创建WebSocket连接失败:', error)
      if (onError) {
        onError(error)
      }
      return null
    }
  }

  // 尝试重连
  attemptReconnect(taskId, onMessage, onError, onClose) {
    const attempts = this.reconnectAttempts.get(taskId) || 0
    
    if (attempts < this.maxReconnectAttempts) {
      this.reconnectAttempts.set(taskId, attempts + 1)
      
      console.log(`尝试重连 [${taskId}]: 第${attempts + 1}次`)
      
      setTimeout(() => {
        this.connect(taskId, onMessage, onError, onClose)
      }, this.reconnectDelay * (attempts + 1))
    } else {
      console.error(`重连失败 [${taskId}]: 已达到最大重连次数`)
    }
  }

  // 断开连接
  disconnect(taskId) {
    const ws = this.connections.get(taskId)
    if (ws) {
      ws.close(1000, '用户主动断开')
      this.connections.delete(taskId)
      this.reconnectAttempts.delete(taskId)
      console.log(`WebSocket连接已断开: ${taskId}`)
    }
  }

  // 发送消息
  send(taskId, message) {
    const ws = this.connections.get(taskId)
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message))
    } else {
      console.error(`WebSocket未连接或未就绪: ${taskId}`)
    }
  }

  // 获取连接状态
  getConnectionState(taskId) {
    const ws = this.connections.get(taskId)
    if (!ws) return 'disconnected'
    
    switch (ws.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting'
      case WebSocket.OPEN:
        return 'open'
      case WebSocket.CLOSING:
        return 'closing'
      case WebSocket.CLOSED:
        return 'closed'
      default:
        return 'unknown'
    }
  }

  // 清理所有连接
  cleanup() {
    for (const [taskId] of this.connections) {
      this.disconnect(taskId)
    }
  }
}

// 创建全局实例
const websocketManager = new WebSocketManager()

export default websocketManager 