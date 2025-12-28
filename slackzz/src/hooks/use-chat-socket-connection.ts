"use client";
import { useSocket } from "@/providers/web-socket";
import { useQueryClient } from "@tanstack/react-query";
import { MessageWithUser } from "@/types/app";
import { useEffect } from "react";

type UseChatSocketConnection = {
  addKey: string;
  queryKey: string;
  updateKey: string;
  paramValue: string;
};

export const useChatSocketConnection = ({
  addKey,
  queryKey,
  updateKey,
  paramValue,
}: UseChatSocketConnection) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  const handleUpdateMessage = (message: any) => {
    {
      /** 更新queryClient中的数据
            [queryKey, paramValue]：定位缓存
            (prev: any) => { ... }：更新函数
            prev 是react query的内部缓存数据
            */
    }
    queryClient.setQueryData([queryKey, paramValue], (prev: any) => {
      {
        /** 如果prev为空，或者prev.pages为空，或者prev.pages.length为0，则返回prev */
      }
      if (!prev || !prev.pages || !prev.pages.length) return prev;

      {
        /** 遍历prev.pages，并更新每个page中的data */
      }
      const newData = prev.pages.map((page: any) => ({
        ...page,
        data: page.data.map((data: MessageWithUser) => {
          {
            /** 如果data.id与传进来的message.id相同，则更新data */
          }
          if (data.id === message.id) {
            return message;
          }
          return data;
        }),
      }));

      return {
        ...prev,
        pages: newData,
      };
    });
  };

  const handleNewMessage = (message: MessageWithUser) => {
    queryClient.setQueryData([queryKey, paramValue], (prev: any) => {
      if (!prev || !prev.pages || !prev.pages.length) return prev;

      {
        /** 创建一个新的页面数组（浅拷贝缓存中的pages数组），并更新newPages[0].data（第一个页面的data） */
      }
      const newPages = [...prev.pages];
      newPages[0] = {
        ...newPages[0],
        data: [message, ...newPages[0].data],
      };

      return {
        ...prev,
        pages: newPages,
      };
    });
  };

  {
    /** 使用useEffect监听socket连接状态，并注册事件处理函数
        对于频道（Channel）
        addKey = `${queryKey}:channel-messages`
        对于私信（DirectMessage）
        addKey = `direct_message:post`

        updateKey = `${queryKey}:channel-messages:update`
        updateKey = `direct_message:update`
        */
  }
  useEffect(() => {
    if (!socket) return;

    socket.on(addKey, handleNewMessage);
    socket.on(updateKey, handleUpdateMessage);

    return () => {
      socket.off(addKey, handleNewMessage);
      socket.off(updateKey, handleUpdateMessage);
    };
  }, [socket, addKey, updateKey, queryKey, queryClient]);
};
