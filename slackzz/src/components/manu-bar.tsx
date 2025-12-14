
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
            {/** Light: 白底黑字, Dark: 黑底白字 */}
            <Button
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={`bg-neutral-100 text-black dark:dark:bg-neutral-900 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 ${editor.isActive('bold') ? 'ring-2 ring-black dark:ring-white' : ''}`}
            >
                <Bold className='w-4 h-4' />
            </Button>

            <Button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={`bg-neutral-100 text-black dark:dark:bg-neutral-900 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 ${editor.isActive('italic') ? 'ring-2 ring-black dark:ring-white' : ''}`}
            >
                <Italic className='w-4 h-4' />
            </Button>

            <Button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                disabled={!editor.can().chain().focus().toggleStrike().run()}
                className={`bg-neutral-100 text-black dark:dark:bg-neutral-900 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 ${editor.isActive('strike') ? 'ring-2 ring-black dark:ring-white' : ''}`}
            >
                <Strikethrough className='w-4 h-4' />
            </Button>

            <Button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`bg-neutral-100 text-black dark:dark:bg-neutral-900 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 ${editor.isActive('bulletList') ? 'ring-2 ring-black dark:ring-white' : ''}`}
            >
                <List className='w-4 h-4' />
            </Button>

            <Button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`bg-neutral-100 text-black dark:dark:bg-neutral-900 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 ${editor.isActive('orderedList') ? 'ring-2 ring-black dark:ring-white' : ''}`}
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
                className={`bg-neutral-100 text-black dark:dark:bg-neutral-900 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 ${editor.isActive('code') ? 'ring-2 ring-black dark:ring-white' : ''}`}
            >
                <Code className='w-4 h-4' />
            </Button>

            <Button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`bg-neutral-100 text-black dark:dark:bg-neutral-900 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 ${editor.isActive('codeBlock') ? 'ring-2 ring-black dark:ring-white' : ''}`}
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