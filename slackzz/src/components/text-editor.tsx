'use client'
import { Send } from 'lucide-react'
import React from 'react'
import { FiPlus } from 'react-icons/fi'
import { Button } from './ui/button'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import PlaceHolder from '@tiptap/extension-placeholder'

const TextEditor = () => {

    const editor = useEditor({
        extensions: [
            StarterKit,
            PlaceHolder.configure({
                placeholder: `Message ...`,
            }),
        ]
    })
    return (
        <div className='p-1 border dark:border-zinc-500 border-neutral-700 rounded-md relative overflow-hidden'>
            <div className='sticky top-0 z-10'>
                {/* menu bar */}
            </div>

            <div className='h-[150px] pt-11 flex w-full grow-1'>
                {/* Editor Content */}
            </div>

            <div className='absolut top-3 z-10 right-3 bg-black dark:bg-white cursor-pointer transition-all duration-500 hover:scale-110 text-white grid place-content-center rounded-full w-6 h-6'>
                <FiPlus
                    onClick={() => { }}
                    size={28}
                    className=' dark:text-black'
                />
            </div>

            <Button size='icon' className='absolute bottom-1 right-1'>
                <Send />
            </Button>

</div>
    )
}

export default TextEditor