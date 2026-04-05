<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { convertToMermaid } from '../utils/mindmapParser'

const props = defineProps<{
  title?: string
}>()

const isOpen = ref(false)
const isVisible = ref(false)
const scale = ref(1)
const minScale = 0.3
const maxScale = 3
const isMounted = ref(false)
const hasContainer = ref(false)

// 按钮位置已由父组件统一管理，不再需要动态计算
const buttonRight = ref('32px')

// 隐藏插槽容器的 ref
const slotContainer = ref<HTMLElement | null>(null)

// Mermaid 渲染相关
const mermaidContainer = ref<HTMLElement | null>(null)
const mermaidCode = ref('')
const isRendering = ref(false)
const renderError = ref('')

// 从 DOM 中提取代码块内容
const extractSlotContent = (): string => {
  if (!slotContainer.value) return ''
  
  // 1. 尝试查找 .vp-doc 中的代码块（VitePress 默认渲染格式）
  const codeBlocks = slotContainer.value.querySelectorAll('pre code, .vp-doc pre code')
  if (codeBlocks.length > 0) {
    const code = codeBlocks[0] as HTMLElement
    return code.textContent || code.innerText || ''
  }
  
  // 2. 尝试查找自定义的数据块
  const dataBlock = slotContainer.value.querySelector('[class*="language-"]')
  if (dataBlock) {
    return dataBlock.textContent || dataBlock.innerText || ''
  }

  // 3. 回退：获取容器内所有文本内容，并过滤掉可能的空行
  return (slotContainer.value.textContent || slotContainer.value.innerText || '').trim()
}

// 渲染 Mermaid 图表
const renderMermaid = async () => {
  if (!mermaidContainer.value || !mermaidCode.value) return
  
  isRendering.value = true
  renderError.value = ''
  
  try {
    // 动态导入 mermaid
    const mermaid = await import('mermaid')
    
    // 初始化 mermaid
    mermaid.default.initialize({
      startOnLoad: false,
      theme: document.documentElement.classList.contains('dark') ? 'dark' : 'default',
      securityLevel: 'loose',
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis'
      }
    })
    
    // 生成唯一 ID
    const id = `mindmap-${Date.now()}`
    
    // 渲染 SVG
    const { svg } = await mermaid.default.render(id, mermaidCode.value)
    
    if (mermaidContainer.value) {
      mermaidContainer.value.innerHTML = svg
    }
  } catch (err: any) {
    console.error('Mermaid 渲染错误:', err)
    renderError.value = err.message || '图表渲染失败'
  } finally {
    isRendering.value = false
  }
}

// 打开弹框
const openModal = async () => {
  // 提取并转换内容
  const rawContent = extractSlotContent()
  
  if (rawContent) {
    mermaidCode.value = convertToMermaid(rawContent)
  }
  
  isOpen.value = true
  scale.value = 1 // 重置缩放
  
  // 延迟添加 visible 类，触发动画
  setTimeout(() => {
    isVisible.value = true
  }, 10)
  
  // 等待 DOM 完全更新后渲染 Mermaid
  await nextTick()
  // 增加延迟确保 Teleport 内容完全挂载
  setTimeout(() => {
    renderMermaid()
  }, 300)
}

// 关闭弹框
const closeModal = () => {
  isVisible.value = false
  setTimeout(() => {
    isOpen.value = false
  }, 300)
}

// 缩放控制
const zoomIn = () => {
  scale.value = Math.min(maxScale, scale.value + 0.2)
}

const zoomOut = () => {
  scale.value = Math.max(minScale, scale.value - 0.2)
}

const resetZoom = () => {
  scale.value = 1
}

// 滚轮缩放
const handleWheel = (e: WheelEvent) => {
  if (e.ctrlKey || e.metaKey) {
    e.preventDefault()
    if (e.deltaY < 0) {
      zoomIn()
    } else {
      zoomOut()
    }
  }
}

