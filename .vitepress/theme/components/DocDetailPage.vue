<template>
  <div class="doc-detail-wrapper bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
    <div class="main-layout flex max-w-[1600px] mx-auto">
      <!-- 主内容区 -->
      <main 
        :class="[
          'flex-1 min-w-0 p-6 lg:p-10 pt-24 transition-all duration-300 ease-in-out vp-doc',
          isTocVisible ? 'lg:pr-[320px]' : 'lg:pr-10'
        ]"
      >
        <div :class="['mx-auto transition-all duration-300 max-w-4xl']">
          <!-- 文档头部 -->
          <header class="mb-10">
            <h1 class="text-4xl lg:text-5xl font-black leading-[1.15] tracking-tight mb-4">{{ doc?.title }}</h1>
            
            <div class="flex flex-wrap gap-2 mb-6">
              <span :class="getCategoryClass()">{{ doc?.category }}</span>
              <span v-for="(tag, index) in doc?.tags?.slice(0, 5)" :key="tag" :class="getTagClass(index)">
                {{ tag }}
              </span>
            </div>
            
            <div class="flex items-center gap-6 text-sm text-text-light/60 dark:text-text-dark/60 border-t border-border-light dark:border-border-dark pt-6">
              <span class="flex items-center gap-2">
                <span class="material-symbols-outlined text-base">person</span>
                {{ doc?.author }}
              </span>
              <span class="flex items-center gap-2">
                <span class="material-symbols-outlined text-base">calendar_today</span>
                {{ formatDate(doc?.date) }}
              </span>
            </div>
          </header>

          <!-- 文档内容 -->
          <article class="doc-content prose prose-lg dark:prose-invert max-w-none">
            <Content />
          </article>
        </div>
      </main>

      <!-- 右侧浮动目录 -->
      <Transition name="slide-fade">
        <aside 
          v-if="isTocVisible"
          class="hidden lg:block fixed right-10 top-24 w-64 max-h-[calc(85vh-120px)] rounded-2xl border border-white/20 dark:border-white/10 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col z-40 transition-all duration-500"
        >
          <div class="p-6 border-b border-border-light/50 dark:border-border-dark/50 flex items-center justify-between bg-white/30 dark:bg-black/20">
            <h3 class="text-[11px] font-bold uppercase tracking-[0.2em] text-text-light/50 dark:text-text-dark/50">目录预览</h3>
            <span class="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded-md font-black tracking-tighter">TOC</span>
          </div>
          <nav class="toc flex-1 overflow-y-auto p-4 custom-scrollbar">
            <ul class="space-y-1">
              <template v-for="(item, index) in toc" :key="item.slug">
                <li 
                  v-if="isItemVisible(item)"
                  :style="{ paddingLeft: `${(item.level - 2) * 0.75}rem` }"
                  class="group"
                >
                  <div class="flex items-center gap-1">
                    <!-- 折叠开关图标 -->
                    <button 
                      v-if="item.level === 2 && hasChildren(item.slug, index)"
                      @click="toggleSection(item.slug)"
                      class="w-5 h-5 flex items-center justify-center rounded hover:bg-primary/10 text-text-light/40 hover:text-primary transition-colors"
                    >
                      <span class="material-symbols-outlined text-[16px] transition-transform duration-200" :class="{ 'rotate-90': expandedSections.has(item.slug) }">
                        chevron_right
                      </span>
                    </button>
                    <div v-else-if="item.level > 2" class="w-1.5 h-1.5 rounded-full bg-border-light dark:bg-border-dark ml-2 mr-2 opacity-50"></div>
                    
                    <a
                      :href="`#${item.slug}`"
                      :class="[
                        'flex-1 block py-2 text-sm transition-all duration-300 border-l-2 pl-4 rounded-r-lg',
                        activeSlug === item.slug 
                          ? 'text-primary font-bold border-primary bg-primary/10' 
                          : item.level === 2 
                            ? 'text-text-light/80 dark:text-text-dark/80 border-transparent hover:text-primary hover:bg-primary/5'
                            : 'text-text-light/50 dark:text-text-dark/50 border-transparent hover:text-primary hover:bg-primary/5 text-[13px]'
                      ]"
                      @click.prevent="scrollToHeading(item)"
                    >
                      {{ item.text }}
                    </a>
                  </div>
                </li>
              </template>
            </ul>
          </nav>
        </aside>
      </Transition>

      <!-- 交互控制 -->
      <button 
        @click="isTocVisible = !isTocVisible"
        class="fixed right-8 bottom-32 z-50 flex items-center justify-center w-11 h-11 rounded-full bg-primary text-white shadow-lg hover:scale-110 hover:shadow-primary/30 transition-all duration-300 active:scale-95"
        title="展示/隐藏目录"
      >
        <span class="material-symbols-outlined text-[20px]">{{ isTocVisible ? 'menu_open' : 'toc' }}</span>
      </button>

      <Transition name="fade">
        <button 
          v-if="showBackToTop"
          @click="scrollToTop"
          class="fixed right-8 bottom-8 z-50 flex items-center justify-center w-11 h-11 rounded-full bg-card-light dark:bg-card-dark text-primary border border-border-light dark:border-border-dark shadow-lg hover:scale-110 hover:border-primary/50 transition-all duration-300 active:scale-95"
          title="回到顶部"
        >
          <span class="material-symbols-outlined text-[20px]">arrow_upward</span>
        </button>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useData } from 'vitepress'
