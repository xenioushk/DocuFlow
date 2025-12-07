"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import { common, createLowlight } from "lowlight"

const lowlight = createLowlight(common)

interface TiptapEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export function TiptapEditor({ content, onChange, placeholder = "Start writing..." }: TiptapEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg",
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto focus:outline-none min-h-[300px] px-4 py-3",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  if (!editor) {
    return null
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href
    const url = window.prompt("URL", previousUrl)

    if (url === null) {
      return
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
  }

  const addImage = () => {
    const url = window.prompt("Image URL")
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-gray-50">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`px-3 py-1.5 rounded text-sm font-medium transition ${editor.isActive("bold") ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}>
          <strong>B</strong>
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`px-3 py-1.5 rounded text-sm font-medium transition ${editor.isActive("italic") ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}>
          <em>I</em>
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={`px-3 py-1.5 rounded text-sm font-medium transition ${editor.isActive("strike") ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}>
          <s>S</s>
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleCode().run()} className={`px-3 py-1.5 rounded text-sm font-medium transition ${editor.isActive("code") ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}>
          {"</>"}
        </button>

        <div className="w-px h-8 bg-gray-300 mx-1" />

        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`px-3 py-1.5 rounded text-sm font-medium transition ${editor.isActive("heading", { level: 1 }) ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}>
          H1
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`px-3 py-1.5 rounded text-sm font-medium transition ${editor.isActive("heading", { level: 2 }) ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}>
          H2
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`px-3 py-1.5 rounded text-sm font-medium transition ${editor.isActive("heading", { level: 3 }) ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}>
          H3
        </button>

        <div className="w-px h-8 bg-gray-300 mx-1" />

        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`px-3 py-1.5 rounded text-sm font-medium transition ${editor.isActive("bulletList") ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}>
          •••
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`px-3 py-1.5 rounded text-sm font-medium transition ${editor.isActive("orderedList") ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}>
          123
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={`px-3 py-1.5 rounded text-sm font-medium transition ${editor.isActive("codeBlock") ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}>
          {"{ }"}
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`px-3 py-1.5 rounded text-sm font-medium transition ${editor.isActive("blockquote") ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}>
          ❝❞
        </button>

        <div className="w-px h-8 bg-gray-300 mx-1" />

        <button type="button" onClick={setLink} className="px-3 py-1.5 rounded text-sm font-medium bg-white text-gray-700 hover:bg-gray-100 transition">
          🔗
        </button>
        <button type="button" onClick={addImage} className="px-3 py-1.5 rounded text-sm font-medium bg-white text-gray-700 hover:bg-gray-100 transition">
          🖼️
        </button>

        <div className="w-px h-8 bg-gray-300 mx-1" />

        <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} className="px-3 py-1.5 rounded text-sm font-medium bg-white text-gray-700 hover:bg-gray-100 transition">
          ―
        </button>
        <button type="button" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className="px-3 py-1.5 rounded text-sm font-medium bg-white text-gray-700 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed">
          ↶
        </button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className="px-3 py-1.5 rounded text-sm font-medium bg-white text-gray-700 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed">
          ↷
        </button>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  )
}
