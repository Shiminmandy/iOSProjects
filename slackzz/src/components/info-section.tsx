'use client'

import { useColorPreferences } from "@/providers/color-preferences";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { useState } from "react";
import { FaArrowDown, FaArrowUp, FaPlus } from "react-icons/fa";
import Typography from "./ui/typography";
import CreateChannelDialog from "./create-channel-dialog";
import { FC } from "react";
import { User } from "@/types/app";
import { Workspace } from "@/types/app";


const InfoSection:FC<{
  userData: User;
  currentWorkspaceData: Workspace;
}> = ({ userData, currentWorkspaceData }) => {

  const { color } = useColorPreferences();

  let backgroundColor = 'bg-primary-light';
  // 根据color的值，设置不同的背景颜色
  if (color === 'green') {
    backgroundColor = 'bg-green-900';
  } else if (color === 'blue') {
    backgroundColor = 'bg-blue-900';
  }

  let hoverBg = 'hover:bg-primary-dark';
  // 根据color的值，设置不同的背景颜色
  if (color === 'green') {
    hoverBg = 'hover:bg-green-900';
  } else if (color === 'blue') {
    hoverBg = 'hover:bg-blue-900';
  }

  let secondayBg = 'bg-primary-dark';

  const [isChannelCollapsed, setIsChannelCollapsed] = useState(false);
  const [isDirectMessagesCollapsed, setIsDirectMessagesCollapsed] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div
      className={cn('fixed text-white left-20 rounded-l-xl md:w-52 lg:w-[350px] h-[calc(100%-63px)] z-20 flex flex-col items-center',
        backgroundColor
      )}
    >

      {/** Channels section */}
      <div className='w-full flex flex-col gap-2 p-3 bg-red-500'>
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
              <Typography
                variant='p'
                text='# channerl-name-1'
                className={cn('px-2 py-1 rounded-sm cursor-pointer', hoverBg)}
              />

              <Typography
                variant='p'
                text='# channerl-name-2'
                className={cn('px-2 py-1 rounded-sm cursor-pointer', hoverBg)}
              />

              <Typography
                variant='p'
                text='# channerl-name-3'
                className={cn('px-2 py-1 rounded-sm cursor-pointer', hoverBg)}
              />
            </CollapsibleContent>
          </Collapsible>

          <Collapsible
            open={isDirectMessagesCollapsed}
            onOpenChange={() => setIsDirectMessagesCollapsed(prevState => !prevState)}
            className='flex flex-col gap-2'
          >
            <div className='flex items-center justify-between'>
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
              <Typography
                variant='p'
                text='User Name 1'
                className={cn('px-2 py-1 rounded-sm cursor-pointer', hoverBg)}
              />

              <Typography
                variant='p'
                text='User Name 2'
                className={cn('px-2 py-1 rounded-sm cursor-pointer', hoverBg)}
              />

              <Typography
                variant='p'
                text='User Name 3'
                className={cn('px-2 py-1 rounded-sm cursor-pointer', hoverBg)}
              />
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