import type { Doc, TocItem } from '../../data/docs.data'

const props = defineProps<{ doc: Doc | null }>()
const { page } = useData()

const activeSlug = ref('')
const isTocVisible = ref(true) 
const showBackToTop = ref(false)
const expandedSections = ref<Set<string>>(new Set())

const colorStyles = [
  { bg: 'bg-blue-100',   text: 'text-blue-800',   darkBg: 'dark:bg-blue-900',   darkText: 'dark:text-blue-200'   },
  { bg: 'bg-red-100',    text: 'text-red-800',    darkBg: 'dark:bg-red-900',    darkText: 'dark:text-red-200'    },
  { bg: 'bg-yellow-100', text: 'text-yellow-800', darkBg: 'dark:bg-yellow-900', darkText: 'dark:text-yellow-200' },
  { bg: 'bg-green-100',  text: 'text-green-800',  darkBg: 'dark:bg-green-900',  darkText: 'dark:text-green-200'  },
  { bg: 'bg-purple-100', text: 'text-purple-800', darkBg: 'dark:bg-purple-900', darkText: 'dark:text-purple-200' },
  { bg: 'bg-pink-100',   text: 'text-pink-800',   darkBg: 'dark:bg-pink-900',   darkText: 'dark:text-pink-200'   },
  { bg: 'bg-indigo-100', text: 'text-indigo-800', darkBg: 'dark:bg-indigo-900', darkText: 'dark:text-indigo-200' },
  { bg: 'bg-teal-100',   text: 'text-teal-800',   darkBg: 'dark:bg-teal-900',   darkText: 'dark:text-teal-200'   },
  { bg: 'bg-orange-100', text: 'text-orange-800', darkBg: 'dark:bg-orange-900', darkText: 'dark:text-orange-200' },
  { bg: 'bg-cyan-100',   text: 'text-cyan-800',   darkBg: 'dark:bg-cyan-900',   darkText: 'dark:text-cyan-200'   },
]

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash)
}

function getCategoryClass() {
  const color = colorStyles[hashString(props.doc?.category || '') % colorStyles.length]
  return `inline-block rounded px-3 py-1 text-xs font-bold uppercase tracking-wider ${color.bg} ${color.text} ${color.darkBg} ${color.darkText}`
}

function getTagClass(index: number) {
  const color = colorStyles[(index + 3) % colorStyles.length]
  return `inline-block rounded px-3 py-1 text-xs font-medium ${color.bg} ${color.text} ${color.darkBg} ${color.darkText}`
}

function formatDate(dateStr: string | undefined) {
  if (!dateStr) return ''
  try { return new Date(dateStr).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }) } catch { return dateStr }
}

// ================= TOC 原生重构 =================
// 扁平化渲染 Headers
function flattenHeaders(headers: any[], result: any[] = []) {
  for (const h of headers) {
    result.push({
      level: h.level,
      text: h.title,
      slug: h.slug
    })
    if (h.children && h.children.length > 0) {
      flattenHeaders(h.children, result)
    }
  }
  return result
}

const toc = computed<TocItem[]>(() => {
  const headers = page.value.headers || []
  if (headers.length > 0) {
    return flattenHeaders(headers)
  }
  // 如果原生 Headers 为空 (可能是由于路由加载问题)，回退到扫描生成的 TOC
  return props.doc?.toc || []
})

function toggleSection(slug: string) {
  if (expandedSections.value.has(slug)) {
    expandedSections.value.delete(slug)
  } else {
    expandedSections.value.add(slug)
  }
}

function isItemVisible(item: TocItem) {
  if (item.level <= 2) return true
  const idx = toc.value.findIndex(t => t.slug === item.slug)
  for(let i = idx; i >= 0; i--) {
    if (toc.value[i].level === 2) {
      return expandedSections.value.has(toc.value[i].slug)
    }
  }
  return false
}

function hasChildren(slug: string, index: number) {
  const nextItem = toc.value[index + 1]
  return nextItem && nextItem.level > 2
}

