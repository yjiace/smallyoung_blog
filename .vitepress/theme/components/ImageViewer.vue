<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'

// 图片预览状态
const isVisible = ref(false)
const imageSrc = ref('')
const imageAlt = ref('')

// 缩放和拖拽状态
const scale = ref(1)
const translateX = ref(0)
const translateY = ref(0)
const isDragging = ref(false)
const startX = ref(0)
const startY = ref(0)
const startTranslateX = ref(0)
const startTranslateY = ref(0)
const hasDragged = ref(false)

// 最小/最大缩放
const MIN_SCALE = 0.5
const MAX_SCALE = 5

// Cloudflare Image Resizing 相关配置
const CF_IMAGE_CDN_PATTERN = /\/cdn-cgi\/image\/[^\/]+\//

// 转换为原图 URL（移除 Cloudflare Image Resizing 路径前缀）
function toOriginalUrl(url: string): string {
  return url.replace(CF_IMAGE_CDN_PATTERN, '/')
}

// 打开图片预览
function openViewer(src: string, alt: string = '') {
  imageSrc.value = toOriginalUrl(src)
  imageAlt.value = alt
  isVisible.value = true
  resetTransform()
  document.body.style.overflow = 'hidden'
}

// 关闭图片预览
function closeViewer() {
  isVisible.value = false
  document.body.style.overflow = ''
}

// 重置变换
function resetTransform() {
  scale.value = 1
  translateX.value = 0
  translateY.value = 0
}

// 放大
function zoomIn() {
  scale.value = Math.min(MAX_SCALE, scale.value + 0.5)
}

// 缩小
function zoomOut() {
  scale.value = Math.max(MIN_SCALE, scale.value - 0.5)
}

// 滚轮缩放
function handleWheel(event: WheelEvent) {
  event.preventDefault()
  const delta = event.deltaY > 0 ? -0.2 : 0.2
  const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale.value + delta))
  scale.value = newScale
}

// 拖拽开始
function handleMouseDown(event: MouseEvent) {
  if (event.button !== 0) return // 只响应左键
  isDragging.value = true
  startX.value = event.clientX
  startY.value = event.clientY
  startTranslateX.value = translateX.value
  startTranslateY.value = translateY.value
}

// 拖拽移动
function handleMouseMove(event: MouseEvent) {
  if (!isDragging.value) return
  const deltaX = event.clientX - startX.value
  const deltaY = event.clientY - startY.value
  // 检测是否有明显拖拽（移动距离 > 5px）
  if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
    hasDragged.value = true
  }
  translateX.value = startTranslateX.value + deltaX
  translateY.value = startTranslateY.value + deltaY
}

// 拖拽结束
function handleMouseUp() {
  isDragging.value = false
  // 延迟重置 hasDragged，让 click 事件能够读取到正确值
  setTimeout(() => {
    hasDragged.value = false
  }, 0)
}

// 点击背景关闭（仅在非拖拽时生效）
function handleBackgroundClick(event: MouseEvent) {
  // 如果刚进行了拖拽操作，不关闭
  if (hasDragged.value) return
  
  const target = event.target as HTMLElement
  // 点击 overlay 背景或图片容器（非图片本身）时关闭
  if (
    target.classList.contains('image-viewer-overlay') ||
    target.classList.contains('image-viewer-container')
  ) {
    closeViewer()
  }
}

// 键盘事件
function handleKeydown(event: KeyboardEvent) {
  if (!isVisible.value) return
  
  switch (event.key) {
    case 'Escape':
      closeViewer()
      break
    case '+':
    case '=':
      zoomIn()
      break
    case '-':
      zoomOut()
      break
    case '0':
      resetTransform()
      break
  }
}

// 全局点击事件监听 - 为文档中的图片添加点击放大功能
function handleDocumentClick(event: MouseEvent) {
  const target = event.target as HTMLElement
  
  // 检查是否点击了文档内容中的图片
  if (target.tagName === 'IMG') {
    const img = target as HTMLImageElement
    
    // 排除一些特定的图片（如头像、图标等）
    if (
      img.closest('.audio-player') ||
      img.closest('.video-player') ||
      img.closest('.mini-player') ||
      img.closest('.mini-video-player') ||
      img.closest('.VPNavBar') ||
      img.closest('.VPSidebar') ||
      img.classList.contains('no-preview') ||
      img.width < 50 ||
      img.height < 50
    ) {
      return
    }
    
    // 检查是否在文档内容区域
    if (img.closest('.vp-doc') || img.closest('.doc-content')) {
      event.preventDefault()
      event.stopPropagation()
      openViewer(img.src, img.alt)
    }
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  // 使用捕获阶段来确保能够拦截图片点击
  document.addEventListener('click', handleDocumentClick, true)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('click', handleDocumentClick, true)
  document.body.style.overflow = ''
})

