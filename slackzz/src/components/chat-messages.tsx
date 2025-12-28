import React, { FC, useRef } from 'react'
import { User, Workspace, Channel } from '@/types/app';
import { useChatFetcher } from '@/hooks/use-chat-fetcher';
import DotAnimatedLoader from './dot-animated-loader';
import ChatItem from './chat-item';
import { format } from 'date-fns';
import { useChatSocketConnection } from '@/hooks/use-chat-socket-connection';
import { useChatScrollHandler } from '@/hooks/use-chat-scroll-handler';
import { IntroBanner } from './intro-banner';
import { Button } from './ui/button';


const DATE_FORMAT = 'MMM d, yyyy HH:mm';
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

const ChatMessages: FC<ChatMessagesProps> = ({
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

  const chatRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const queryKey =
    type === 'Channel' ? `channel:${chatId}` : `direct_message:${chatId}`;

  {/** 这些全都是 React Query 的 useInfiniteQuery 自带的返回值 */ }
  const { data, status, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useChatFetcher({
      queryKey,
      apiUrl,
      paramKey,
      paramValue,
      pageSize: 10,
    });

  {/** 使用useChatSocketConnection hook 监听socket连接状态，并注册事件处理函数,没有返回值 */ }
  useChatSocketConnection({
    queryKey,
    addKey:
      type === 'Channel'
        ? `${queryKey}: channel-messages`
        : `direct_message:post`,
    updateKey:
      type === 'Channel'
        ? `${queryKey}: channel-messages:update`
        : ` direct-messages:update`,
    paramValue,

  })

  useChatScrollHandler({
    chatRef,
    bottomRef,
    count: data?.pages?.[0].data?.length ?? 0,
  })

  if (status === 'pending') {
    return <DotAnimatedLoader />
  }

  if (status === 'error') {
    return <div>Error Occured</div>
  }

  const renderMessages = () =>

    data.pages.map(page =>
      page.data.map(message => (
        <ChatItem
          key={message.id}
          id={message.id}
          content={message.content}
          user={message.user_id}
          timestamp={format(new Date(message.created_at), DATE_FORMAT)}
          fileUrl={message.file_url}
          deleted={message.is_deleted}
          currentUser={userData}
          isUpdated={message.updated_at !== message.created_at}
          socketUrl={socketUrl}
          socketQuery={socketQuery}
          channelData={channelData}
        />
      ))
    )

  return (


    <div className='flex-1 flex flex-col py-4 overflow-y-auto'>
      {!hasNextPage && (
        <IntroBanner
          type={type}
          name={name}
          creationDate={channelData?.created_at!}
        />
      )}
      {hasNextPage && (
        <div className='flex justify-center'>
          {isFetchingNextPage ? (
            <DotAnimatedLoader /> 
          ) : (
            <Button variant='link' onClick={() => fetchNextPage()}>
            Load previous messages
            </Button>
          )}
        </div>
      )}
      <div className='flex flex-col-reverse mt-auto'>
        {renderMessages()}
      </div>
      <div ref={bottomRef} />

    </div>
  )
}

export default ChatMessages