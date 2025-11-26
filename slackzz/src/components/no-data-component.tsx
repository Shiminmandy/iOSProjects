'use client';

import { FC, useState } from "react";
import Typography from "./ui/typography";
import { Button } from "./ui/button";
import CreateChannelDialog from "./create-channel-dialog";

const NoDataScreen: FC<{
    workspaceName: string;
    userId: string;
    workspaceId: string;
}> = ({ workspaceName, userId, workspaceId }) => {

    const [dialogOpen, setDialogOpen] = useState(false);

    return (
        <div className='w-full h-[calc(100vh-63px)] p-4'>
            <Typography
                text={`Welcome to #${workspaceName}'s workspace!`}
                variant="h3"
            />

            <Typography
                text={'Get started by creating a new channel or direct message'}
                variant="h3"
                className='my-3'
            />

            <div className='w-fit'>
                <Button className='w-full my-2' onClick={() => setDialogOpen(true)}>
                    <Typography text='Create Channel' variant="p" />
                </Button>

                <CreateChannelDialog
                    setDialogOpen={setDialogOpen}
                    dialogOpen={dialogOpen}
                    workspaceId={workspaceId}
                    userId={userId}
                />
            </div>
        </div>
    )
}

export default NoDataScreen