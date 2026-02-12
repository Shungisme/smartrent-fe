import React from 'react'
import { useTranslations } from 'next-intl'
import { Editor } from '@tiptap/react'
import { Button } from '@/components/atoms/button'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  ListTodo,
  Quote,
  Minus,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Heading1,
  Heading2,
  Heading3,
} from 'lucide-react'

interface NewsEditorMenuBarProps {
  editor: Editor | null
}

export const NewsEditorMenuBar: React.FC<NewsEditorMenuBarProps> = ({
  editor,
}) => {
  const t = useTranslations('news.editor.menuBar')

  if (!editor) return null

  const setLink = () => {
    const url = window.prompt(t('enterUrl'))
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  return (
    <div className='border-b border-gray-200 bg-gradient-to-r from-slate-50 via-white to-slate-50 shadow-sm'>
      <div className='flex flex-wrap gap-1.5 p-3'>
        {/* Text formatting */}
        <div className='flex gap-1 pr-3 border-r border-gray-300'>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={
              editor.isActive('bold')
                ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 shadow-sm ring-1 ring-blue-200'
                : ''
            }
            title='Bold (Ctrl+B)'
          >
            <Bold className='h-4 w-4' />
          </Button>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={
              editor.isActive('italic')
                ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 shadow-sm ring-1 ring-blue-200'
                : ''
            }
            title='Italic (Ctrl+I)'
          >
            <Italic className='h-4 w-4' />
          </Button>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={
              editor.isActive('underline')
                ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 shadow-sm ring-1 ring-blue-200'
                : ''
            }
            title='Underline (Ctrl+U)'
          >
            <UnderlineIcon className='h-4 w-4' />
          </Button>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={
              editor.isActive('strike')
                ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 shadow-sm ring-1 ring-blue-200'
                : ''
            }
            title='Strikethrough'
          >
            <Strikethrough className='h-4 w-4' />
          </Button>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={
              editor.isActive('code')
                ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 shadow-sm ring-1 ring-blue-200'
                : ''
            }
            title='Inline Code'
          >
            <Code className='h-4 w-4' />
          </Button>
        </div>

        {/* Headings */}
        <div className='flex gap-1 pr-3 border-r border-gray-300'>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={
              editor.isActive('heading', { level: 1 })
                ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 shadow-sm ring-1 ring-blue-200'
                : ''
            }
            title='Heading 1'
          >
            <Heading1 className='h-4 w-4' />
          </Button>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={
              editor.isActive('heading', { level: 2 })
                ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 shadow-sm ring-1 ring-blue-200'
                : ''
            }
            title='Heading 2'
          >
            <Heading2 className='h-4 w-4' />
          </Button>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={
              editor.isActive('heading', { level: 3 })
                ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 shadow-sm ring-1 ring-blue-200'
                : ''
            }
            title='Heading 3'
          >
            <Heading3 className='h-4 w-4' />
          </Button>
        </div>

        {/* Lists */}
        <div className='flex gap-1 pr-3 border-r border-gray-300'>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={
              editor.isActive('bulletList')
                ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 shadow-sm ring-1 ring-blue-200'
                : ''
            }
            title='Bullet List'
          >
            <List className='h-4 w-4' />
          </Button>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={
              editor.isActive('orderedList')
                ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 shadow-sm ring-1 ring-blue-200'
                : ''
            }
            title='Numbered List'
          >
            <ListOrdered className='h-4 w-4' />
          </Button>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            className={
              editor.isActive('taskList')
                ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 shadow-sm ring-1 ring-blue-200'
                : ''
            }
            title='Task List'
          >
            <ListTodo className='h-4 w-4' />
          </Button>
        </div>

        {/* Alignment */}
        <div className='flex gap-1 pr-3 border-r border-gray-300'>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={
              editor.isActive({ textAlign: 'left' })
                ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 shadow-sm ring-1 ring-blue-200'
                : ''
            }
            title='Align Left'
          >
            <AlignLeft className='h-4 w-4' />
          </Button>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={
              editor.isActive({ textAlign: 'center' })
                ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 shadow-sm ring-1 ring-blue-200'
                : ''
            }
            title='Align Center'
          >
            <AlignCenter className='h-4 w-4' />
          </Button>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={
              editor.isActive({ textAlign: 'right' })
                ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 shadow-sm ring-1 ring-blue-200'
                : ''
            }
            title='Align Right'
          >
            <AlignRight className='h-4 w-4' />
          </Button>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className={
              editor.isActive({ textAlign: 'justify' })
                ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 shadow-sm ring-1 ring-blue-200'
                : ''
            }
            title='Justify'
          >
            <AlignJustify className='h-4 w-4' />
          </Button>
        </div>

        {/* Other */}
        <div className='flex gap-1 pr-3 border-r border-gray-300'>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={setLink}
            className={
              editor.isActive('link')
                ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 shadow-sm ring-1 ring-blue-200'
                : ''
            }
            title='Insert Link'
          >
            <LinkIcon className='h-4 w-4' />
          </Button>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={
              editor.isActive('blockquote')
                ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 shadow-sm ring-1 ring-blue-200'
                : ''
            }
            title='Quote'
          >
            <Quote className='h-4 w-4' />
          </Button>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title='Horizontal Rule'
          >
            <Minus className='h-4 w-4' />
          </Button>
        </div>

        {/* Undo/Redo */}
        <div className='flex gap-1'>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title='Undo (Ctrl+Z)'
          >
            <Undo className='h-4 w-4' />
          </Button>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title='Redo (Ctrl+Y)'
          >
            <Redo className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  )
}
