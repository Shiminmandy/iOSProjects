# WebSocket 详细讲解文档

## 📖 什么是 WebSocket？

WebSocket 是一种**网络通信协议**，提供了浏览器和服务器之间的**全双工（双向）通信通道**。

### 简单类比

想象打电话 vs 发短信：
- **HTTP**：像发短信 📱
  - 你发一条 → 对方回一条
  - 每次通信都要重新"发起"
  
- **WebSocket**：像打电话 ☎️
  - 建立连接后，双方可以随时说话
  - 不需要每次都"拨号"

---

## 🆚 WebSocket vs HTTP

### HTTP（传统方式）

```
客户端 → 服务器: "给我数据"
客户端 ← 服务器: "这是数据"
[连接关闭]

客户端 → 服务器: "再给我数据"
客户端 ← 服务器: "这是数据"
[连接关闭]
```

**问题：**
- ❌ 需要不断重新建立连接
- ❌ 服务器无法主动推送消息
- ❌ 大量开销在握手上

### WebSocket（现代方式）

```
客户端 → 服务器: "建立连接"
客户端 ← 服务器: "连接成功"
[保持连接]

服务器 → 客户端: "有新消息！"
客户端 → 服务器: "收到，这是我的回复"
服务器 → 客户端: "又有新消息！"
[持续通信...]
```

**优势：**
- ✅ 一次握手，持续通信
- ✅ 服务器可以主动推送
- ✅ 低延迟，实时性强

---

## 🔄 WebSocket 工作流程

### 第一步：握手阶段（Handshake）

WebSocket 连接从 HTTP 升级开始：

```http
客户端请求（HTTP Upgrade）：
GET /chat HTTP/1.1
Host: example.com
Upgrade: websocket              ← 关键：请求升级协议
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13

服务器响应：
HTTP/1.1 101 Switching Protocols  ← 101 状态码：切换协议
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
```

### 第二步：数据传输阶段

```
客户端 ⟷ 服务器
   ↕
持续双向通信
```

### 第三步：关闭连接

```
任一方发送关闭帧 → 连接优雅关闭
```

---

## 💻 代码示例

### 前端（客户端）代码

```javascript
// 1. 创建 WebSocket 连接
const ws = new WebSocket('ws://localhost:3001');

// 2. 监听连接打开事件
ws.onopen = () => {
  console.log('✅ WebSocket 连接成功');
  
  // 发送消息
  ws.send(JSON.stringify({
    type: 'join',
    room: 'chat-room-1',
    user: 'John'
  }));
};

// 3. 监听接收消息事件
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('📩 收到消息:', data);
  
  // 更新 UI
  displayMessage(data);
};

// 4. 错误处理
ws.onerror = (error) => {
  console.error('❌ WebSocket 错误:', error);
};

// 5. 监听连接关闭事件
ws.onclose = (event) => {
  console.log('🔌 WebSocket 连接已关闭');
  console.log('关闭码:', event.code);
  console.log('原因:', event.reason);
  
  // 可以实现自动重连
  setTimeout(() => {
    console.log('尝试重新连接...');
    connectWebSocket();
  }, 3000);
};

// 6. 发送消息函数
function sendMessage(message) {
  // 检查连接状态
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({
      type: 'message',
      content: message,
      timestamp: Date.now()
    }));
  } else {
    console.error('WebSocket 未连接');
  }
}

// 7. 主动关闭连接
function disconnect() {
  ws.close(1000, 'User logged out'); // 1000 = 正常关闭
}
```

### 后端（服务器）代码 - Node.js + ws

