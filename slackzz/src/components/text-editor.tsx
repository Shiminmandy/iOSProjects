'use client'
import { Send } from 'lucide-react'
import React, { FC, useState } from 'react'
import { FiPlus } from 'react-icons/fi'
import { Button } from './ui/button'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import PlaceHolder from '@tiptap/extension-placeholder'
import { Channel,Workspace } from '@/types/app'
import axios from 'axios'


type TextEditorProps = {
    apiUrl: string;
    type: 'channel' | 'directMessage';
    channel: Channel;
    workspaceData: Workspace;
};

const TextEditor: FC<TextEditorProps> = ({ apiUrl, type, channel, workspaceData }) => {

    const [content, setContent] = useState('')

    const editor = useEditor({  
        extensions: [
            StarterKit,
            PlaceHolder.configure({
                placeholder: `Message #${type === 'channel' ? channel.name : "username"}`,
            }),
        ],
        autofocus: true,
        content,
        onUpdate: ({ editor }) => {
            setContent(editor.getHTML());
        },
        immediatelyRender: false,  // Fix SSR hydration issue
    })

    const handleSend = async () => {
        if (!content) return;

        try {
            await axios.post(`${apiUrl}?channelId=${channel.id}&workspaceId=${workspaceData.id}`, 
                {
                    content,
                }
            );

            setContent('');
            editor?.commands.setContent('');
        } catch (error) {
            console.log("FAILED TO SEND MESSAGE: ", error);
        }
    };
    return (
        <div className='p-1 border dark:border-zinc-500 border-neutral-700 rounded-md relative overflow-hidden'>
            <div className='sticky top-0 z-10'>
                {/* menu bar */}
            </div>

            <div className='h-[150px] pt-11 flex w-full grow-1'>
                {/* Editor Content */}
                <EditorContent
                className='prose w-full h-full dark:text-white leading-[1.15px] overflow-y-hidden whitespace-pre-wrap'
                editor={editor}
                />
            </div>

            <div className='absolut top-3 z-10 right-3 bg-black dark:bg-white cursor-pointer transition-all duration-500 hover:scale-110 text-white grid place-content-center rounded-full w-6 h-6'>
                <FiPlus
                    onClick={() => { }}
                    size={28}
                    className=' dark:text-black'
                />
            </div>

            <Button onClick={handleSend} disabled={!content} size='icon' className='absolute bottom-1 right-1'>
                <Send />
            </Button>

</div>
    )
}

export default TextEditor