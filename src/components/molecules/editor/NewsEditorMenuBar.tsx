import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Editor } from '@tiptap/react'
import { Button } from '@/components/atoms/button'
import { Input } from '@/components/atoms/input'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/atoms/dialog'
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
  ImagePlus,
  Loader2,
  Highlighter,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Eraser,
  Table,
  Rows3,
  Columns3,
  Split,
  Merge,
  Trash2,
  CopyPlus,
} from 'lucide-react'

interface NewsEditorMenuBarProps {
  editor: Editor | null
  onSelectImage?: () => void
  isUploadingImage?: boolean
}

export const NewsEditorMenuBar: React.FC<NewsEditorMenuBarProps> = ({
  editor,
  onSelectImage,
  isUploadingImage = false,
}) => {
  const t = useTranslations('news.editor.menuBar')
  const tCommon = useTranslations('common')
  const [linkOpen, setLinkOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')

  if (!editor) return null

  const openLinkDialog = () => {
    const previousUrl = (editor.getAttributes('link').href as string) ?? ''
    setLinkUrl(previousUrl)
    setLinkOpen(true)
  }

  const applyLink = () => {
    const url = linkUrl.trim()
    if (url) {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url })
        .run()
    } else {
      // Empty input clears an existing link instead of inserting a broken one.
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
    }
    setLinkOpen(false)
  }

  const setTextColor = (event: React.ChangeEvent<HTMLInputElement>) => {
    editor.chain().focus().setColor(event.target.value).run()
  }

  const isInTable = editor.isActive('table')

  return (
    <>
      <div className='border-b border-border/70 bg-muted/40'>
        <div className='flex flex-wrap gap-1.5 p-3'>
          {/* Text formatting */}
          <div className='flex gap-1 pr-3 border-r border-border'>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={
                editor.isActive('bold')
                  ? 'bg-primary/12 text-primary ring-1 ring-primary/20'
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
                  ? 'bg-primary/12 text-primary ring-1 ring-primary/20'
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
                  ? 'bg-primary/12 text-primary ring-1 ring-primary/20'
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
                  ? 'bg-primary/12 text-primary ring-1 ring-primary/20'
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
                  ? 'bg-primary/12 text-primary ring-1 ring-primary/20'
                  : ''
              }
              title='Inline Code'
            >
              <Code className='h-4 w-4' />
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              className={
                editor.isActive('highlight')
                  ? 'bg-primary/12 text-primary ring-1 ring-primary/20'
                  : ''
              }
              title='Highlight'
            >
              <Highlighter className='h-4 w-4' />
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => editor.chain().focus().toggleSubscript().run()}
              className={
                editor.isActive('subscript')
                  ? 'bg-primary/12 text-primary ring-1 ring-primary/20'
                  : ''
              }
              title='Subscript'
            >
              <SubscriptIcon className='h-4 w-4' />
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => editor.chain().focus().toggleSuperscript().run()}
              className={
                editor.isActive('superscript')
                  ? 'bg-primary/12 text-primary ring-1 ring-primary/20'
                  : ''
              }
              title='Superscript'
            >
              <SuperscriptIcon className='h-4 w-4' />
            </Button>
            <label
              className='flex h-8 w-8 cursor-pointer items-center justify-center rounded-md hover:bg-accent text-foreground'
              title='Text Color'
            >
              <input
                type='color'
                onChange={setTextColor}
                className='h-6 w-6 cursor-pointer border-0 bg-transparent p-0'
                value={editor.getAttributes('textStyle').color || '#111827'}
              />
            </label>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() =>
                editor.chain().focus().unsetColor().unsetAllMarks().run()
              }
              title='Clear Formatting'
            >
              <Eraser className='h-4 w-4' />
            </Button>
          </div>

          {/* Headings */}
          <div className='flex gap-1 pr-3 border-r border-border'>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={
                editor.isActive('heading', { level: 1 })
                  ? 'bg-primary/12 text-primary ring-1 ring-primary/20'
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
                  ? 'bg-primary/12 text-primary ring-1 ring-primary/20'
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
                  ? 'bg-primary/12 text-primary ring-1 ring-primary/20'
                  : ''
              }
              title='Heading 3'
            >
              <Heading3 className='h-4 w-4' />
            </Button>
          </div>

          {/* Lists */}
          <div className='flex gap-1 pr-3 border-r border-border'>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={
                editor.isActive('bulletList')
                  ? 'bg-primary/12 text-primary ring-1 ring-primary/20'
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
                  ? 'bg-primary/12 text-primary ring-1 ring-primary/20'
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
                  ? 'bg-primary/12 text-primary ring-1 ring-primary/20'
                  : ''
              }
              title='Task List'
            >
              <ListTodo className='h-4 w-4' />
            </Button>
          </div>

          {/* Alignment */}
          <div className='flex gap-1 pr-3 border-r border-border'>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              className={
                editor.isActive({ textAlign: 'left' })
                  ? 'bg-primary/12 text-primary ring-1 ring-primary/20'
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
              onClick={() =>
                editor.chain().focus().setTextAlign('center').run()
              }
              className={
                editor.isActive({ textAlign: 'center' })
                  ? 'bg-primary/12 text-primary ring-1 ring-primary/20'
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
                  ? 'bg-primary/12 text-primary ring-1 ring-primary/20'
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
              onClick={() =>
                editor.chain().focus().setTextAlign('justify').run()
              }
              className={
                editor.isActive({ textAlign: 'justify' })
                  ? 'bg-primary/12 text-primary ring-1 ring-primary/20'
                  : ''
              }
              title='Justify'
            >
              <AlignJustify className='h-4 w-4' />
            </Button>
          </div>

          {/* Other */}
          <div className='flex gap-1 pr-3 border-r border-border'>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={onSelectImage}
              disabled={!onSelectImage || isUploadingImage}
              title='Insert Image'
            >
              {isUploadingImage ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                <ImagePlus className='h-4 w-4' />
              )}
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={openLinkDialog}
              className={
                editor.isActive('link')
                  ? 'bg-primary/12 text-primary ring-1 ring-primary/20'
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
                  ? 'bg-primary/12 text-primary ring-1 ring-primary/20'
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

          {/* Table */}
          <div className='flex gap-1 pr-3 border-r border-border'>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                  .run()
              }
              title='Insert Table'
            >
              <Table className='h-4 w-4' />
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => editor.chain().focus().addRowAfter().run()}
              disabled={!isInTable}
              title='Add Row'
            >
              <Rows3 className='h-4 w-4' />
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => editor.chain().focus().deleteRow().run()}
              disabled={!isInTable}
              title='Delete Row'
            >
              <Rows3 className='h-4 w-4 text-red-600' />
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              disabled={!isInTable}
              title='Add Column'
            >
              <Columns3 className='h-4 w-4' />
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => editor.chain().focus().deleteColumn().run()}
              disabled={!isInTable}
              title='Delete Column'
            >
              <Columns3 className='h-4 w-4 text-red-600' />
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => editor.chain().focus().duplicateRow(true).run()}
              disabled={!isInTable}
              title='Duplicate Row'
            >
              <CopyPlus className='h-4 w-4' />
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => editor.chain().focus().duplicateColumn(true).run()}
              disabled={!isInTable}
              title='Duplicate Column'
            >
              <CopyPlus className='h-4 w-4 rotate-90' />
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => editor.chain().focus().mergeCells().run()}
              disabled={!isInTable}
              title='Merge Cells'
            >
              <Merge className='h-4 w-4' />
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => editor.chain().focus().splitCell().run()}
              disabled={!isInTable}
              title='Split Cell'
            >
              <Split className='h-4 w-4' />
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => editor.chain().focus().toggleHeaderRow().run()}
              disabled={!isInTable}
              title='Toggle Header Row'
            >
              <span className='text-xs font-medium'>HR</span>
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => editor.chain().focus().toggleHeaderColumn().run()}
              disabled={!isInTable}
              title='Toggle Header Column'
            >
              <span className='text-xs font-medium'>HC</span>
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => editor.chain().focus().deleteTable().run()}
              disabled={!isInTable}
              title='Delete Table'
            >
              <Trash2 className='h-4 w-4' />
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

      {/* Insert-link dialog (replaces native window.prompt) */}
      <Dialog open={linkOpen} onOpenChange={setLinkOpen}>
        <DialogContent className='max-w-sm'>
          <DialogHeader>
            <DialogTitle>{t('linkTitle')}</DialogTitle>
          </DialogHeader>
          <Input
            autoFocus
            value={linkUrl}
            placeholder={t('enterUrl')}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                applyLink()
              }
            }}
          />
          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => setLinkOpen(false)}
              className='flex-1 sm:flex-none'
            >
              {tCommon('cancel')}
            </Button>
            <Button
              type='button'
              onClick={applyLink}
              className='flex-1 sm:flex-none'
            >
              {t('insert')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
