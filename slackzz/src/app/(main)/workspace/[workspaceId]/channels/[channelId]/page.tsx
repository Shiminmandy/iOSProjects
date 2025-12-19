import { getUserData } from '@/actions/get-user-data';
import { getUserWorkspaceChannels } from '@/actions/get-user-workspace-channels';
import { getCurrentWorkspaceData, getUserWorkspaceData } from '@/actions/workspaces';
import InfoSection from '@/components/info-section'
import Sidebar from '@/components/sidebar'
import { redirect } from 'next/navigation';
import React from 'react'
import { Channel, Workspace as UserWorkspace } from '@/types/app';
import ChatHeader from '@/components/chat-header';
import Typography from '@/components/ui/typography';
import TextEditor from '@/components/text-editor';
import ChatGroup from '@/components/chat-group';

const ChannelId = async ({ params }: { params: Promise<{ workspaceId: string, channelId: string }> }) => {

    const { workspaceId, channelId } = await params;
    const userData = await getUserData();

    if (!userData) {
        return redirect('/auth');
    }

    const [userWorkspaceData, userWorkspaceError] = await getUserWorkspaceData(userData.workspaces!);

    const [currentWorkspaceData, currentWorkspaceError] = await getCurrentWorkspaceData(workspaceId);

    const userWorkspaceChannels = await getUserWorkspaceChannels(currentWorkspaceData.id, userData.id);


    const currentChannelData = (userWorkspaceChannels as Channel[])?.find(
        channel => channel.id === channelId
    )

    if (!currentChannelData) {
        return redirect('/');
    }

    return (
        <div className='hidden md:block'>
            <ChatGroup 
            type='Channel' 
            socketUrl={`/api/web-socket/messages`} 
            apiUrl={`/api/messages`} 
            headerTitle={currentChannelData.name} 
            chatId={currentChannelData.id} 
            socketQuery={{channelId: currentChannelData.id, workspaceId: currentWorkspaceData.id}} 
            paramKey='channelId' 
            paramValue={channelId} 
            userData={userData} 
            currentWorkspaceData={currentWorkspaceData} 
            userWorkspaceData={userWorkspaceData as UserWorkspace[]} 
            currentChannelData={currentChannelData} 
            userWorkspaceChannels={userWorkspaceChannels as Channel[]}
            slug={workspaceId} />
        </div>

    )
}

export default ChannelId