import { useColorPreferences } from '@/providers/color-preferences';
import { Channel, Workspace } from '@/types/app';
import React, { FC } from 'react'
import { useRouter } from 'next/navigation';
import { addChannelToUser, updateChannelMembers, updateChannelRegulators } from '@/actions/channels';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';
import { Search } from 'lucide-react';
import { MdOutlineAdminPanelSettings, MdOutlineAssistantPhoto } from 'react-icons/md';
import { ScrollArea } from '@/components/ui/scroll-area';
import { User } from '@/types/app';
import { Button } from './ui/button';

type SearchBarProps = {
    currentWorkspaceData: Workspace;
    currentChannelData?: Channel;
    loggedInUserId: string;
}

const SearchBar: FC<SearchBarProps> = ({
    currentWorkspaceData,
    currentChannelData,
    loggedInUserId
}) => {

    const { color } = useColorPreferences();
    const router = useRouter();

    let backgroundColor = 'bg-[#7a4a7f] dark:bg-[3311834]';
    if (color === 'green') {
        backgroundColor = 'bg-green-200 dark:bg-green-900';
    } else if (color === 'blue') {
        backgroundColor = 'bg-blue-200 dark:bg-blue-900';
    }

    const isChannelMember = (memberId: string) => {
        return currentChannelData?.members?.includes(memberId) ?? false;
    }

    const isRegulator = (memberId: string) => {
        return currentChannelData?.regulators?.includes(memberId) ?? false;
    }

    const isChannelCreator = (memberId: string) => {
        return currentChannelData?.user_id === memberId;
    }

    /** 添加用户到频道 */
    const addUserToChannel = async (userId: string, channelId: string) => {

        // add user to channel
        await updateChannelMembers(channelId, userId);

        // add channer to user's channels
        await addChannelToUser(userId, channelId);

        router.refresh();
        toast.success('User added to channel');
    }

    const makeUserRegulator = async (userId: string, channelId: string) => {
        await updateChannelRegulators(channelId, userId);
        router.refresh();
        toast.success('User is now a regulator');
    }

    return (
        <div className={cn('absolute h-10 w-[500px] px-3 top-2 rounded-md', backgroundColor)}>
            <Popover >
                <PopoverTrigger className='flex items-center space-x-2 w-full h-full'>
                    <Search size={20} className='text-black dark:text-white' />
                    <span className='text-sm text-black dark:text-white'>
                        Search #{currentChannelData?.name ?? 'channel'}
                    </span>
                </PopoverTrigger>

                <PopoverContent className='w-[500px]'>
                    <ScrollArea className='rounded-md max-h-96'>
                        {currentWorkspaceData?.members?.map(member => {
                            return (
                                <div
                                    key={member.id}
                                    className='flex items-center my-2 justify-between'
                                >
                                    <div className='flex items-center p-2'>
                                        <span className='mr-2 text-sm text-black dark:text-white'>
                                            {member?.name ?? member?.email}
                                        </span>
                                        {isRegulator(member.id) && (
                                            <MdOutlineAssistantPhoto className='w-5 h-5' />
                                        )}
                                        {isChannelCreator(member.id) && (
                                            <MdOutlineAdminPanelSettings className='w-5 h-5' />
                                        )}
                                    </div>

                                    <div className='flex gap-x-2'>
                                        {/* Assign Regulator 按钮， 只有不是当前用户，不是监管者，不是频道成员时才显示 */}
                                        {loggedInUserId != member.id &&
                                            !isRegulator(member.id) &&
                                            isChannelMember(member.id) && (
                                                <Button className='text-[10px]'
                                                    size='sm'
                                                    variant='destructive'
                                                    onClick={() =>
                                                        makeUserRegulator(member.id, currentChannelData?.id!)
                                                    }
                                                >
                                                    Assign Regulator
                                                </Button>
                                            )}

                                        {!isChannelMember(member.id) && (
                                            <Button
                                                className='text-[10px]'
                                                size='sm'
                                                disabled={isChannelMember(member.id)}
                                                onClick={() =>
                                                    addUserToChannel(member.id, currentChannelData?.id!)
                                                }
                                            >
                                                Add to Channel
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </ScrollArea>
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default SearchBar