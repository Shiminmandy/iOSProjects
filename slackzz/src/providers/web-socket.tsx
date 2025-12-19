'use client'

import { createContext, useContext, useState, useEffect, FC, ReactNode } from 'react';
import {io as ClientIO, Socket } from 'socket.io-client';


{/**
    创建一个websocket链接的全局provider，让应用中的任何组件都能：
        1. 访问websocket链接实例
        2. 知道当前是否已连接
        3. 发送和接收实时消息
    websocket只能在浏览器中运行， 不能在服务端
    react context 是全局状态
    useEffect作用是处理副作用（建立连接） 
    全站只需要一条连接，只初始化一次，任何组件想接收消息/发消息都能拿到同一个socket   
    
*/}

{/* 定义context类型， 包含socket实例和连接状态 */}
type SocketContextType = {
    socket: Socket | null;       // websocket链接实例
    isConnected: boolean;        // 是否已连接
}

{/*用于在组件树中共享websocket状态的context， 默认未连接*/}
export const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
});

{/* 自定义hook， 其他组可以方便获取socket和连接状态*/}
export const useSocket = () => useContext(SocketContext);

{/**
    WebSocketProvider组件是全局provider， 它会在应用挂载时创建websocket连接， 写入context内容

    */}
export const WebSocketProvider: FC<{children: ReactNode}> = ({
    children
}) => {

    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        {/* 获取服务器URL， 必须在浏览器环境中运行 */}
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

        {/* 如果URL未定义， 打印错误并返回 */}
        if (!siteUrl) {
            console.log('NEXT_PUBLIC_SITE_URL is not defined');
            return;
        }

        {/* 创建socket实例， 使用ClientIO库 */}
        const socketInstance = ClientIO(siteUrl,{
            path: '/api/web-socket/io',
        });

        {/* 监听连接成功事件
            当socket状态变化时，Socket.io会自动触发 */}
        socketInstance.on('connect', () => {
            setIsConnected(true);
        });

        {/* 监听连接断开事件 */}
        socketInstance.on('disconnect', () => {
            setIsConnected(false);
        });

        {/* 保存socket实例到状态 */}
        setSocket(socketInstance);

        {/* 清理函数， 组件卸载时断开连接 */}
        return () => {
            socketInstance.disconnect();
        };

        {/* 只在组件挂载时运行一次 */}
    }, [])

    return <SocketContext.Provider value={{ socket, isConnected }}>
        {children}
    </SocketContext.Provider>
};