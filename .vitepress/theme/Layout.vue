<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useData, useRoute } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import HomePage from './components/HomePage.vue'
import DocsPage from './components/DocsPage.vue'
import DocDetailPage from './components/DocDetailPage.vue'
import AppsPage from './components/AppsPage.vue'
import GlobalFooter from './components/GlobalFooter.vue'
import ImageViewer from './components/ImageViewer.vue'
import CustomHeader from './components/CustomHeader.vue'
import VPLocalSearchBox from 'vitepress/dist/client/theme-default/components/VPLocalSearchBox.vue'
import { data as docsData } from '../data/docs.data'

const showSearch = ref(false)

const handleKeyDown = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    showSearch.value = true
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

const { frontmatter } = useData()
const route = useRoute()

// 判定是否为文档详情页：明确指定了 layout 或路径属于 /docs/ 且非文档列表页
const isDocDetail = computed(() => {
  return frontmatter.value.layout === 'doc-detail' || 
         (route.path.startsWith('/docs/') && frontmatter.value.layout !== 'docs' && route.path !== '/docs' && route.path !== '/docs/')
})

// 获取当前文档（用于从元数据中提取标题、标签等）
const currentDoc = computed(() => {
  const path = route.path
  // 提取 /docs/ 之后的路径部分，并移除后缀和斜杠
  const match = path.match(/^\/docs\/(.+?)(\.html)?\/?$/)
  if (match && docsData.docs) {
    const rawPath = match[1]
    // 与 scan-docs.js 保持一致的 ID 映射逻辑
    const docId = rawPath
      .split('/')
      .map(part => {
        return decodeURIComponent(part)
          .replace(/[^\u4e00-\u9fa5a-zA-Z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
      })
      .join('-')
    
    return docsData.docs.find(d => d.id === docId) || null
  }
  return null
})
</script>

<template>

  <!-- 全局顶部导航 -->
  <CustomHeader @search="showSearch = true" />

  <!-- 首页布局 -->
  <HomePage v-if="frontmatter.layout === 'home'" />

  <!-- 文档列表页布局 -->
  <DocsPage v-else-if="frontmatter.layout === 'docs'" />

  <!-- 文档详情页布局 -->
  <DocDetailPage v-else-if="isDocDetail" :doc="currentDoc" />

  <!-- 友链页布局 -->
  <AppsPage v-else-if="frontmatter.layout === 'apps'" />

  <!-- 默认 VitePress 布局 -->
  <DefaultTheme.Layout v-else>
    <template #layout-bottom>
      <GlobalFooter />
    </template>
  </DefaultTheme.Layout>

  <!-- 全局页脚（非默认布局） -->
  <GlobalFooter v-if="['home', 'docs', 'apps', 'doc-detail'].includes(frontmatter.layout) || isDocDetail" />

  <!-- 全局图片预览组件 -->
  <ImageViewer />

  <!-- VitePress 本地搜索弹窗容器 -->
  <VPLocalSearchBox v-if="showSearch" @close="showSearch = false" />
</template>

<style>
/* 搜索框全局样式美化 - 匹配项目 UI 风格 */
:root {
  --vp-local-search-bg: rgba(255, 255, 255, 0.8);
  --vp-local-search-result-selected-bg: rgba(19, 127, 236, 0.1);
  --vp-local-search-result-selected-border: #137fec;
  --vp-local-search-result-bg: transparent;
}

.dark {
  --vp-local-search-bg: rgba(26, 37, 48, 0.85);
  --vp-local-search-result-selected-bg: rgba(19, 127, 236, 0.15);
}

/* 弹窗主体美化 */
.VPLocalSearchBox .shell {
  border-radius: 20px !important;
  backdrop-filter: blur(24px) saturate(180%) !important;
  -webkit-backdrop-filter: blur(24px) saturate(180%) !important;
  border: 1px solid var(--vp-c-divider) !important;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
  overflow: hidden;
  padding: 16px !important;
}

/* 搜索输入框美化 */
.VPLocalSearchBox .search-bar {
  border-radius: 12px !important;
  background-color: var(--vp-c-bg-soft) !important;
  border: 1.5px solid transparent !important;
  transition: all 0.2s ease;
  height: 48px;
}

.VPLocalSearchBox .search-bar:focus-within {
  border-color: #137fec !important;
  background-color: var(--vp-c-bg) !important;
  box-shadow: 0 0 0 4px rgba(19, 127, 236, 0.12);
}

/* 搜索结果项美化 */
.VPLocalSearchBox .result {
  border-radius: 12px !important;
  border: 2px solid transparent !important;
  margin-bottom: 4px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.VPLocalSearchBox .result.selected {
  background-color: var(--vp-local-search-result-selected-bg) !important;
  border-color: #137fec !important;
  transform: translateX(4px);
}

.VPLocalSearchBox .title-icon {
  color: #137fec !important;
}

/* 快捷键提示美化 */
.VPLocalSearchBox .search-keyboard-shortcuts kbd {
  background: var(--vp-c-bg-mute) !important;
  border-radius: 6px !important;
  border: 1px solid var(--vp-c-divider) !important;
  color: var(--vp-c-text-2) !important;
  font-weight: 600;
}
</style>
