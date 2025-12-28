import { User, Channel } from '@/types/app';

import React, { FC, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import Typography from './ui/typography';
import { useChatFile } from '@/hooks/use-chat-file';
import Link from 'next/link';
import Image from 'next/image';
import { Form, FormControl, FormField, FormItem } from './ui/form';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';
import { Edit, Trash } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@radix-ui/react-dialog';
import { DialogHeader } from './ui/dialog';
import axios from 'axios';

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

{/** 表单验证规则 */ }
const formSchema = z.object({
    content: z.string().min(2),
});

{/** 聊天消息项组件：渲染单条消息，包含用户头像、消息内容、编辑/删除功能 */ }
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
    const [isEditing, setIsEditing] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);


    {/** 表单实例, 使用react-hook-form的useForm钩子创建*/ }
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: content ?? '',
        },
    });

    {/** 判断是否是超级管理员 */ }
    const isSuperAdmin = currentUser.id === channelData?.user_id;
    const isRegulator = channelData?.regulators?.includes(currentUser.id) ?? false;
    const isOwner = currentUser.id === user.id;
    const canDeleteMesage = !deleted && (isOwner || isSuperAdmin || isRegulator);
    const canEditeMessage = !deleted && isOwner && !fileUrl;
    const isPdf = fileType === 'pdf' && fileUrl;
    const isImage = fileType === 'image' && fileUrl;
    const isLoading = form.formState.isSubmitting;


    {/** 处理表单提交：保存编辑后的消息内容 */ }
    const onSubmit = async ({content}: z.infer<typeof formSchema>) => {
        const url = `${socketUrl}/${id}${new URLSearchParams(socketQuery)}`;
        await axios.patch(url, {content});
        setIsEditing(false);
        form.reset();
    }

    {/** 处理删除消息：发送 DELETE 请求到服务器删除消息 */ }
    const handleDelete = async () => {
        setIsDeleting(true);
        const url = `${socketUrl}/${id}?${new URLSearchParams(socketQuery)}`;
        await axios.delete(url);
        setIsDeleting(false);
        setOpenDeleteDialog(false);
    }

    {/** 文件预览组件：根据文件类型（图片/PDF）渲染不同的预览界面 */ }
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

    {/** 可编辑内容组件：根据 isEditing 状态切换显示编辑表单或普通消息内容 */ }
    const EditableContent = () => (
        isEditing ? (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} >

                    <fieldset
                        className='flex items-center w-full gap-x-2 pt-2'
                        disabled={isLoading}
                    >
                        <FormField
                            control={form.control}
                            name='content'
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            className='p-2 border-none bg-transparent border-0 focus-visible:ring-0 focus-visitble:ring-offset-0'
                                            placeholder='edited message'
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <Button size='sm'>Save</Button>
                    </fieldset>
                </form>
                <span>Press ESC to cancel, enter to save</span>

            </Form>
        ) : (
            <div className={cn('text-sm', { 'text-xs opacity-90 italic': deleted })}
                dangerouslySetInnerHTML={{ __html: content ?? '' }}
            />
        )
    )

    {/** 删除确认对话框组件：显示删除确认弹窗，包含消息预览和确认/取消按钮 */ }
    const DeleteDialog = () => (
        <Dialog
            onOpenChange={() => setOpenDeleteDialog(prevState => !prevState)}
            open={openDeleteDialog}
        >
            <DialogTrigger>
                <Trash size={20} />
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Are you sure you want to delete?
                    </DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete the message.
                    </DialogDescription>
                    <div className='text-center'>
                        {isPdf && (
                            <div className='items-start justify-center gap-3 relative'>
                                <Typography variant='p' text='Shared a PDF file' />
                                <Link
                                    href={publicUrl}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='text-blue-600 hover:underline'
                                >
                                    View PDF
                                </Link>
                            </div>
                        )}
                        {!fileUrl && !isEditing && (
                            <div
                                className='text-sm'
                                dangerouslySetInnerHTML={{ __html: content ?? '' }}
                            />
                        )}
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
                    </div>
                </DialogHeader>

                <div className='flex flex-col gap-2'>
                    <Button
                        onClick={() => setOpenDeleteDialog(false)}
                        className='w-full'
                        variant='secondary'
                        disabled={isDeleting}
                    >
                        No, cancel
                    </Button>
                    <Button
                        onClick={handleDelete}
                        className='w-full'
                        variant='secondary'
                        disabled={isDeleting}
                    >
                        Yes, delete
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )

    return (
        <div className='relative group flex items-center hover:bg-black/5 px-1 py-2 rounded transition w-full'>
            {/* 消息项容器：整个消息项的包裹容器，支持 hover 效果 */}
            {/* 消息内容区域：包含头像和消息主体 */}
            <div className='flex gap-x-2'>
                {/* 用户头像容器：可点击的头像区域 */}
                <div className='cursor-pointer hover:drop-shadow-md transition '>
                    {/* 头像组件：显示用户头像，失败时显示用户名首字母 */}
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
                {/* 消息主体区域：包含用户名、消息内容、文件预览等 */}
                <div className='flex flex-col w-full'>
                    {/* 消息头部信息：用户名、管理员标识、编辑标记、时间戳 */}
                    <div className='flex items-center gap-x-2'>
                        {/* 用户名显示 */}
                        <Typography
                            variant='p'
                            text={user.name ?? user.email}
                            className='text-sm font-semibold hover:underline cursor-pointer'
                        />
                        {/* 超级管理员标识图标 */}
                        {isSuperAdmin && (<MdOutlineAdminPanelSettings className='w-5 h-5' />)}
                        {/* 频道管理员标识图标 */}
                        {isRegulator && (<MdOutlineAdminPanelSettings className='w-5 h-5' />)}

                        {/* 编辑标记：显示消息是否被编辑过 */}
                        {isUpdated && !deleted && <span className='text-xs'>(edited)</span>}
                        {/* 时间戳显示 */}
                        <span>{timestamp}</span>
                    </div>
                    {/* 文件预览组件：显示图片或 PDF 文件预览 */}
                    <FilePreview />
                    {/* 可编辑内容组件：非文件消息时显示，支持编辑和普通显示 */}
                    {!fileUrl && <EditableContent />}
                </div>
            </div>

            {/* 操作按钮区域：鼠标悬停时显示编辑/删除按钮 */}
            {canDeleteMesage && (
                <div className='hidden absolute group-hover:flex flex-row gap-2 border bg-white dark:bg-black dark:text-white text-black rounded-md p-2 top-0 -translate-y-1/3 right-0'>
                    {/* 编辑按钮：只有有编辑权限时显示 */}
                    <DeleteDialog />
                    {
                        canEditeMessage && (
                            <Edit
                                className='cursor-pointer'
                                size={20}
                                onClick={() => setIsEditing(true)}
                            />
                        )}
                </div>
            )}
        </div>
    )
}

export default ChatItem