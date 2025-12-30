/**
 * 关注点分离 （separation of concerns）
 * supabse.ts文件是自动生成的数据库层类型，结构复杂嵌套深，包含数据库关系信息
 * app.ts文件是业务层类型，结构简单，代码中直接应用
 */

import { NextApiResponse } from "next";
import { Server as NetServer, Socket } from "net";
import { Server as SocketIOServer } from "socket.io";

export type User = {
  avatar_url: string;
  channels: string[] | null;
  created_at: string | null;
  email: string;
  id: string;
  is_away: boolean;
  name: string | null;
  phone: string | null;
  type: string | null;
  workspaces: string[] | null;
};

export type Workspace = {
  channels: string[] | null;
  created_at: string;
  id: string;
  image_url: string | null;
  invite_code: string;
  members: User[] | null;
  name: string;
  regulators: string[] | null;
  slug: string;
  super_admin: string;
};

export type Messages = {
  channel_id: string;
  created_at: string;
  file_url: string | null;
  id: string;
  is_deleted: boolean;
  content: string | null;
  updated_at: string;
  user_id: string;
  workspace_id: string | null;
};

export type MessageWithUser = Messages & { user_id: User };

export type Channel = {
  id: string;
  members: string[] | null;
  name: string;
  regulators: string[] | null;
  workspace_id: string;
  user_id: string;
  created_at: string;
};

{/** 
 * Socket.io 响应类型扩展
 * 扩展了 NextApiResponse，添加了 Socket.io 服务器访问能力
 * 
 * 使用示例：
 * res?.socket?.server?.io?.emit('event', data)  // 广播消息
 * 
 * 注意：使用可选链 ?. 确保属性存在时才访问
 */}
export type SocketIoApiResponse = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};