function findHeadingElement(slug: string, text: string) {
  let el = document.getElementById(slug)
  if (el) return el
  
  const alternativeId = slug.replace(/\./g, '-')
  el = document.getElementById(alternativeId)
  if (el) return el

  const headings = document.querySelectorAll('.doc-content h2, .doc-content h3, .doc-content h4')
  for (const h of headings) {
    if (h.textContent?.trim() === text || h.getAttribute('id')?.includes(slug)) {
      return h
    }
  }
  return null
}

function scrollToHeading(item: TocItem) {
  const element = findHeadingElement(item.slug, item.text)
  if (element) {
    const yOffset = -80;
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({top: y, behavior: 'smooth'});
    activeSlug.value = item.slug;
  } else {
    window.location.hash = item.slug
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function handleScroll() {
  const headings = document.querySelectorAll('.doc-content h2, .doc-content h3, .doc-content h4')
  let currentSlug = ''
  for (const heading of headings) {
    if (heading.getBoundingClientRect().top <= 120) currentSlug = heading.id
  }
  if (currentSlug) {
    activeSlug.value = currentSlug
    const currentIdx = toc.value.findIndex(t => t.slug === currentSlug)
    if (currentIdx !== -1) {
      for (let i = currentIdx; i >= 0; i--) {
        if (toc.value[i].level === 2) {
          expandedSections.value.add(toc.value[i].slug)
          break
        }
      }
    }
  }
  showBackToTop.value = window.scrollY > 400
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  if (toc.value.length > 0) activeSlug.value = toc.value[0].slug
})
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<style>
/* 0. Mermaid 深色模式适配 */
.dark .mermaid-diagram svg {
  filter: brightness(0.9) contrast(1.1);
}
.dark .mermaid-diagram .node rect,
.dark .mermaid-diagram .node circle,
.dark .mermaid-diagram .node ellipse,
.dark .mermaid-diagram .node polygon,
.dark .mermaid-diagram .node path {
  fill: #1a2530 !important;
  stroke: #137fec !important;
}
.dark .mermaid-diagram .label,
.dark .mermaid-diagram .edgeLabel,
.dark .mermaid-diagram text {
  fill: #e0e0e0 !important;
  color: #e0e0e0 !important;
}
.dark .mermaid-diagram .edgePath .path {
  stroke: #2c3a47 !important;
}
.dark .mermaid-diagram .marker {
  fill: #2c3a47 !important;
  stroke: #2c3a47 !important;
}

/* 1. 标题渲染修复 */
.vp-doc h1, .vp-doc h2, .vp-doc h3, .vp-doc h4 {
  line-height: 1.35 !important;
  font-weight: 800;
  letter-spacing: -0.025em;
  color: var(--vp-c-text-1);
}

/* 2. 内容与图片/组件边距修复 */
.doc-content img, .doc-content iframe, .doc-content video, .doc-content .video-player, .doc-content .audio-player {
  margin: 2.5rem 0 !important;
  border-radius: 1rem;
  box-shadow: 0 10px 30px -10px rgba(0,0,0,0.1);
  max-width: 100%;
}

/* 3. 表格渲染修复 */
.doc-content table {
  display: block;
  width: 100%;
  overflow-x: auto;
  border-collapse: collapse;
  margin: 2rem 0;
}
.doc-content th { background-color: var(--vp-c-bg-soft); font-weight: 700; text-align: left; }
.doc-content th, .doc-content td { border: 1px solid var(--vp-c-divider); padding: 0.85rem 1rem; min-width: 120px; }

/* 4. 代码高亮 */
.vp-doc div[class*='language-'] { margin: 1.5rem 0 !important; border-radius: 0.75rem !important; overflow: hidden; }
.vp-doc pre { margin: 0 !important; padding: 1.25rem !important; background-color: var(--vp-code-block-bg) !important; }

/* 5. 动画效果 - 核心：消除晃动 */
.vp-doc {
  transition: padding 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.mx-auto {
  transition: max-width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-fade-enter-from, .slide-fade-leave-to {
  transform: translateX(30px);
  opacity: 0;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* 6. 自定义滚动条 - 修复滚动失效 */
.toc {
  max-height: 55vh !important;
  overflow-y: auto !important;
  scrollbar-width: thin;
  scrollbar-color: rgba(19, 127, 236, 0.2) transparent;
  -webkit-overflow-scrolling: touch;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(19, 127, 236, 0.2);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(19, 127, 236, 0.5);
}

/* 响应式调整 */
@media (max-width: 1024px) {
  .doc-content { font-size: 1rem; }
  .vp-doc h1 { font-size: 2.25rem !important; }
}
</style>
