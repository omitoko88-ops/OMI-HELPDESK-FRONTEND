import React, { useState, useEffect, useRef } from 'react'
import {
  Search,
  Settings,
  ChevronRight,
  ChevronDown,
  FileText,
  CheckCircle2,
  Bell,
  MoreHorizontal,
  Star,
  Info,
  Code,
  Eye,
  Command,
  User,
  Sparkles,
  X,
  Plus,
  GripVertical,
  Bold,
  Italic,
  Underline,
  Link,
  MessageSquare,
  Type,
  Image as ImageIcon,
  List,
  Undo,
  Redo,
} from 'lucide-react'
import { MoreDotIcon } from '@/icons'

type ActiveMode = 'edit' | 'preview'
type CodeTab = 'npm' | 'php'
type ActiveToc =
  | 'intro'
  | 'req'
  | 'install'
  | 'install-npm'
  | 'install-composer'
  | 'next'
type ActiveDoc = 'quickstart' | 'basic' | 'installation' | 'composer'

interface ExpandedFolders {
  installation: boolean
  gettingStarted: boolean
  [key: string]: boolean
}

interface BubbleMenu {
  show: boolean
  top: number
  left: number
}

interface BlockProps {
  children: React.ReactNode
  activeMode: ActiveMode
  editable?: boolean
  className?: string
}

const Block: React.FC<BlockProps> = ({
  children,
  activeMode,
  editable = true,
  className = '',
}) => (
  <div className="relative group">
    {activeMode === 'edit' && (
      <div className="absolute -left-12 top-0.5 w-10 flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity pr-2 space-x-0.5 select-none z-10">
        <button
          contentEditable={false}
          className="text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded p-0.5 transition-colors"
          title="Klik untuk tambah block"
        >
          <Plus className="w-[15px] h-[15px]" />
        </button>
        <button
          contentEditable={false}
          className="text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded p-0.5 transition-colors cursor-grab active:cursor-grabbing"
          title="Tarik untuk memindahkan"
        >
          <GripVertical className="w-[15px] h-[15px]" />
        </button>
      </div>
    )}
    <div
      contentEditable={activeMode === 'edit' && editable}
      suppressContentEditableWarning
      className={`outline-none ${className}`}
    >
      {children}
    </div>
  </div>
)