// 暴露方法供外部调用
defineExpose({
  open: openViewer,
  close: closeViewer
})
</script>

<template>
  <Teleport to="body">
    <Transition name="image-viewer">
      <div 
        v-if="isVisible"
        class="image-viewer-overlay"
        @click="handleBackgroundClick"
        @wheel.prevent="handleWheel"
      >
        <!-- 工具栏 -->
        <div class="image-viewer-toolbar">
          <button class="toolbar-btn" @click="zoomOut" title="缩小 (-)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35M8 11h6"/>
            </svg>
          </button>
          <span class="zoom-level">{{ Math.round(scale * 100) }}%</span>
          <button class="toolbar-btn" @click="zoomIn" title="放大 (+)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35M8 11h6M11 8v6"/>
            </svg>
          </button>
          <button class="toolbar-btn" @click="resetTransform" title="重置 (0)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
            </svg>
          </button>
          <button class="toolbar-btn close-btn" @click="closeViewer" title="关闭 (Esc)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- 图片容器 -->
        <div 
          class="image-viewer-container"
          :class="{ dragging: isDragging }"
          @mousedown="handleMouseDown"
          @mousemove="handleMouseMove"
          @mouseup="handleMouseUp"
          @mouseleave="handleMouseUp"
        >
          <img 
            :src="imageSrc" 
            :alt="imageAlt"
            class="preview-image"
            :style="{
              transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
            }"
            draggable="false"
          />
        </div>

        <!-- 图片描述 -->
        <div class="image-viewer-caption" v-if="imageAlt">
          {{ imageAlt }}
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.image-viewer-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

/* 工具栏 */
.image-viewer-toolbar {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  z-index: 10;
}

.toolbar-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  color: white;
  cursor: pointer;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
}

.toolbar-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

.toolbar-btn svg {
  width: 20px;
  height: 20px;
}

.close-btn:hover {
  background: rgba(255, 82, 82, 0.5);
}

.zoom-level {
  color: white;
  font-size: 14px;
  font-weight: 500;
  min-width: 50px;
  text-align: center;
  font-variant-numeric: tabular-nums;
}

/* 图片容器 */
.image-viewer-container {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  overflow: hidden;
}

.image-viewer-container.dragging {
  cursor: grabbing;
}

.preview-image {
  max-width: 90%;
  max-height: 85vh;
  object-fit: contain;
  transition: transform 0.1s ease;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  user-select: none;
  pointer-events: none;
}

.image-viewer-container.dragging .preview-image {
  transition: none;
}

/* 图片描述 */
.image-viewer-caption {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  max-width: 80%;
  padding: 12px 24px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  border-radius: 8px;
  color: white;
  font-size: 14px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 动画 */
.image-viewer-enter-active,
.image-viewer-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.image-viewer-enter-from,
.image-viewer-leave-to {
  opacity: 0;
}

.image-viewer-enter-from .preview-image,
.image-viewer-leave-to .preview-image {
  transform: scale(0.9);
}

.image-viewer-enter-from .image-viewer-toolbar,
.image-viewer-leave-to .image-viewer-toolbar {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}

/* 响应式 */
@media (max-width: 640px) {
  .image-viewer-toolbar {
    top: 10px;
    padding: 6px 12px;
    gap: 4px;
  }
  
  .toolbar-btn {
    width: 32px;
    height: 32px;
  }
  
  .toolbar-btn svg {
    width: 18px;
    height: 18px;
  }
  
  .zoom-level {
    font-size: 12px;
    min-width: 40px;
  }
  
  .preview-image {
    max-width: 95%;
    max-height: 80vh;
  }
  
  .image-viewer-caption {
    bottom: 10px;
    padding: 8px 16px;
    font-size: 12px;
  }
}
</style>