```javascript
const WebSocket = require('ws');
const http = require('http');

// 创建 HTTP 服务器
const server = http.createServer();

// 创建 WebSocket 服务器（附加到 HTTP 服务器）
const wss = new WebSocket.Server({ server });

// 存储所有连接的客户端
const clients = new Map(); // { userId: ws }
const rooms = new Map();   // { roomId: Set<ws> }

// 监听新连接
wss.on('connection', (ws, request) => {
  console.log('🎉 新客户端连接');
  console.log('来源 IP:', request.socket.remoteAddress);
  
  let userId = null;
  let currentRoom = null;
  
  // 接收消息
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      console.log('📨 收到:', message);
      
      // 根据消息类型处理
      switch(message.type) {
        case 'join':
          // 加入房间
          userId = message.user;
          currentRoom = message.room;
          
          if (!rooms.has(currentRoom)) {
            rooms.set(currentRoom, new Set());
          }
          rooms.get(currentRoom).add(ws);
          clients.set(userId, ws);
          
          // 通知房间内其他人
          broadcast(currentRoom, {
            type: 'user-joined',
            user: userId
          }, ws);
          break;
          
        case 'message':
          // 广播消息给房间内所有人
          broadcast(currentRoom, {
            type: 'message',
            user: userId,
            content: message.content,
            timestamp: Date.now()
          });
          break;
          
        case 'typing':
          // 发送"正在输入"状态
          broadcast(currentRoom, {
            type: 'typing',
            user: userId
          }, ws);
          break;
      }
    } catch (err) {
      console.error('处理消息错误:', err);
    }
  });
  
  // 客户端断开连接
  ws.on('close', () => {
    console.log('👋 客户端断开:', userId);
    
    // 清理
    if (currentRoom && rooms.has(currentRoom)) {
      rooms.get(currentRoom).delete(ws);
    }
    if (userId) {
      clients.delete(userId);
      
      // 通知其他人
      broadcast(currentRoom, {
        type: 'user-left',
        user: userId
      });
    }
  });
  
  // 错误处理
  ws.on('error', (error) => {
    console.error('WebSocket 错误:', error);
  });
  
  // 心跳检测（保持连接活跃）
  const interval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.ping();
    }
  }, 30000); // 每30秒 ping 一次
  
  ws.on('close', () => {
    clearInterval(interval);
  });
});

// 广播函数
function broadcast(room, message, exclude = null) {
  if (!rooms.has(room)) return;
  
  const data = JSON.stringify(message);
  rooms.get(room).forEach((client) => {
    if (client !== exclude && client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

// 启动服务器
server.listen(3001, () => {
  console.log('🚀 WebSocket 服务器运行在 ws://localhost:3001');
});
```

---

## 🎯 实际应用场景

### 1. **聊天应用** 💬
```
Slack、Discord、WhatsApp Web、微信网页版

功能：
- 实时消息传递
- 用户在线状态
- 输入提示（"正在输入..."）
- 消息已读回执
- 实时通知
```

### 2. **协作编辑** 📝
```
Google Docs、Notion、Figma、石墨文档

功能：
- 多人同时编辑同一文档
- 实时显示其他用户光标位置
- 同步文档变更
- 版本冲突解决
```

### 3. **在线游戏** 🎮
```
多人在线游戏、棋牌游戏

功能：
- 玩家位置同步
- 游戏状态实时更新
- 对战匹配
- 实时排行榜
```

### 4. **金融交易** 📈
```
股票交易平台、加密货币交易所

功能：
- 实时股价更新
- 交易通知
- 市场深度数据
- K线实时绘制
```

### 5. **直播平台** 📺
```
B站、YouTube、Twitch

功能：
- 实时弹幕
- 礼物特效
- 观众互动
- 在线人数统计
```

### 6. **物联网（IoT）** 🏠
```
智能家居、工业监控

功能：
- 设备状态实时监控
- 远程控制
- 传感器数据流
- 告警推送
```

### 7. **社交媒体** 📱
```
Twitter、Facebook、Instagram

功能：
- 实时通知
- 在线状态
- 动态更新
- 直播评论
```

---

## 🔧 React 中使用 WebSocket

### 基础实现

