"use client"
import { FC } from "react";
import { Workspace } from "@/types/app";
import { User } from "@/types/app";
import SidebarNav from "./sidebar-nav";
import { FiPlus } from "react-icons/fi";
import { Tooltip, TooltipTrigger, TooltipProvider, TooltipContent } from "./ui/tooltip";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useColorPreferences } from "@/providers/color-preferences";
import { cn } from "@/lib/utils";
import { GoDotFill, GoDot } from "react-icons/go";
import { GiNightSleep } from "react-icons/gi";
import Typography from "./ui/typography";
import { FaRegCalendarCheck } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { Separator } from "./ui/separator";
import { IoDiamondOutline } from "react-icons/io5";
import PreferenciesDialog from "./preferencies-dialog";



type SidebarProps = {
    userWorkspacesData: Workspace[];
    currentWorkspaceData: Workspace;
    userData: User;
}

const Sidebar: FC<SidebarProps> = ({ userWorkspacesData, currentWorkspaceData, userData }) => {

    const { color } = useColorPreferences();

    let backgroundColor = 'bg-primary-dark';
    if (color === 'green') {
        backgroundColor = 'bg-green-700';
    } else if (color === 'blue') {
        backgroundColor = 'bg-blue-700';
    }


    return (<aside
        className={`
        fixed
        top-0
        left-0
        pt-[68px]
        pb-8
        z-30
        flex
        flex-col
        justify-between
        items-center
        h-screen
        w-20 
        `}
    >
        <SidebarNav userWorkspacesData={userWorkspacesData} currentWorkspaceData={currentWorkspaceData} />

        <div className='flex flex-col space-y-3'>
            <div className='bg-[rgba(255,255,255,0.3)] cursor-pointer transition-all duration-300
            hover:scale-110 text-white grid place-content-center rounded-full w-10 h-10'>
                <FiPlus size={28} />
            </div>

            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div>
                            <Popover >
                                <PopoverTrigger >
                                    {/* 触发器 （头像）*/}
                                    <div className='h-10 w-10 relative cursor-pointer'>
                                        <div className='h-full w-full rounded-lg overflow-hidden'>
                                            <Image
                                                className='object-cover w-full h-full'
                                                src={userData.avatar_url}
                                                alt={userData.name || 'user'}
                                                width={300}
                                                height={300}
                                            />
                                            <div className={cn(
                                                'absolute z-10 rounded-full -right-[20%] -bottom-1',
                                                backgroundColor
                                            )}>
                                                {userData.is_away ? (<GoDot className='text-white text-xl' />) : <GoDotFill className='text-green-600 text-xl' />}
                                            </div>
                                        </div>
                                    </div>
                                </PopoverTrigger>
                                {/* 弹出内容 （用户信息）， 可调整弹框位置*/}
                                <PopoverContent side='right'>
                                    <div>
                                        <div className='flex space-x-3  '>
                                            {/* 头像 */}
                                            <Avatar>
                                                <AvatarImage src={userData.avatar_url} />
                                                <AvatarFallback>
                                                    {userData.name && userData.name.slice(0, 2)}
                                                </AvatarFallback>
                                            </Avatar>
                                            {/* 用户名 */}
                                            <div className='flex flex-col'>
                                                <Typography
                                                    text={userData.name || ''}
                                                    variant='p'
                                                    className='font-bold'
                                                />
                                                {/* 状态 */}
                                                <div className='flex items-center space-x-1'>
                                                    {userData.is_away ? (
                                                        <GiNightSleep size='12' />
                                                    ) : (
                                                        <GoDotFill className='text-green-600' size='17' />
                                                    )}
                                                    <span className='text-xs'>
                                                        {userData.is_away ? 'Away' : 'Active'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        {/**使用group 实现 hover效果 ，不用精确hover每个图标实现hover效果*/}
                                        <div className='border group cursor-pointer mt-4 mb-2 p-1 rounded flex items-center space-x-2'>
                                            <FaRegCalendarCheck className='group-hover:hidden' />
                                            <FaPencil className='hidden group-hover:block' />
                                            <Typography
                                                text={'In a meeting'}
                                                variant='p'
                                                className='text-xs text-gray-600'
                                            />
                                        </div>

                                        {/* 根据userData.is_away 显示不同的内容:
                                        如果userData.is_away为true，则显示'Set yourself active'，否则显示'Set yourself as away'
                                        如果userData.is_away为true，则显示'Clear Status'
                                        显示'Profile'
                                        */}
                                        <div className='flex flex-col space-y-1'>
                                            <Typography
                                                text={userData.is_away ? 'Set yourself active' : 'Set yourself as away'}
                                                variant='p'
                                                className='hover:text-white hover:bg-blue-700 px-2 py-1 rounded cursor-pointer'
                                            />

                                            <Typography
                                                text={"Clear Status"}
                                                variant='p'
                                                className='hover:text-white hover:bg-blue-700 px-2 py-1 rounded cursor-pointer'
                                            />

                                            {/* <hr className='bg-gray-400'/> */}
                                            <Separator className=' border-gray-400' />

                                            <Typography
                                                text={'Profile'}
                                                variant='p'
                                                className='hover:text-white hover:bg-blue-700 px-2 py-1 rounded cursor-pointer'
                                            />

                                            <PreferenciesDialog />
                                            
                                            <Separator className=' border-gray-400' />

                                            {/* 升级和退出 */}
                                            <div className='flex gap-2 items-center hover:text-white hover:bg-blue-700 px-2 py-1 rounded cursor-pointer'>
                                                <IoDiamondOutline className='text-orange-400' />
                                                <Typography
                                                    variant='p'
                                                    text={`Upgrade ${currentWorkspaceData.name}`}
                                                    className='text-xs '
                                                />
                                            </div>
                                            <Typography
                                                variant='p'
                                                text={`Sign out of ${currentWorkspaceData.name}`}
                                                className='hover:text-white hover:bg-blue-700 px-2 py-1 rounded cursor-pointer '
                                            />
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </TooltipTrigger>

                    {/* Tooltip 是一个悬停提示组件：鼠标悬停在元素上时显示简短提示信息。 */}
                    <TooltipContent
                        className='text-white bg-black border-black'
                        side='right'
                    >
                        <Typography
                            text={userData.name || userData.email}
                            variant='p'
                            className='text-white'
                        />
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    </aside>
    )
}
export default Sidebar;