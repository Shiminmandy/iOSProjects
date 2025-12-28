import { NextApiRequest, NextApiResponse } from "next";
import { Server as NetServer } from "http";
import { Server as SocketServer } from "socket.io";
import { SocketIoApiResponse } from "@/types/app";

{
  /**
    服务端初始化socket.io server实例
    */
}

const initializedSocketServer = (httpServer: NetServer): SocketServer => {
  const path = "/api/web-socket/io";
  return new SocketServer(httpServer, {
    path,
    addTrailingSlash: false,
  });
};

const handler = async (req: NextApiRequest, res: SocketIoApiResponse) => {
  {/** 
    为什么需要这个文件？
    ====================
    
    1. Socket.IO 服务器需要全局单例
    --------------------------------
    - Socket.IO 服务器实例必须在整个应用生命周期中存在
    - 不能每次请求都创建新实例（会丢失连接）
    - 需要挂载在 res.socket.server.io 上，让所有路由都能访问
    
    2. WebSocket vs 数据库的关系
    -----------------------------
    WebSocket（实时传递）：
    - ✅ 实时推送消息给在线用户
    - ✅ 低延迟，即时更新
    - ❌ 数据不持久，刷新页面就没了
    - ❌ 离线用户收不到消息
    
    数据库（持久保存）：
    - ✅ 永久保存所有消息
    - ✅ 刷新页面后可以重新加载
    - ✅ 离线用户上线后可以看到历史消息
    - ❌ 需要主动查询，不是实时的
    
    3. 为什么两者都需要？
    ---------------------
    聊天应用需要：
    - 实时性：在线用户立即看到新消息（WebSocket）
    - 持久性：消息永久保存，刷新后还在（数据库）
    
    工作流程：
    1. 用户发送消息 → 保存到数据库（持久化）
    2. 数据库保存成功 → 通过 WebSocket 广播（实时通知）
    3. 所有在线用户立即收到消息（实时）
    4. 用户刷新页面 → 从数据库重新加载历史消息（持久化）
    
    如果没有数据库：
    - ❌ 刷新页面后消息消失
    - ❌ 离线用户看不到消息
    - ❌ 无法查看历史记录
    
    如果没有 WebSocket：
    - ❌ 需要不断轮询数据库（浪费资源）
    - ❌ 有延迟（最多几秒）
    - ❌ 用户体验差
    
    总结：数据库负责"保存"，WebSocket 负责"实时通知"
    */}
  if (!res.socket.server.io) {
    res.socket.server.io = initializedSocketServer(
      res.socket.server.io as unknown as NetServer
    );
  }

  res.end();
};

export default handler;
