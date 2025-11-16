import { FC } from "react";
import { Workspace } from "@/types/app";
import { Tooltip, TooltipTrigger, TooltipProvider, TooltipContent } from "@radix-ui/react-tooltip";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { getCurrentWorkspaceData } from "@/actions/workspaces";
import Typography from "./ui/typography";
import { Card } from "./ui/card";
import { CardContent } from "./ui/card";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { FaPlus } from "react-icons/fa";
import { RiHome2Fill } from "react-icons/ri";
import { PiChatsTeardrop } from "react-icons/pi";

type SidebarNavProps = {
    userWorkspacesData: Workspace[];
    currentWorkspaceData: Workspace;
}

const SidebarNav: FC<SidebarNavProps> = ({ currentWorkspaceData, userWorkspacesData }) => {
    return (
        <nav>
            <ul className='flex flex-col space-y-4'>
                <li>
                    <div className='cursor-pointer items-center text-white mb-4 w-10 h-10 rounded-full overflow-hidden'>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
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
                                </TooltipTrigger>
                                <TooltipContent className='p-0' side='bottom'>
                                    <Card className='w-[350px]  border-0'>
                                        <CardContent className='flex p-0 flex-col'>
                                            {userWorkspacesData.map(workspace => (
                                                <div
                                                    key={workspace.id}
                                                    className='hover:opacity-70 px-2 py-1 flex gap-2'
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
                                                    <div>
                                                        <Typography
                                                            variant='p'
                                                            text={workspace.name}
                                                            className='text-sm'
                                                        />
                                                        <Typography
                                                            variant='p'
                                                            text={workspace.invite_code || ''}
                                                            className=' text-neutral-500'
                                                        />
                                                    </div>
                                                </div>
                                            ))}

                                            <Separator />
                                            <div className='flex items-center gap-2 p-2'>
                                                <Button variant='secondary'>
                                                    <FaPlus />
                                                </Button>
                                                <Typography
                                                    variant='p'
                                                    text='Add Workspace'
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>

                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
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