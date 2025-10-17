import { config } from '@/config/env'

class WebSocketManager {
  constructor() {
    this.connections = new Map()
    this.reconnectAttempts = new Map()
    this.maxReconnectAttempts = 3
    this.reconnectDelay = 1000
    this.messageHandlers = new Map() // 消息处理器映射
  }

  // 连接到WebSocket
  connect(taskId, onMessage, onError, onClose) {
    // 如果已有连接，先关闭
    if (this.connections.has(taskId)) {
      this.disconnect(taskId)
    }

    // 使用配置文件中的地址
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const wsBaseUrl = window.location.protocol === 'https:' ? config.WSS_BASE_URL : config.WS_BASE_URL
    const wsUrl = `${wsBaseUrl}/ws?taskId=${taskId}`

    try {
      const ws = new WebSocket(wsUrl)

      ws.onopen = () => {
        console.log(`WebSocket连接已建立: ${taskId}`)
        this.reconnectAttempts.set(taskId, 0)
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          console.log(`📨 收到WebSocket消息 [${taskId}]:`, data)

          // 优先使用注册的消息处理器
          const handler = this.messageHandlers.get(taskId)
          if (handler) {
            this.handleMessage(data, handler)
          } else if (onMessage) {
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

        // 先清理当前连接
        this.connections.delete(taskId)

        // 如果不是正常关闭，尝试重连
        if (event.code !== 1000 && event.code !== 1001) {
          this.attemptReconnect(taskId, onMessage, onError, onClose)
        } else {
          // 正常关闭时清理所有资源
          this.reconnectAttempts.delete(taskId)
          this.messageHandlers.delete(taskId)
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

    console.log(`🔍 检查重连状态 [${taskId}]: 当前尝试次数=${attempts}, 最大次数=${this.maxReconnectAttempts}`)

    if (attempts < this.maxReconnectAttempts) {
      this.reconnectAttempts.set(taskId, attempts + 1)

      console.log(`🔄 尝试重连 [${taskId}]: 第${attempts + 1}/${this.maxReconnectAttempts}次`)

      setTimeout(() => {
        console.log(`⏰ 开始重连 [${taskId}]`)
        this.connect(taskId, onMessage, onError, onClose)
      }, this.reconnectDelay * (attempts + 1))
    } else {
      console.error(`❌ 重连失败 [${taskId}]: 已达到最大重连次数 ${this.maxReconnectAttempts}`)

      // 清理资源
      this.connections.delete(taskId)
      this.reconnectAttempts.delete(taskId)
      this.messageHandlers.delete(taskId)

      // 通知错误处理器
      if (onError) {
        onError(new Error(`WebSocket连接失败：已重试${this.maxReconnectAttempts}次，请检查网络连接或刷新页面重试`))
      }

      // 通知关闭回调，让上层知道连接彻底失败
      if (onClose) {
        onClose({ code: 1006, reason: 'Max reconnection attempts reached' })
      }
    }
  }

  // 断开连接
  disconnect(taskId) {
    const ws = this.connections.get(taskId)
    if (ws) {
      ws.close(1000, '用户主动断开')
      this.connections.delete(taskId)
      this.reconnectAttempts.delete(taskId)
      this.messageHandlers.delete(taskId)
      console.log(`🚫 WebSocket连接已断开: ${taskId}`)
    }
  }

 /* // 发送消息
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
  }*/

  // 注册消息处理器
  registerMessageHandler(taskId, handlers) {
    this.messageHandlers.set(taskId, handlers)
    console.log(`📝 消息处理器已注册 [${taskId}]`)
  }

  // 移除消息处理器
  removeMessageHandler(taskId) {
    this.messageHandlers.delete(taskId)
    console.log(`🗑️ 消息处理器已移除 [${taskId}]`)
  }

  // 处理消息
  handleMessage(data, handlers) {
    switch (data.type) {
      case 'deploy_output':
      case 'progress':
        // 部署输出和进度消息
        if (handlers.onDeployOutput) {
          handlers.onDeployOutput(data.data)
        }
        break
      case 'task_status':
        // 任务状态消息
        if (handlers.onTaskStatus) {
          handlers.onTaskStatus(data.data)
        }
        break
      default:
        console.log('🔔 未知消息类型:', data.type)
        if (handlers.onUnknown) {
          handlers.onUnknown(data)
        }
    }
  }

  // 为部署任务连接WebSocket的便捷方法
  connectForDeploy(taskId, handlers = {}) {
    return new Promise((resolve, reject) => {
      // 注册消息处理器
      this.registerMessageHandler(taskId, handlers)

      const onMessage = null // 使用注册的处理器
      const onError = (error) => {
        console.error(`部署WebSocket错误 [${taskId}]:`, error)
        const errorMessage = error?.message || error?.toString() || '未知WebSocket错误'
        if (handlers.onError) {
          handlers.onError({ message: errorMessage, originalError: error })
        }
        reject(new Error(errorMessage))
      }
      const onClose = (event) => {
        console.log(`部署WebSocket连接已关闭 [${taskId}]`)
        // 只在正常关闭时移除处理器，重连时会保留处理器
        if (event.code === 1000 || event.code === 1001) {
          this.removeMessageHandler(taskId)
        }
        if (handlers.onClose) {
          handlers.onClose(event)
        }
      }

      const ws = this.connect(taskId, onMessage, onError, onClose)
      if (ws) {
        // 等待连接建立
        ws.addEventListener('open', () => {
          console.log(`✅ 部署WebSocket连接已建立 [${taskId}]`)
          resolve(ws)
        }, { once: true })
      } else {
        reject(new Error('创建WebSocket连接失败'))
      }
    })
  }

  // 断开部署任务连接
  disconnectDeploy(taskId) {
    this.removeMessageHandler(taskId)
    this.disconnect(taskId)
  }
}

// 创建全局实例
const websocketManager = new WebSocketManager()

export default websocketManager
