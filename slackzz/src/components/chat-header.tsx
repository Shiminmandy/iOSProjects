'use client'

import React, { FC } from 'react'
import Typography from './ui/typography';
import { IoMdHeadset } from 'react-icons/io';
import { User } from '@/types/app';

type ChatHeaderProp = {
    title: string;
    // chatId: string;
    // userData: User;
}

const ChatHeader: FC<ChatHeaderProp> = ({ title }) => {



    return (
        <div className='absolute  h-10 top-0 left-0 w-full'>
            <div className='h-10 flex items-center justify-between px-4 fixed md:w-[calc(100%-305px)] lg:w-[calc(100%-447px)]   dark:bg-neutral-800 border-b border-b-white/30 shadow-sm'>
                <Typography
                    text={`# ${title}`}
                    variant='h4'
                />

                <IoMdHeadset
                onClick={() => {}}
                size={24}
                className='text-primary cursor-pointer'
                />
            </div>
        </div>
    )
}

export default ChatHeader;       