import { User, Channel } from '@/types/app';

import React, { FC } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import Typography from './ui/typography';
import { useChatFile } from '@/hooks/use-chat-file';
import Link from 'next/link';
import Image from 'next/image';

type ChatItemProps = {
    id: string;
    content: string | null;
    user: User;
    timestamp: string;
    fileUrl: string | null;
    deleted: boolean;
    currentUser: User;
    isUpdated: boolean;
    socketUrl: string;
    socketQuery: Record<string, string>;
    channelData?: Channel;
}

const ChatItem: FC<ChatItemProps> = ({
    id,
    content,
    user,
    timestamp,
    fileUrl,
    deleted,
    currentUser,
    isUpdated,
    socketUrl,
    socketQuery,
    channelData,
}) => {

    {/** 自定义hook从supabse获取文件的公共 URL 和文件类型 */ }
    const { publicUrl, fileType } = useChatFile(fileUrl!);

    {/** 判断是否是超级管理员 */ }
    const isSuperAdmin = currentUser.id === channelData?.user_id;
    const isRegulator = channelData?.regulators?.includes(currentUser.id) ?? false;
    const isOwner = currentUser.id === user.id;
    const canDeleteMesage = !deleted && (isOwner || isSuperAdmin || isRegulator);
    const canEditeMessage = !deleted && isOwner && !fileUrl;
    const isPdf = fileType === 'pdf' && fileUrl;
    const isImage = fileType === 'image' && fileUrl;

    const FilePreview = () => (
        <>
            {isImage && (
                <Link
                    href={publicUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-28 w-48'
                >
                    <Image
                        src={publicUrl}
                        alt={content ?? ''}
                        fill
                        className='object-cover'
                    />
                </Link>
            )}

            {isPdf && (
                <div className='flex flex-col items-start justify justify-center gap-2 ox-2 py-1 border rounded-md shadow bg-white dark:bg-gray-800'>
                    <Typography
                        variant='p'
                        text='shared a file'
                        className='text-lg font-semibold text-gray-700 dark:text-gray-200'
                    />


                    <Link
                        href={publicUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-blue-600 hover:text-blue-800 hover:underline transition-color duration-300 ease-in-out'
                    >
                        View PDF
                    </Link>
                </div>
            )}

        </>
    );

    return (
        <div className='relative group flex items-center hover:bg-black/5 px-1 py-2 rounded transition w-full'>
            <div className='flex gap-x-2'>
                <div className='cursor-pointer hover:drop-shadow-md transition '>
                    <Avatar>
                        <AvatarImage
                            src={user.avatar_url}
                            alt={user.name ?? user.email}
                            className='object-cover w-full h-full'
                        />
                        <AvatarFallback className='bg-neutral-700'>
                            <Typography variant='p' text={user.name?.slice(0, 2) ?? 'UN'} />
                        </AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </div>
    )
}

export default ChatItem