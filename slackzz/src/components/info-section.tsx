'use client'

import { useColorPreferences } from "@/providers/color-preferences";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { useState } from "react";
import { FaArrowDown, FaArrowUp, FaPlus } from "react-icons/fa";
import Typography from "./ui/typography";
import CreateChannelDialog from "./create-channel-dialog";
import { FC } from "react";
import { Channel, User } from "@/types/app";
import { Workspace } from "@/types/app";
import { useRouter } from "next/navigation";

/**
 * 声明一个名为info section的常量，是一个函数组件function component
 *  接受两个props参数，userData和currentWorkspaceData（此时只是类型声明）
 * 使用箭头函数定义组件，并返回一个div元素
 * 通过destructing结构出userData和currentWorkspaceData两个属性
 */
const InfoSection: FC<{
  userData: User;
  currentWorkspaceData: Workspace;
  userWorkspaceChannels: Channel[];
  currentChannelId: string | undefined;
}> = ({ userData, currentWorkspaceData, userWorkspaceChannels, currentChannelId }) => {

  const { color } = useColorPreferences();

  let backgroundColor = 'bg-primary-light';
  // 根据color的值，设置不同的背景颜色
  if (color === 'green') {
    backgroundColor = 'bg-green-900';
  } else if (color === 'blue') {
    backgroundColor = 'bg-blue-900';
  }

  let secondayBg = 'bg-primary-dark'; // secondary background color
  // 根据color的值，设置不同的背景颜色
  if (color === 'green') {
    secondayBg = 'bg-green-700';
  } else if (color === 'blue') {
    secondayBg = 'bg-blue-700';
  }



  const router = useRouter();

  const navigationToChannel = (channelId: string) => {
    const url = `/workspace/${currentWorkspaceData.id}/channels/${channelId}`;
    router.push(url);
  }

  const navigationToDirectMessage = (memberId: string) => {
    const url = `/workspace/${currentWorkspaceData.id}/direct-message/${memberId}`;
    router.push(url);
  }

  const [isChannelCollapsed, setIsChannelCollapsed] = useState(true);
  const [isDirectMessagesCollapsed, setIsDirectMessagesCollapsed] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);



  return (
    <div
      className={cn('fixed text-white left-20 rounded-l-xl md:w-52 lg:w-[350px] h-[calc(100%-63px)] z-20 flex flex-col items-center',
        backgroundColor
      )}
    >

      {/** Channels section */}
      <div className='w-full flex flex-col gap-2 p-3 '>
        <div>
          <Collapsible
            open={isChannelCollapsed}
            onOpenChange={() => setIsChannelCollapsed(prevState => !prevState)}
            className='flex flex-col gap-2'
          >
            <div className='flex items-center justify-between'>
              <CollapsibleTrigger className='flex items-center gap-2'>
                {isChannelCollapsed ? <FaArrowDown /> : <FaArrowUp />}
                <Typography variant='p' text='Channels' className='font-bold' />
              </CollapsibleTrigger>
              <div
                className={cn(
                  'cursor-pointer p-2 rounded-full',
                  `hover:${secondayBg}`,
                )}
              >
                <FaPlus onClick={() => { setDialogOpen(true) }} />
              </div>
            </div>
            <CollapsibleContent>

              {userWorkspaceChannels.map((channel) => {

                const activeChannel = currentChannelId === channel.id
                return (
                  <Typography
                    key={channel.id}
                    variant='p'
                    text={`# ${channel.name}`}
                    className={cn('px-2 py-1 rounded-sm cursor-pointer', `hover:${secondayBg}`, activeChannel && secondayBg)}
                    onClick={() => navigationToChannel(channel.id)}
                  />
                );
              })}
            </CollapsibleContent>
          </Collapsible>

          <Collapsible
            open={isDirectMessagesCollapsed}
            onOpenChange={() => setIsDirectMessagesCollapsed(prevState => !prevState)}
            className='flex flex-col gap-2'
          >
            <div className='flex items-center justify-between'>
              {/** 触发展开/收起的图标 */}
              <CollapsibleTrigger className='flex items-center gap-2'>
                {isDirectMessagesCollapsed ? <FaArrowDown /> : <FaArrowUp />}
                <Typography variant='p' text='Direct Messages' className='font-bold' />
              </CollapsibleTrigger>
              <div
                className={cn(
                  'cursor-pointer p-2 rounded-full',
                  `hover:${secondayBg}`,
                )}
              >
                <FaPlus onClick={() => { }} />
              </div>
            </div>

            <CollapsibleContent>
              {currentWorkspaceData?.members?.map(member => {

                return (
                  <Typography
                    key={member.id}
                    variant='p'
                    text={member.name || member.email}
                    className={cn('px-2 py-1 rounded-sm cursor-pointer', `hover:${secondayBg}`)}
                    onClick={() => navigationToDirectMessage(member.id)}
                  />
                )
              })}
            </CollapsibleContent>
          </Collapsible>

        </div>
      </div>

      <CreateChannelDialog
        setDialogOpen={setDialogOpen}
        dialogOpen={dialogOpen}
        workspaceId={currentWorkspaceData.id}
        userId={userData.id}
      />
    </div>
  )
}

export default InfoSection;