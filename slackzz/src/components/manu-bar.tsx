
import { Editor } from '@tiptap/react'
import { Button } from './ui/button'
import { Bold, Code, SquareCode, Italic, List, ListOrdered, Strikethrough, Underline } from 'lucide-react'
import Typography from './ui/typography'
import { BsEmojiSmile } from 'react-icons/bs'
import { PiCheckerboard } from 'react-icons/pi'
import { useTheme } from 'next-themes'
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover'

const MenuBar = ({ editor }: { editor: Editor }) => {

    const { resolvedTheme } = useTheme();

    return (
        <div className='flex items-center flex-wrap gap-2 absolute z-10 top-0 left-0 w-full p-2 bg-neutral-100 dark:bg-neutral-900'>
            {/** tiptap 链式api */}
            <Button
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={editor.isActive('bold') ? 'border-white' : 'border-black'}
            >
                <Bold className='w-4 h-4' />
            </Button>

            <Button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={editor.isActive('italic') ? 'border-white' : 'border-black'}
            >
                <Italic className='w-4 h-4' />
            </Button>

            <Button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                disabled={!editor.can().chain().focus().toggleStrike().run()}
                className={editor.isActive('strike') ? 'border-white' : 'border-black'}
            >
                <Strikethrough className='w-4 h-4' />
            </Button>

            <Button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={editor.isActive('bulletList') ? 'border-white' : 'border-black'}
            >
                <List className='w-4 h-4' />
            </Button>

            <Button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={editor.isActive('orderedList') ? 'border-white' : 'border-black'}
            >
                <ListOrdered className='w-4 h-4' />
            </Button>

            <Typography
                text='|'
                variant='h6'
                className='mt-0'
            />

            <Button
                onClick={() => editor.chain().focus().toggleCode().run()}
                className={editor.isActive('code') ? 'border-white' : 'border-black'}
            >
                <Code className='w-4 h-4' />
            </Button>

            <Button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={editor.isActive('codeBlock') ? 'border-white' : 'border-black'}
            >
                <SquareCode className='size-4' />
            </Button>

            <Typography
                text='|'
                variant='h6'
                className='mt-0'
            />

            <Popover>
                <PopoverTrigger>
                    <button>
                        <BsEmojiSmile size={20} />
                    </button>

                </PopoverTrigger>   

                <PopoverContent className='w-fit p-0'>
                    <Picker
                        theme={resolvedTheme}
                        data={data}
                        onEmojiSelect={(emoji:any) => editor.chain().focus().insertContent(emoji.native).run()}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default MenuBar