export default function Example() {
  const [expandedFolders, setExpandedFolders] = useState<ExpandedFolders>({
    installation: true,
    gettingStarted: false,
  })
  const [activeMode, setActiveMode] = useState<ActiveMode>('edit')
  const [codeTab, setCodeTab] = useState<CodeTab>('npm')
  const [activeToc, setActiveToc] = useState<ActiveToc>('intro')

  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false)
  const [toast, setToast] = useState<string | null>(null)
  const [activeDoc, setActiveDoc] = useState<ActiveDoc>('installation')

  const [bubbleMenu, setBubbleMenu] = useState<BubbleMenu>({
    show: false,
    top: 0,
    left: 0,
  })
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const showToast = (message: string) => {
    setToast(message)
  }

  const toggleFolder = (folder: keyof ExpandedFolders) => {
    setExpandedFolders((prev) => ({ ...prev, [folder]: !prev[folder] }))
  }

  const handleSelection = () => {
    if (activeMode !== 'edit') {
      setBubbleMenu({ show: false, top: 0, left: 0 })
      return
    }

    const selection = window.getSelection()
    if (selection && selection.toString().trim() !== '') {
      const range = selection.getRangeAt(0)
      const rect = range.getBoundingClientRect()

      setBubbleMenu({
        show: true,
        top: rect.top - 48,
        left: rect.left + rect.width / 2,
      })
    } else {
      setBubbleMenu({ show: false, top: 0, left: 0 })
    }
  }

  return (
    <div className="flex h-screen w-full bg-white text-slate-800 font-sans overflow-hidden">
      {/* LEFT SIDEBAR */}
      <aside className="w-[260px] flex-shrink-0 border-r border-slate-200 bg-[#FAFBFC] flex flex-col hidden md:flex">
        {/* Workspace Header */}
        <div className="h-14 flex items-center px-4 hover:bg-slate-100 cursor-pointer border-b border-transparent transition-colors">
          <div className="w-6 h-6 rounded bg-indigo-600 text-white flex items-center justify-center text-xs font-bold mr-3 shadow-sm">
            N
          </div>
          <span className="font-semibold text-sm flex-1">Netra Workspace</span>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </div>

        {/* Quick Actions */}
        <div className="px-3 pt-4 pb-2 space-y-1">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-full flex items-center px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-200/50 rounded-md transition-colors group"
          >
            <Search className="w-4 h-4 mr-3 text-slate-400 group-hover:text-slate-600" />
            <span className="flex-1 text-left">Search</span>
            <div className="flex items-center space-x-1 text-xs text-slate-400">
              <Command className="w-3 h-3" />
              <span>K</span>
            </div>
          </button>
          <button
            onClick={() => showToast('Membuka menu Settings...')}
            className="w-full flex items-center px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-200/50 rounded-md transition-colors group"
          >
            <Settings className="w-4 h-4 mr-3 text-slate-400 group-hover:text-slate-600" />
            <span>Settings</span>
          </button>
        </div>

        {/* Navigation Tree */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <div className="text-xs font-semibold text-slate-400 tracking-wider mb-3 px-2">
            DOKUMENTASI
          </div>

          <div className="space-y-0.5">
            {/* Getting Started */}
            <div>
              <div
                onClick={() => toggleFolder('gettingStarted')}
                className="flex items-center px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-200/50 rounded-md cursor-pointer transition-colors"
              >
                {expandedFolders.gettingStarted ? (
                  <ChevronDown className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                )}
                <FileText className="w-4 h-4 mr-2 text-slate-400" />
                <span>Getting Started</span>
              </div>
              {expandedFolders.gettingStarted && (
                <div className="ml-7 mt-1 space-y-0.5 relative before:absolute before:left-[-12px] before:top-0 before:bottom-0 before:w-px before:bg-slate-200">
                  <div
                    onClick={() => setActiveDoc('quickstart')}
                    className={`px-2 py-1.5 text-sm cursor-pointer rounded-md transition-colors ${activeDoc === 'quickstart' ? 'text-indigo-600 bg-indigo-50 font-medium' : 'text-slate-500 hover:text-slate-900'}`}
                  >
                    Quick Start
                  </div>
                  <div
                    onClick={() => setActiveDoc('basic')}
                    className={`px-2 py-1.5 text-sm cursor-pointer rounded-md transition-colors ${activeDoc === 'basic' ? 'text-indigo-600 bg-indigo-50 font-medium' : 'text-slate-500 hover:text-slate-900'}`}
                  >
                    Basic Concepts
                  </div>
                </div>
              )}
            </div>

            {/* Installation Guide */}
            <div>
              <div
                onClick={() => toggleFolder('installation')}
                className={`flex items-center px-2 py-1.5 text-sm rounded-md cursor-pointer font-medium transition-colors ${
                  expandedFolders.installation
                    ? 'text-indigo-700 bg-indigo-50'
                    : 'text-slate-600 hover:bg-slate-200/50'
                }`}
              >
                {expandedFolders.installation ? (
                  <ChevronDown
                    className={`w-3.5 h-3.5 mr-1.5 ${expandedFolders.installation ? 'text-indigo-500' : 'text-slate-400'}`}
                  />
                ) : (
                  <ChevronRight
                    className={`w-3.5 h-3.5 mr-1.5 ${expandedFolders.installation ? 'text-indigo-500' : 'text-slate-400'}`}
                  />
                )}
                <FileText
                  className={`w-4 h-4 mr-2 ${expandedFolders.installation ? 'text-indigo-500' : 'text-slate-400'}`}
                />
                <span>Installation Guide</span>
              </div>
              {/* Children */}
              {expandedFolders.installation && (
                <div className="ml-7 mt-1 space-y-0.5 relative before:absolute before:left-[-12px] before:top-0 before:bottom-0 before:w-px before:bg-slate-200">
                  <div
                    onClick={() => setActiveDoc('installation')}
                    className={`px-2 py-1.5 text-sm cursor-pointer rounded-md transition-colors ${activeDoc === 'installation' ? 'text-indigo-600 bg-indigo-50 font-medium' : 'text-slate-500 hover:text-slate-900'}`}
                  >
                    NPM Setup
                  </div>
                  <div
                    onClick={() => setActiveDoc('composer')}
                    className={`px-2 py-1.5 text-sm cursor-pointer rounded-md transition-colors ${activeDoc === 'composer' ? 'text-indigo-600 bg-indigo-50 font-medium' : 'text-slate-500 hover:text-slate-900'}`}
                  >
                    Composer Setup
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* User Footer */}
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center hover:bg-slate-100 p-2 -mx-2 rounded-md cursor-pointer transition-colors">
            <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 mr-3">
              <User className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium text-slate-700">
              Developer
            </span>
          </div>
        </div>
      </aside>

      {}
      <main className="flex-1 flex flex-col min-w-0 bg-white relative">
        {/* Top Header */}
        <header className="h-14 border-b border-slate-100 flex items-center justify-between px-6 flex-shrink-0 bg-white/80 backdrop-blur-sm z-10 sticky top-0">
          {/* Breadcrumbs */}
          <div className="flex items-center text-sm text-slate-500">
            <span className="hover:text-slate-800 cursor-pointer transition-colors">
              Dokumentasi
            </span>
            <span className="mx-2 text-slate-300">/</span>
            <span className="text-slate-800 font-medium">
              Installation Guide
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Toggle Mode */}
            <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200/50 text-sm">
              <button
                onClick={() => setActiveMode('edit')}
                className={`flex items-center px-3 py-1 rounded-md font-medium transition-all ${
                  activeMode === 'edit'
                    ? 'bg-white shadow-sm text-slate-700'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Code
                  className={`w-4 h-4 mr-2 ${activeMode === 'edit' ? 'text-slate-500' : ''}`}
                />
                Edit
              </button>
              <button
                onClick={() => setActiveMode('preview')}
                className={`flex items-center px-3 py-1 rounded-md font-medium transition-all ${
                  activeMode === 'preview'
                    ? 'bg-white shadow-sm text-slate-700'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Eye
                  className={`w-4 h-4 mr-2 ${activeMode === 'preview' ? 'text-slate-500' : ''}`}
                />
                Preview
              </button>
            </div>

            {/* Status */}
            <div className="flex items-center text-emerald-600 text-sm font-medium bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 hidden lg:flex">
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              Saved to cloud
            </div>

            <button
              onClick={() => showToast('Tidak ada notifikasi baru')}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <Bell className="w-5 h-5" />
            </button>
            <button
              onClick={() => showToast('Opsi lainnya belum tersedia')}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
            <button
              onClick={() => showToast('🚀 Perubahan berhasil dipublikasikan!')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              Publish
            </button>
          </div>
        </header>

        {}
        <div
          className="flex-1 overflow-y-auto pb-32 relative scroll-smooth"
          onMouseUp={handleSelection}
          onKeyUp={handleSelection}
          ref={editorRef}
        >
          <div className="max-w-4xl mx-auto px-8 py-12 lg:px-16">
            {/* Title Section */}
            <div className="mb-8 relative group">
              <Block activeMode={activeMode}>
                <div className="text-6xl mb-6">🚀</div>
              </Block>

              <Block activeMode={activeMode} className="mb-5">
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                  Installation Guide
                </h1>
              </Block>

              {/* Badges */}
              <div
                className="flex items-center space-x-3 mb-8"
                contentEditable={false}
              >
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/50">
                  <Star className="w-3.5 h-3.5 mr-1.5 fill-amber-500 text-amber-500" />
                  Featured
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                  Core API
                </span>
              </div>
            </div>

            {/* Content Body (WYSIWYG) */}
            <div className="prose prose-slate max-w-none prose-p:leading-relaxed prose-p:text-slate-600 prose-headings:text-slate-900 animate-in fade-in duration-200">
              <Block activeMode={activeMode}>
                <p className="text-base text-slate-600 leading-7">
                  Selamat datang di dokumentasi resmi DocuFlow. Sebelum memulai
                  pengembangan, Anda perlu menginstal{' '}
                  <em className="text-slate-800 not-italic font-medium bg-slate-100 px-1 py-0.5 rounded">
                    core package
                  </em>{' '}
                  kami melalui package manager pilihan Anda. Pastikan sistem
                  Anda telah memenuhi{' '}
                  <a
                    href="#"
                    className="text-indigo-600 hover:underline text-base cursor-text"
                  >
                    persyaratan minimum
                  </a>
                  .
                </p>
              </Block>

              {/* Info Alert Box */}
              <Block activeMode={activeMode} editable={false}>
                <div className="my-8 bg-[#F0F7FF] border border-[#E0F2FE] rounded-xl p-4 flex gap-4 shadow-sm">
                  <div className="mt-0.5" contentEditable={false}>
                    <Info className="w-5 h-5 text-blue-500" />
                  </div>
                  <div
                    contentEditable={activeMode === 'edit'}
                    suppressContentEditableWarning
                    className="outline-none"
                  >
                    <p className="text-sm text-slate-700 leading-relaxed m-0">
                      <strong className="font-semibold text-slate-900">
                        Tips Cepat:
                      </strong>{' '}
                      Jika Anda menggunakan MacOS, kami merekomendasikan
                      instalasi menggunakan Homebrew untuk manajemen dependensi
                      yang lebih mulus.
                    </p>
                  </div>
                </div>
              </Block>

              <Block activeMode={activeMode}>
                <h2 className="text-2xl font-bold mt-12 mb-6 tracking-tight text-slate-900">
                  Instalasi Package
                </h2>
              </Block>

              {}
              {/* Code Block with Tabs */}
              <Block activeMode={activeMode} editable={false}>
                <div
                  className="my-6 bg-[#1A1B26] rounded-xl overflow-hidden shadow-lg border border-slate-800 font-mono"
                  contentEditable={false}
                >
                  {/* Code Header */}
                  <div className="flex items-center justify-between px-4 h-12 border-b border-slate-700/50 bg-[#1A1B26]">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
                      <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                      <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
                    </div>

                    {/* Tabs */}
                    <div className="flex items-center h-full space-x-1">
                      <button
                        onClick={() => setCodeTab('npm')}
                        className={`h-full px-4 text-xs font-semibold flex items-center transition-colors ${
                          codeTab === 'npm'
                            ? 'text-blue-400 border-b-2 border-blue-400'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        NPM
                      </button>
                      <button
                        onClick={() => setCodeTab('php')}
                        className={`h-full px-4 text-xs font-semibold flex items-center transition-colors ${
                          codeTab === 'php'
                            ? 'text-blue-400 border-b-2 border-blue-400'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        PHP
                      </button>
                    </div>
                  </div>

                  {/* Code Content */}
                  <div className="p-5 overflow-x-auto">
                    <div className="flex text-sm leading-relaxed">
                      <div className="text-slate-500 select-none pr-4 text-right border-r border-slate-700/50 mr-4">
                        <div>1</div>
                        <div>2</div>
                      </div>
                      <div className="text-slate-300">
                        {codeTab === 'npm' ? (
                          <>
                            <div>
                              <span className="text-[#F7768E]">npm</span>{' '}
                              install @dokumentasi/core
                            </div>
                            <div>
                              <span className="text-[#F7768E]">npm</span> run
                              dev
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              <span className="text-[#F7768E]">composer</span>{' '}
                              require dokumentasi/core
                            </div>
                            <div>
                              <span className="text-[#F7768E]">php</span>{' '}
                              artisan serve
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Block>

              {/* Placeholder text */}
              {activeMode === 'edit' && (
                <Block activeMode={activeMode}>
                  <div className="mt-6 text-slate-300 text-sm font-medium flex items-center mb-24 outline-none">
                    Ketik / untuk melihat perintah
                  </div>
                </Block>
              )}
            </div>
          </div>
        </div>

        {}
        {bubbleMenu.show && activeMode === 'edit' && (
          <div
            className="fixed z-50 bg-slate-800 shadow-xl border border-slate-700 rounded-lg flex items-center px-1 py-1 animate-in zoom-in-95 fade-in duration-150"
            style={{
              top: `${bubbleMenu.top}px`,
              left: `${bubbleMenu.left}px`,
              transform: 'translateX(-50%)',
            }}
          >
            <div className="flex items-center space-x-1 border-r border-slate-600 pr-1 mr-1">
              <button
                className="text-slate-300 hover:text-white hover:bg-slate-700 p-1.5 rounded transition-colors"
                title="Text Style"
              >
                <span className="text-xs font-semibold px-1">Text</span>
              </button>
            </div>
            <button className="text-slate-300 hover:text-white hover:bg-slate-700 p-1.5 rounded transition-colors">
              <Bold className="w-4 h-4" />
            </button>
            <button className="text-slate-300 hover:text-white hover:bg-slate-700 p-1.5 rounded transition-colors">
              <Italic className="w-4 h-4" />
            </button>
            <button className="text-slate-300 hover:text-white hover:bg-slate-700 p-1.5 rounded transition-colors">
              <Underline className="w-4 h-4" />
            </button>
            <button className="text-slate-300 hover:text-white hover:bg-slate-700 p-1.5 rounded transition-colors">
              <Link className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-slate-600 mx-1"></div>
            <button className="text-slate-300 hover:text-white hover:bg-slate-700 p-1.5 rounded transition-colors">
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Floating Toolbar (Edit Mode Only) */}
        {activeMode === 'edit' && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-40 animate-in slide-in-from-bottom-10 fade-in duration-300">
            <div className="bg-white/90 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200/80 rounded-full px-4 py-2 flex items-center space-x-2">
              <div className="flex items-center space-x-1 border-r border-slate-200 pr-2 mr-1">
                <button
                  className="text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 p-2 rounded-full transition-colors"
                  title="Heading"
                >
                  <Type className="w-4 h-4" />
                </button>
                <button
                  className="text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 p-2 rounded-full transition-colors"
                  title="List"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  className="text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 p-2 rounded-full transition-colors"
                  title="Image"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>
                <button
                  className="text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 p-2 rounded-full transition-colors"
                  title="Code Block"
                >
                  <Code className="w-4 h-4" />
                </button>
                <button
                  className="text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 p-2 rounded-full transition-colors"
                  title="More"
                >
                  <MoreDotIcon className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center space-x-1">
                <button className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 p-2 rounded-full transition-colors">
                  <Undo className="w-4 h-4" />
                </button>
                <button className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 p-2 rounded-full transition-colors">
                  <Redo className="w-4 h-4" />
                </button>
              </div>

              <div className="pl-3 border-l border-slate-200 ml-2">
                <button
                  onClick={() => showToast('Simpan draft...')}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-full transition-colors"
                >
                  Save Draft
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {}
      <aside className="w-[280px] flex-shrink-0 border-l border-slate-200 bg-white hidden lg:flex flex-col">
        <div className="p-6 flex-1 overflow-y-auto">
          <h4 className="text-xs font-semibold text-slate-400 tracking-wider mb-4 uppercase">
            On this page
          </h4>

          <nav className="space-y-1 text-sm border-l border-slate-200">
            {/* Items */}
            <button
              onClick={() => setActiveToc('intro')}
              className={`w-full text-left block py-1.5 pl-3 -ml-px border-l-2 transition-colors ${
                activeToc === 'intro'
                  ? 'border-indigo-600 text-indigo-600 font-medium'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              Introduction
            </button>

            <button
              onClick={() => setActiveToc('req')}
              className={`w-full text-left block py-1.5 pl-3 -ml-px border-l-2 transition-colors ${
                activeToc === 'req'
                  ? 'border-indigo-600 text-indigo-600 font-medium'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              Persyaratan Sistem
            </button>
            <button
              onClick={() => setActiveToc('install')}
              className={`w-full text-left block py-1.5 pl-3 -ml-px border-l-2 transition-colors ${
                activeToc === 'install'
                  ? 'border-indigo-600 text-indigo-600 font-medium'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              Instalasi Package
            </button>

            {/* Sub-items */}
            <div className="pl-6 space-y-1 mt-1">
              <button
                onClick={() => setActiveToc('install-npm')}
                className={`w-full text-left block py-1 transition-colors ${activeToc === 'install-npm' ? 'text-indigo-600 font-medium' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Menggunakan NPM
              </button>
              <button
                onClick={() => setActiveToc('install-composer')}
                className={`w-full text-left block py-1 transition-colors ${activeToc === 'install-composer' ? 'text-indigo-600 font-medium' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Menggunakan Composer
              </button>
            </div>

            <button
              onClick={() => setActiveToc('next')}
              className={`w-full text-left block py-1.5 pl-3 -ml-px border-l-2 transition-colors mt-1 ${
                activeToc === 'next'
                  ? 'border-indigo-600 text-indigo-600 font-medium'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              Langkah Selanjutnya
            </button>
          </nav>
        </div>

        {/* Auto-save Status Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm">
            <div className="flex items-center text-sm font-medium text-slate-700 mb-1">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-indigo-500" />
              Auto-Save Aktif
            </div>
            <p className="text-xs text-slate-500 leading-tight">
              Perubahan terakhir Anda disimpan beberapa detik yang lalu.
            </p>
          </div>
        </div>
      </aside>

      {}
      {/* MODAL SEARCH */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-24 md:pt-32 bg-slate-900/40 backdrop-blur-sm px-4"
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center px-4 py-3 border-b border-slate-100">
              <Search className="w-5 h-5 text-slate-400 mr-3" />
              <input
                type="text"
                autoFocus
                placeholder="Cari dokumentasi atau gunakan perintah..."
                className="flex-1 bg-transparent border-none focus:outline-none text-slate-800 text-base"
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 bg-slate-50/50">
              <div className="text-xs font-semibold text-slate-400 mb-3 px-2 tracking-wide uppercase">
                Pencarian Terakhir
              </div>
              <div className="space-y-1">
                <button className="w-full flex items-center px-2 py-2 text-sm text-slate-600 hover:bg-slate-200/60 hover:text-indigo-700 rounded-lg transition-colors font-medium">
                  <FileText className="w-4 h-4 mr-3 text-slate-400" />
                  Konfigurasi NPM Lanjutan
                </button>
                <button className="w-full flex items-center px-2 py-2 text-sm text-slate-600 hover:bg-slate-200/60 hover:text-indigo-700 rounded-lg transition-colors font-medium">
                  <FileText className="w-4 h-4 mr-3 text-slate-400" />
                  Mengatasi Error Instalasi MacOS
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center bg-slate-800 text-white px-4 py-3 rounded-xl shadow-2xl animate-in slide-in-from-bottom-5 fade-in duration-300">
          <Info className="w-4 h-4 mr-3 text-indigo-400" />
          <span className="text-sm font-medium">{toast}</span>
        </div>
      )}
    </div>
  )
}
