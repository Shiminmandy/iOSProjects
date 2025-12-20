import React, { FC } from 'react'
import { User, Workspace, Channel } from '@/types/app';
import { useChatFetcher } from '@/hooks/use-chat-fetcher';

type ChatMessagesProps = {
    userData: User;
    name: string;
    chatId: string;
    apiUrl: string;
    socketUrl: string;
    socketQuery: Record<string, string>;
    paramKey: 'channelId' | 'recipientId';
    paramValue: string;
    type: 'Channel' | 'DirectMessage';
    workspaceData: Workspace;
    channelData?: Channel;

}

const ChatMessages:FC<ChatMessagesProps> = ({
    userData,
    name,
    chatId,
    apiUrl,
    socketUrl,
    socketQuery,
    paramKey,
    paramValue,
    type,
    workspaceData,
    channelData,
}) => {

    const queryKey = 
        type === 'Channel' ? `channel:${chatId}` : `direct_message:${chatId}`;

    {/** 这些全都是 React Query 的 useInfiniteQuery 自带的返回值 */}
    const {data, status, fetchNextPage, hasNextPage, isFetchingNextPage} =
     useChatFetcher({
        queryKey,
        apiUrl,
        paramKey,
        paramValue,
        pageSize: 10,
    });

  return (


    <div>chat-messages</div>
  )
}

export default ChatMessages