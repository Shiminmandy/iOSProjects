'use client'

import React, { FC } from 'react'
import { Workspace, Channel, User } from '@/types/app'
import { StringValidation } from 'zod/v3';
import Sidebar from './sidebar';
import InfoSection from './info-section';
import ChatHeader from './chat-header';
import Typography from './ui/typography';
import TextEditor from './text-editor';


type ChatGroupProps = {
    type: 'Channel' | 'DirectMessage';
    socketUrl: string;
    apiUrl: string;
    headerTitle: string;
    chatId: string;
    socketQuery: Record<string, string>;
    paramKey: "channelId" | "recipientId";
    paramValue: string;
    userData: User;
    currentWorkspaceData: Workspace;
    userWorkspaceData: Workspace[];
    userWorkspaceChannels: Channel[];
    currentChannelData: Channel | undefined;
    slug: string;
}

const ChatGroup: FC<ChatGroupProps> = ({
    type,
    socketUrl,
    apiUrl,
    headerTitle,
    chatId,
    socketQuery,
    paramKey,
    paramValue,
    userData,
    currentWorkspaceData,
    userWorkspaceData,
    userWorkspaceChannels,
    currentChannelData,
    slug,
}) => {
    return (
        <div>
            <div className='h-[calc(100vh-256px)]  overflow-y-auto [&::-webkit-scrollbar-thumb]:rounded-[6px] [&::-webkit-scrollbar-thumb]:bg-foreground/60 [&::-webkit-scrollbar-track:bg-none [&::-webkit-scrollbar]:w-2'>
                <Sidebar
                    currentWorkspaceData={currentWorkspaceData}
                    userData={userData}
                    userWorkspacesData={userWorkspaceData as Workspace[]}
                />

                <InfoSection
                    userData={userData}
                    currentWorkspaceData={currentWorkspaceData}
                    userWorkspaceChannels={userWorkspaceChannels}
                    currentChannelId={
                        type === 'Channel' ? currentChannelData?.id : undefined
                    }
                />

                <div className='p-4 relative w-full overflow-hidden'>
                    <ChatHeader title={headerTitle} chatId={chatId} userData={userData} />

                    <div className='mt-10'>
                        <Typography text='Chat Content' variant='h4' />
                    </div>
                </div>
            </div>

            <div className='m-4'>
                <TextEditor
                    apiUrl={socketUrl}
                    type={type}
                    channel={currentChannelData}
                    workspaceData={currentWorkspaceData}
                    userData={userData} />
                    recipientId={type === 'DirectMessage' ? chatId : undefined}
            </div>
        </div>
    )
}

export default ChatGroup   