```tsx
import { useEffect, useState, useRef } from 'react';

function ChatComponent() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef(null);

  useEffect(() => {
    // 建立连接
    ws.current = new WebSocket('ws://localhost:3001');
    
    // 连接成功
    ws.current.onopen = () => {
      console.log('✅ 连接成功');
      setIsConnected(true);
    };
    
    // 接收消息
    ws.current.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      setMessages(prev => [...prev, newMessage]);
    };
    
    // 连接关闭
    ws.current.onclose = () => {
      console.log('🔌 连接关闭');
      setIsConnected(false);
    };
    
    // 清理函数：组件卸载时关闭连接
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const sendMessage = () => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        content: input,
        timestamp: Date.now()
      }));
      setInput('');
    }
  };

  return (
    <div>
      <div className="status">
        状态: {isConnected ? '🟢 在线' : '🔴 离线'}
      </div>
      
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i}>
            <strong>{msg.user}:</strong> {msg.content}
          </div>
        ))}
      </div>
      
      <input 
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        placeholder="输入消息..."
      />
      <button onClick={sendMessage} disabled={!isConnected}>
        发送
      </button>
    </div>
  );
}
```

### 封装成自定义 Hook

```tsx
// hooks/useWebSocket.ts
import { useEffect, useRef, useState } from 'react';

export function useWebSocket(url: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // 创建连接
    ws.current = new WebSocket(url);
    
    ws.current.onopen = () => {
      console.log('✅ WebSocket 连接成功');
      setIsConnected(true);
    };
    
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages(prev => [...prev, data]);
    };
    
    ws.current.onclose = () => {
      console.log('🔌 WebSocket 连接关闭');
      setIsConnected(false);
    };
    
    ws.current.onerror = (error) => {
      console.error('❌ WebSocket 错误:', error);
    };
    
    // 清理
    return () => {
      ws.current?.close();
    };
  }, [url]);

  // 发送消息
  const send = (data: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(data));
      return true;
    }
    return false;
  };

  // 清空消息
  const clearMessages = () => {
    setMessages([]);
  };

  return { 
    isConnected, 
    messages, 
    send,
    clearMessages
  };
}

// 使用示例
function Chat() {
  const { isConnected, messages, send } = useWebSocket('ws://localhost:3001');
  const [input, setInput] = useState('');
  
  const handleSend = () => {
    if (send({ text: input, user: 'John' })) {
      setInput('');
    }
  };
  
  return (
    <div>
      <div>状态: {isConnected ? '🟢 在线' : '🔴 离线'}</div>
      
      <div>
        {messages.map((msg, i) => (
          <div key={i}>{msg.text}</div>
        ))}
      </div>
      
      <input 
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={handleSend}>发送</button>
    </div>
  );
}
```

---

## ⚡ WebSocket 状态码

WebSocket 有 4 个连接状态：

```javascript
WebSocket.CONNECTING  // 0 - 连接中
WebSocket.OPEN        // 1 - 已连接，可以通信
WebSocket.CLOSING     // 2 - 连接正在关闭
WebSocket.CLOSED      // 3 - 连接已关闭或未能建立

// 使用示例
const ws = new WebSocket('ws://localhost:3001');

console.log(ws.readyState); // 0 (CONNECTING)

ws.onopen = () => {
  console.log(ws.readyState); // 1 (OPEN)
  
  if (ws.readyState === WebSocket.OPEN) {
    ws.send('Hello Server!');
  }
};
```

### 常用关闭码

| 关闭码 | 含义 | 说明 |
|--------|------|------|
| 1000 | Normal Closure | 正常关闭 |
| 1001 | Going Away | 浏览器导航到其他页面 |
| 1002 | Protocol Error | 协议错误 |
| 1003 | Unsupported Data | 不支持的数据类型 |
| 1006 | Abnormal Closure | 异常关闭（连接中断） |
| 1008 | Policy Violation | 违反策略 |
| 1009 | Message Too Big | 消息太大 |
| 1011 | Internal Error | 服务器内部错误 |

```javascript
// 主动关闭连接
ws.close(1000, 'User logged out');
```

---

## 🔒 WebSocket 安全

### WSS（WebSocket Secure）

