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
  const path = "api/web-socket/io";
  return new SocketServer(httpServer, {
    path,
    addTrailingSlash: false,
  });
};

const handler = async (req: NextApiRequest, res: SocketIoApiResponse) => {
  {/** 如果服务器端不存在socket实例，则初始化一个 
    实例挂载在res.socket.server.io上， 这样所有路由都能访问到，不会每次都new一个总机
    websocket是“实时传递”，数据库是“持久保存”。聊天必须保存在数据库，不然刷新页面就没了
    */}
  if (!res.socket.server.io) {
    res.socket.server.io = initializedSocketServer(
      res.socket.server.io as unknown as NetServer
    );
  }

  res.end();
};

export default handler;
