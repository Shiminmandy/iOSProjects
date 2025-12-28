import { FC } from "react";
import { format } from "date-fns";
import Typography from "./ui/typography";


type IntroBannerProps = {
    type: 'Channel' | 'DirectMessage';
    name: string;
    creationDate: string;
}



export const IntroBanner: FC<IntroBannerProps> = ({
    type,
    name,
    creationDate
}) => {

    const channelMessage =
        creationDate ? `You created this channel on ${format(
            new Date(creationDate),
            'd MM yyyy'
        )}. This is the very beginning of the ${name} channel. This channel is for everything ${name}. Hold meetings, share docs, and make decisions together.`
            : '';

    const directMessage = ` This is the beginning of your direct message history with ${name}. Use this space to share thoughts, files, and more.`;
    return (
        <div className="px-2 mb-5">
            {type === 'Channel' && <p>{channelMessage}</p>}
            {type === 'DirectMessage' && (
                <p className='text-zinc-600 dark:text-zinc-400 text-sm'>
                    {directMessage}
                </p>
            )}
        </div>
    )
}