// ESC 键关闭
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isOpen.value) {
    closeModal()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  isMounted.value = true
  // 延迟检测，确保容器渲染
  setTimeout(() => {
    hasContainer.value = !!document.getElementById('mindmap-fab-container')
  }, 0)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="mindmap-float-container">
    <!-- 隐藏原始插槽内容 -->
    <div ref="slotContainer" style="display: none;">
      <slot></slot>
    </div>
    
    <!-- 浮动按钮 (位置由全局容器 #mindmap-fab-container 控制) -->
    <Teleport to="#mindmap-fab-container" :disabled="!hasContainer" v-if="isMounted">
      <button 
        class="mindmap-action-btn"
        @click="openModal"
        :title="title || '查看思维导图'"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"></circle>
          <circle cx="4" cy="6" r="2"></circle>
          <circle cx="20" cy="6" r="2"></circle>
          <circle cx="4" cy="18" r="2"></circle>
          <circle cx="20" cy="18" r="2"></circle>
          <line x1="9.5" y1="10" x2="5.5" y2="7"></line>
          <line x1="14.5" y1="10" x2="18.5" y2="7"></line>
          <line x1="9.5" y1="14" x2="5.5" y2="17"></line>
          <line x1="14.5" y1="14" x2="18.5" y2="17"></line>
        </svg>
      </button>
    </Teleport>

    <!-- 弹框遮罩 -->
    <Teleport to="body">
      <div 
        v-if="isOpen"
        class="mindmap-modal-overlay"
        :class="{ visible: isVisible }"
        @click.self="closeModal"
      >
        <!-- 弹框内容 -->
        <div class="mindmap-modal">
          <div class="modal-header">
            <h3>{{ title || '📋 文档结构思维导图' }}</h3>
            <div class="header-actions">
              <!-- 缩放控制 -->
              <div class="zoom-controls">
                <button class="zoom-btn" @click="zoomOut" title="缩小" :disabled="scale <= minScale">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    <line x1="8" y1="11" x2="14" y2="11"></line>
                  </svg>
                </button>
                <span class="zoom-value" @click="resetZoom" title="点击重置">{{ Math.round(scale * 100) }}%</span>
                <button class="zoom-btn" @click="zoomIn" title="放大" :disabled="scale >= maxScale">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    <line x1="11" y1="8" x2="11" y2="14"></line>
                    <line x1="8" y1="11" x2="14" y2="11"></line>
                  </svg>
                </button>
              </div>
              <button class="close-btn" @click="closeModal" title="关闭 (ESC)">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
          <div class="modal-body" @wheel="handleWheel">
            <div class="mindmap-content" :style="{ transform: `scale(${scale})` }">
              <!-- 渲染状态 -->
              <div v-show="isRendering" class="render-loading">
                <span>正在生成思维导图...</span>
              </div>
              
              <!-- 错误提示 -->
              <div v-show="!isRendering && renderError" class="render-error">
                <p>图表渲染失败</p>
                <code>{{ renderError }}</code>
                <pre class="mermaid-code">{{ mermaidCode }}</pre>
              </div>
              
              <!-- Mermaid 渲染容器 -->
              <div v-show="!isRendering && !renderError" ref="mermaidContainer" class="mermaid-render"></div>
            </div>
          </div>
          <div class="modal-footer">
            <span class="hint">按住 Ctrl + 滚轮缩放 · 按 ESC 键或点击外部关闭</span>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
/* 按钮基础样式 (不再带 position: fixed) */
.mindmap-action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  padding: 0;
  
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 50%;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  
  cursor: pointer;
  transition: all 0.3s ease;
}

.mindmap-action-btn:hover {
  transform: translateY(-2px) scale(1.1);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

.mindmap-action-btn:active {
  transform: translateY(0) scale(1);
}

@media (max-width: 768px) {
  .mindmap-action-btn {
    width: 40px;
    height: 40px;
  }
}

/* 弹框遮罩 */
.mindmap-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  
  display: flex;
  align-items: center;
  justify-content: center;
  
  background: rgba(0, 0, 0, 0);
  backdrop-filter: blur(0px);
  transition: all 0.3s ease;
}

.mindmap-modal-overlay.visible {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

/* 弹框内容 */
.mindmap-modal {
  width: 90%;
  max-width: 1200px;
  max-height: 85vh;
  
  background: var(--vp-c-bg);
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  
  display: flex;
  flex-direction: column;
  
  opacity: 0;
  transform: scale(0.9) translateY(20px);
  transition: all 0.3s ease;
}

.mindmap-modal-overlay.visible .mindmap-modal {
  opacity: 1;
  transform: scale(1) translateY(0);
}

/* 头部 */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.zoom-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
}

.zoom-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.2s ease;
}

.zoom-btn:hover:not(:disabled) {
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-text-1);
}

.zoom-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.zoom-value {
  min-width: 48px;
  text-align: center;
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  cursor: pointer;
}

.zoom-value:hover {
  color: var(--vp-c-brand-1);
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

/* 内容区 */
.modal-body {
  flex: 1;
  padding: 24px;
  overflow: auto;
}

.mindmap-content {
  transform-origin: center top;
  transition: transform 0.2s ease;
  min-height: 300px;
}

.mermaid-render {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.mermaid-render :deep(svg) {
  max-width: 100%;
  height: auto;
}

.render-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  color: var(--vp-c-text-2);
}

.render-error {
  text-align: center;
  color: var(--vp-c-danger-1);
}

.render-error code {
  display: block;
  margin: 8px 0;
  padding: 8px;
  background: var(--vp-c-bg-soft);
  border-radius: 4px;
  font-size: 12px;
}

.mermaid-code {
  margin-top: 16px;
  padding: 12px;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  text-align: left;
  font-size: 12px;
  overflow-x: auto;
  max-height: 200px;
}

/* 底部 */
.modal-footer {
  padding: 12px 24px;
  border-top: 1px solid var(--vp-c-divider);
  text-align: center;
}

.hint {
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.dark .mindmap-modal {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}
</style>
