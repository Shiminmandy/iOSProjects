import { FC } from "react";
import { Workspace } from "@/types/app";
import { Tooltip, TooltipTrigger, TooltipProvider, TooltipContent } from "@radix-ui/react-tooltip";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { getCurrentWorkspaceData } from "@/actions/workspaces";
import Typography from "./ui/typography";
import { Card } from "./ui/card";
import { CardContent } from "./ui/card";
import { Separator } from "./ui/separator";
import { cn } from "@/lib/utils";
import { RiHome2Fill } from "react-icons/ri";
import { PiChatsTeardrop } from "react-icons/pi";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import CreateWorkpsace from "./create-workpsace";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ProgressBar from "./progress-bar";
import { useColorPreferences } from "@/providers/color-preferences";
import { Copy } from "lucide-react";
import { toast } from "sonner";

type SidebarNavProps = {
    userWorkspacesData: Workspace[];
    currentWorkspaceData: Workspace;
}



const SidebarNav: FC<SidebarNavProps> = ({ currentWorkspaceData, userWorkspacesData }) => {

    const router = useRouter();

    const [switchingWorkspace, setSwitchingWorkspace] = useState(false);

    const { color } = useColorPreferences();

    let backgroundColor = 'bg-primary-dark';
    if (color === 'green') {
        backgroundColor = 'bg-green-700';
    } else if (color === 'blue') {
        backgroundColor = 'bg-blue-700';
    }

    const switchWorkspace = (id: string) => {
        // 如果点击的是当前工作区，直接返回，不做任何操作
        if (id === currentWorkspaceData.id) {
            return;
        }

        // 只有切换到不同工作区时才显示进度条并跳转
        setSwitchingWorkspace(true);
        router.push(`/workspace/${id}`);
    };
    
    {/** 复制邀请链接 */}
    const copyInviteLink = (inviteCode: string) => {

        const currentDomain = window.location.origin;

        navigator.clipboard.writeText(
            `${currentDomain}/create-workspace/${inviteCode}`
        );
        toast.success('Invite link copied to clipboard');
    }

    return (
        <nav>
            <ul className='flex flex-col space-y-4'>
                <li>
                    <div className='cursor-pointer items-center text-white mb-4 w-10 h-10 rounded-full overflow-hidden'>

                        <Popover>
                            <PopoverTrigger>
                                {/* 头像触发器 */}
                                <Avatar>
                                    <AvatarImage
                                        src={currentWorkspaceData.image_url || ''}
                                        alt={currentWorkspaceData.name}
                                        className='object-cover w-full h-full'
                                    />
                                    <AvatarFallback className='bg-neutral-700'>
                                        <Typography
                                            variant='p'
                                            text={currentWorkspaceData.name.slice(0, 2)}
                                        />
                                    </AvatarFallback>
                                </Avatar>
                            </PopoverTrigger>
                            <PopoverContent className='p-0' side='bottom'>
                                {/* 弹出内容：员工头像列表 */}
                                <Card className='w-[350px]  border-0'>
                                    <CardContent className='flex p-0  flex-col'>
                                        {switchingWorkspace ?
                                            (<div className='m-2'>
                                                <ProgressBar />
                                            </div>) : (
                                                userWorkspacesData.map(workspace => {
                                                    const isActive =
                                                        workspace.id === currentWorkspaceData.id;

                                                    return (
                                                        <div
                                                            key={workspace.id}
                                                            className={cn(
                                                                isActive && backgroundColor
                                                                , 'cursor-pointer px-2 py-1 flex gap-2')}
                                                            onClick={() => !isActive && switchWorkspace(workspace.id)}
                                                        >
                                                            <Avatar className='w-10 h-10'>
                                                                <AvatarImage
                                                                    src={workspace.image_url || ''}
                                                                    alt={workspace.name}
                                                                    className='object-cover w-full h-full'
                                                                />
                                                                <AvatarFallback>
                                                                    <Typography
                                                                        variant='p'
                                                                        text={workspace.name.slice(0, 2)}
                                                                    />
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            {/* 员工信息 */}
                                                            <div>
                                                                <Typography
                                                                    variant='p'
                                                                    text={workspace.name}
                                                                    className='text-sm'
                                                                />
                                                                <div className='flex items-center gap-x-2'>
                                                                    <Typography
                                                                        variant='p'
                                                                        text={'Copy Invite LInk'}
                                                                        className=' text-xs lg:text-xs'
                                                                    />

                                                                    <Copy
                                                                        size={16}
                                                                        className='cursor-pointer'
                                                                        onClick={() => copyInviteLink(workspace.invite_code)}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            )}

                                        <Separator />
                                        <CreateWorkpsace />
                                    </CardContent>
                                </Card>

                            </PopoverContent>
                        </Popover>

                    </div>
                    <div className='flex flex-col items-center cursor-pointer group text-white'>
                        <div className='p-2 rounded-lg bg-[rgba(255,255,255,0.3)]'>
                            <RiHome2Fill size={20} className='group-hover:scale-125 transition-all duration-300'
                            />

                        </div>
                        <Typography
                            variant='p' text='Home' className='text-sm lg:text-sm md:text-sm' />
                    </div>
                </li>

                <li>
                    <div className='flex flex-col cursor-pointer items-center group text-white'>
                        <div className='flex flex-col items-center cursor-pointer group text-white'>
                            <div className='p-2 rounded-lg bg-[rgba(255,255,255,0.3)]'>
                                <PiChatsTeardrop size={20} className='group-hover:scale-125 transition-all duration-300'
                                />

                            </div>
                            <Typography
                                variant='p' text='Dms' className='text-sm lg:text-sm md:text-sm' />
                        </div>
                    </div>
                </li>
            </ul>
        </nav>
    )
}

export default SidebarNav;