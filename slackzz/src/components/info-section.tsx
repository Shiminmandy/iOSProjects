'use client'

import { useColorPreferences } from "@/providers/color-preferences";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { useState } from "react";
import { FaArrowDown, FaArrowUp, FaPlus } from "react-icons/fa";
import Typography from "./ui/typography";

const InfoSection = () => {

  const { color } = useColorPreferences();

  let backgroundColor = 'bg-primary-light';
  // 根据color的值，设置不同的背景颜色
  if (color === 'green') {
    backgroundColor = 'bg-green-900';
  } else if (color === 'blue') {
    backgroundColor = 'bg-blue-900';
  }

  let secondayBg = 'bg-primary-dark';

  const [isChannelCollapsed, setIsChannelCollapsed] = useState(false);

  return (
    <div
      className={cn('fixed text-white left-20 rounded-l-xl md:w-52 lg:w-[350px] h-[calc(100%-63px)] z-20 flex flex-col items-center',
        backgroundColor
      )}
    >
      <div className='w-full flex flex-col gap-2 p-3'>
        <div>
          <Collapsible
            open={isChannelCollapsed}
            onOpenChange={() => { }}
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
                <FaPlus onClick={() => {}} />
              </div>
            </div>
            <CollapsibleContent>
             
            </CollapsibleContent>
          </Collapsible>


        </div>
      </div>
    </div>
  )
}

export default InfoSection;