```javascript
// ❌ 不安全（明文传输）
const ws = new WebSocket('ws://example.com');

// ✅ 安全（TLS/SSL 加密）
const ws = new WebSocket('wss://example.com');
```

**类似于：**
- HTTP → HTTPS
- WS → WSS

### 认证方式

#### 方式1：通过 URL 传递 Token

```javascript
const token = localStorage.getItem('authToken');
const ws = new WebSocket(`wss://api.example.com?token=${token}`);
```

#### 方式2：连接后发送认证消息

```javascript
const ws = new WebSocket('wss://api.example.com');

ws.onopen = () => {
  // 发送认证消息
  ws.send(JSON.stringify({
    type: 'auth',
    token: authToken
  }));
};

// 服务器验证后回复
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'auth-success') {
    console.log('✅ 认证成功');
  }
};
```

#### 方式3：通过 HTTP Headers（在握手阶段）

```javascript
// 浏览器不支持自定义 headers，需要服务器配合
// 通常在服务器端 WebSocket 客户端使用
const ws = new WebSocket('wss://api.example.com', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

## 📊 WebSocket 性能优势

### 性能对比

```
场景：1000 个用户的聊天室，每秒 10 条消息

传统 HTTP 轮询（每秒请求1次）：
─────────────────────────────────────────
请求数量: 1000 用户 × 1 请求/秒 = 1000 请求/秒
请求头大小: ~800 bytes/请求
总带宽: 1000 × 800 bytes = 800 KB/秒
99% 的请求返回 "无新数据"

WebSocket：
─────────────────────────────────────────
连接数: 1000 个持久连接
消息数: 10 条/秒
消息大小: ~100 bytes/条
总带宽: 10 × 100 bytes = 1 KB/秒
只在有数据时传输
```

**对比结果：**
- ✅ WebSocket 节省 **99.9%** 的带宽
- ✅ 减少 **99%** 的服务器负载
- ✅ 延迟从 **500ms → 50ms**

---

## 🆚 其他实时技术对比

| 技术 | 通信方向 | 连接方式 | 延迟 | 复杂度 | 适用场景 |
|------|---------|---------|------|--------|---------|
| **WebSocket** | 双向 | 持久连接 | 极低 | 中等 | 聊天、游戏、协作 |
| **轮询（Polling）** | 单向 | 反复请求 | 高 | 简单 | 不需要实时的数据 |
| **长轮询（Long Polling）** | 单向 | 长时间请求 | 中等 | 中等 | 通知系统 |
| **SSE** | 单向 | 持久连接 | 低 | 简单 | 新闻推送、股票价格 |

### 轮询（Polling）

```javascript
// ❌ 轮询 - 浪费资源
setInterval(() => {
  fetch('/api/messages')
    .then(res => res.json())
    .then(data => {
      if (data.newMessages) {
        updateUI(data);
      }
    });
}, 1000); // 每秒请求一次

// 问题：
// - 99% 的请求返回 "无新数据"
// - 浪费带宽和服务器资源
// - 有延迟（最多1秒）
```

### Server-Sent Events (SSE)

```javascript
// SSE - 服务器单向推送
const eventSource = new EventSource('/api/stream');

eventSource.onmessage = (event) => {
  console.log('收到:', event.data);
};

// 优点：
// - 简单（基于 HTTP）
// - 自动重连
// 缺点：
// - 只能服务器 → 客户端（单向）
```

### WebSocket

```javascript
// ✅ WebSocket - 高效实时双向
const ws = new WebSocket('wss://api.example.com');

// 服务器推送
ws.onmessage = (event) => {
  updateUI(JSON.parse(event.data));
};

// 客户端发送
ws.send(JSON.stringify({ message: 'Hello' }));

// 优点：
// - 真正的双向通信
// - 极低延迟
// - 高效（只在有数据时传输）
```

---

## 🛠️ 常用 WebSocket 库

### 1. **Socket.io**（最流行）⭐⭐⭐⭐⭐

```javascript
// 安装
npm install socket.io socket.io-client

// 服务器端
const io = require('socket.io')(3001, {
  cors: { origin: '*' }
});

io.on('connection', (socket) => {
  console.log('新连接:', socket.id);
  
  socket.on('chat-message', (msg) => {
    // 广播给所有人
    io.emit('chat-message', msg);
  });
  
  socket.on('disconnect', () => {
    console.log('断开:', socket.id);
  });
});

// 客户端
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

socket.on('connect', () => {
  console.log('连接成功');
});

socket.on('chat-message', (msg) => {
  displayMessage(msg);
});

socket.emit('chat-message', { text: 'Hello' });
```

**特点：**
- ✅ 自动重连
- ✅ 房间（Rooms）和命名空间（Namespaces）
- ✅ 广播和私聊
- ✅ 自动降级（WebSocket → 轮询）

### 2. **ws**（轻量级）⭐⭐⭐⭐

```javascript
// 安装
npm install ws

// 服务器
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    console.log('收到:', data);
  });
});

// 客户端（原生 WebSocket）
const ws = new WebSocket('ws://localhost:8080');
```

**特点：**
- ✅ 轻量（无额外依赖）
- ✅ 性能高
- ❌ 功能简单，需要自己实现很多功能

### 3. **SockJS**（兼容性好）⭐⭐⭐

```javascript
// 提供 WebSocket 降级方案
// WebSocket → XHR Streaming → XHR Polling

const sock = new SockJS('http://example.com/socket');
```

### 4. **Pusher**（托管服务）⭐⭐⭐⭐⭐

```javascript
// 不需要自己管理 WebSocket 服务器
const pusher = new Pusher(KEY, { cluster: 'ap3' });
const channel = pusher.subscribe('chat');

channel.bind('message', (data) => {
  console.log(data);
});
```

---

## 🎓 WebSocket 最佳实践

### 1. **自动重连**

```javascript
class ReconnectingWebSocket {
  constructor(url) {
    this.url = url;
    this.reconnectInterval = 3000;
    this.connect();
  }
  
  connect() {
    this.ws = new WebSocket(this.url);
    
    this.ws.onopen = () => {
      console.log('✅ 连接成功');
      this.reconnectInterval = 3000; // 重置重连间隔
    };
    
    this.ws.onclose = () => {
      console.log('🔄 连接关闭，3秒后重连...');
      setTimeout(() => {
        this.connect();
      }, this.reconnectInterval);
      
      // 指数退避（避免频繁重连）
      this.reconnectInterval = Math.min(
        this.reconnectInterval * 1.5, 
        30000
      );
    };
    
    this.ws.onmessage = (event) => {
      this.onMessage?.(JSON.parse(event.data));
    };
  }
  
  send(data) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }
}

// 使用
const ws = new ReconnectingWebSocket('ws://localhost:3001');
ws.onMessage = (data) => {
  console.log('收到消息:', data);
};
```

### 2. **心跳检测**

```javascript
// 客户端
const ws = new WebSocket('ws://localhost:3001');
let heartbeatTimer;

ws.onopen = () => {
  // 每30秒发送心跳
  heartbeatTimer = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'ping' }));
    }
  }, 30000);
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  if (data.type === 'pong') {
    console.log('🏓 服务器响应心跳');
  }
};

ws.onclose = () => {
  clearInterval(heartbeatTimer);
};
```

### 3. **消息队列**

```javascript
// 处理网络不稳定时的消息
class WebSocketWithQueue {
  constructor(url) {
    this.url = url;
    this.messageQueue = [];
    this.connect();
  }
  
  connect() {
    this.ws = new WebSocket(this.url);
    
    this.ws.onopen = () => {
      // 连接成功，发送队列中的消息
      while (this.messageQueue.length > 0) {
        const msg = this.messageQueue.shift();
        this.ws.send(msg);
      }
    };
  }
  
  send(data) {
    const message = JSON.stringify(data);
    
    if (this.ws.readyState === WebSocket.OPEN) {
      // 直接发送
      this.ws.send(message);
    } else {
      // 加入队列，等连接恢复后发送
      this.messageQueue.push(message);
    }
  }
}
```

### 4. **错误处理和日志**

```javascript
function createWebSocket(url) {
  const ws = new WebSocket(url);
  
  ws.onopen = () => {
    console.log(`[${new Date().toISOString()}] ✅ 连接成功`);
  };
  
  ws.onerror = (error) => {
    console.error(`[${new Date().toISOString()}] ❌ 错误:`, error);
    
    // 发送错误到监控系统
    sendToMonitoring({
      type: 'websocket-error',
      url,
      error: error.message
    });
  };
  
  ws.onclose = (event) => {
    console.log(`[${new Date().toISOString()}] 🔌 关闭:`, {
      code: event.code,
      reason: event.reason,
      wasClean: event.wasClean
    });
  };
  
  return ws;
}
```

---

## 🚀 Supabase Realtime（基于 WebSocket）

Supabase 的实时功能就是建立在 WebSocket 之上的！

```typescript
// Supabase 内部使用 WebSocket
const channel = supabase
  .channel('room1')
  .on('postgres_changes', 
    { event: 'INSERT', table: 'messages' },
    (payload) => {
      console.log('新消息:', payload.new);
    }
  )
  .subscribe();

// 底层实现：
// 1. 建立 WebSocket 连接到 Supabase Realtime 服务器
// 2. 订阅 PostgreSQL 的变更通知
// 3. 数据库有变化 → WebSocket 推送给客户端
```

**Supabase Realtime 架构：**
```
PostgreSQL 数据库
      ↓
  WAL (Write-Ahead Log)
      ↓
Supabase Realtime Server (监听 WAL)
      ↓
  WebSocket 连接
      ↓
   浏览器客户端
```

---

## 💡 何时使用 WebSocket？

### ✅ 适合使用 WebSocket

1. **需要实时双向通信**
   - 聊天、协作编辑
   
2. **服务器需要主动推送**
   - 实时通知、告警
   
3. **频繁的数据交换**
   - 游戏、交易平台
   
4. **低延迟要求**
   - 视频会议、直播

### ❌ 不适合使用 WebSocket

1. **简单的数据获取**
   - 用 REST API 就够了
   
2. **不需要实时更新**
   - 静态内容、定期更新的数据
   
3. **单向推送就够了**
   - 用 Server-Sent Events (SSE)
   
4. **偶尔的更新**
   - HTTP 轮询可能更简单

---

## 🔍 调试 WebSocket

### Chrome DevTools

```
1. 打开开发者工具 (F12)
2. 切换到 "Network" 标签
3. 过滤 "WS"（WebSocket）
4. 点击连接查看：
   - 消息内容
   - 时间轴
   - 连接状态
```

### 日志输出

```javascript
const ws = new WebSocket('ws://localhost:3001');

// 详细日志
ws.addEventListener('open', (event) => {
  console.log('🟢 OPEN', event);
});

ws.addEventListener('message', (event) => {
  console.log('📩 MESSAGE', event.data);
});

ws.addEventListener('error', (event) => {
  console.log('🔴 ERROR', event);
});

ws.addEventListener('close', (event) => {
  console.log('⚫ CLOSE', {
    code: event.code,
    reason: event.reason,
    wasClean: event.wasClean
  });
});
```

---

## 📚 总结

### WebSocket 的核心价值

1. **实时性** - 延迟低至 50ms 以下
2. **高效性** - 节省 99% 的带宽
3. **双向性** - 服务器和客户端都能主动发送
4. **持久性** - 一次连接，持续使用

### 关键概念

- **全双工通信** - 双向同时通信
- **持久连接** - 不需要反复握手
- **事件驱动** - 基于事件的异步编程
- **二进制支持** - 可以传输文本和二进制数据

### 一句话总结

**WebSocket 让浏览器和服务器能够像打电话一样持续、实时、双向地交流！** ☎️

---

**文档创建时间：** 2024年11月30日  
**适用版本：** WebSocket Protocol (RFC 6455)  
**作者：** AI Assistant

