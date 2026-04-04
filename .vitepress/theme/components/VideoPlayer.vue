<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { mediaManager } from '../utils/mediaManager'

interface Props {
  src: string
  title?: string
  poster?: string
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
  mini?: boolean // 是否支持迷你模式
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  poster: '',
  autoplay: false,
  loop: false,
  muted: false,
  mini: true
})

const videoRef = ref<HTMLVideoElement | null>(null)
const miniCanvasRef = ref<HTMLCanvasElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(1)
const isMuted = ref(props.muted)
const isFullscreen = ref(false)
const isLoading = ref(false) // 初始为 false，只有开始加载后才设为 true
const showControls = ref(true)
const showVolume = ref(false)
const playbackRate = ref(1)
const showSettings = ref(false)

// 迷你模式状态
const isMiniMode = ref(false)
const hasStartedPlaying = ref(false)
const showMiniControls = ref(false) // 迷你播放器控件显示
const hasInteracted = ref(false) // 是否已点击过播放按钮（懒加载标志）

// 媒体管理器ID
let mediaId: string | null = null
let hideControlsTimeout: ReturnType<typeof setTimeout> | null = null

// 迷你播放器拖拽状态
const isDragging = ref(false)
const miniPosition = ref({ x: 20, y: 20 })

// 暂停方法供媒体管理器调用
const pauseVideo = () => {
  if (videoRef.value && isPlaying.value) {
    videoRef.value.pause()
  }
  // 关闭迷你模式，避免与其他播放器的迷你窗口重叠
  isMiniMode.value = false
  hasStartedPlaying.value = false
}

// Canvas 绘制动画帧 ID
let canvasAnimationId: number | null = null

// 绘制视频帧到 canvas
const drawVideoFrame = () => {
  if (!videoRef.value || !miniCanvasRef.value || !isMiniMode.value) {
    if (canvasAnimationId) {
      cancelAnimationFrame(canvasAnimationId)
      canvasAnimationId = null
    }
    return
  }
  
  const video = videoRef.value
  const canvas = miniCanvasRef.value
  const ctx = canvas.getContext('2d')
  
  if (ctx && video.readyState >= 2) {
    // 设置 canvas 尺寸
    const aspectRatio = video.videoWidth / video.videoHeight
    canvas.width = 280  // 迷你播放器宽度
    canvas.height = canvas.width / aspectRatio
    
    // 绘制当前帧
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
  }
  
  // 继续绘制下一帧
  canvasAnimationId = requestAnimationFrame(drawVideoFrame)
}

// 启动 canvas 绘制
const startCanvasDrawing = () => {
  if (canvasAnimationId) {
    cancelAnimationFrame(canvasAnimationId)
  }
  drawVideoFrame()
}

// 停止 canvas 绘制
const stopCanvasDrawing = () => {
  if (canvasAnimationId) {
    cancelAnimationFrame(canvasAnimationId)
    canvasAnimationId = null
  }
}

// 监听迷你模式变化
watch(isMiniMode, (newVal) => {
  if (newVal) {
    nextTick(() => {
      startCanvasDrawing()
    })
  } else {
    stopCanvasDrawing()
  }
})

// 监听滚动，自动切换迷你模式
const checkMiniMode = () => {
  if (!props.mini || !containerRef.value || !hasStartedPlaying.value) {
    isMiniMode.value = false
    return
  }
  
  const rect = containerRef.value.getBoundingClientRect()
  const isOutOfView = rect.bottom < 0 || rect.top > window.innerHeight
  isMiniMode.value = isOutOfView
}

// 格式化时间
const formatTime = (time: number): string => {
  if (isNaN(time) || !isFinite(time)) return '0:00'
  const hours = Math.floor(time / 3600)
  const minutes = Math.floor((time % 3600) / 60)
  const seconds = Math.floor(time % 60)
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const formattedCurrentTime = computed(() => formatTime(currentTime.value))
const formattedDuration = computed(() => formatTime(duration.value))

// 进度百分比
const progress = computed(() => {
  if (duration.value === 0) return 0
  return (currentTime.value / duration.value) * 100
})

// 播放/暂停
const togglePlay = () => {
  if (!videoRef.value) return
  
  // 首次点击时，设置懒加载标志并触发加载
  if (!hasInteracted.value) {
    hasInteracted.value = true
    isLoading.value = true
    // 等待 src 被设置后再播放
    nextTick(() => {
      videoRef.value?.load()
      videoRef.value?.play()
    })
    return
  }
  
  if (isPlaying.value) {
    videoRef.value.pause()
  } else {
    videoRef.value.play()
  }
}

// 进度条点击
const seek = (event: MouseEvent) => {
  if (!videoRef.value) return
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const percent = (event.clientX - rect.left) / rect.width
  videoRef.value.currentTime = percent * duration.value
}

// 音量控制
const setVolume = (event: MouseEvent) => {
  if (!videoRef.value) return
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const percent = (event.clientX - rect.left) / rect.width
  volume.value = Math.max(0, Math.min(1, percent))
  videoRef.value.volume = volume.value
  isMuted.value = volume.value === 0
}

// 静音切换
const toggleMute = () => {
  if (!videoRef.value) return
  isMuted.value = !isMuted.value
  videoRef.value.muted = isMuted.value
}

// 全屏切换
const toggleFullscreen = async () => {
  if (!containerRef.value) return
  
  if (!document.fullscreenElement) {
    await containerRef.value.requestFullscreen()
    isFullscreen.value = true
  } else {
    await document.exitFullscreen()
    isFullscreen.value = false
  }
}

// 快进/快退
const skipForward = () => {
  if (!videoRef.value) return
  videoRef.value.currentTime = Math.min(duration.value, currentTime.value + 10)
}

const skipBackward = () => {
  if (!videoRef.value) return
  videoRef.value.currentTime = Math.max(0, currentTime.value - 10)
}

// 播放速度
const setPlaybackRate = (rate: number) => {
  if (!videoRef.value) return
  playbackRate.value = rate
  videoRef.value.playbackRate = rate
  showSettings.value = false
}

// 显示/隐藏控制栏
const resetHideTimeout = () => {
  showControls.value = true
  if (hideControlsTimeout) {
    clearTimeout(hideControlsTimeout)
  }
  if (isPlaying.value) {
    hideControlsTimeout = setTimeout(() => {
      showControls.value = false
    }, 3000)
  }
}

// 关闭迷你模式
const closeMiniMode = () => {
  isMiniMode.value = false
  hasStartedPlaying.value = false
  if (videoRef.value) {
    videoRef.value.pause()
    videoRef.value.currentTime = 0
  }
}

// 返回主播放器位置
const scrollToPlayer = () => {
  containerRef.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

// 迷你播放器拖拽功能
const startDrag = (event: MouseEvent) => {
  // 如果点击的是按钮或进度条，不开始拖拽
  if ((event.target as HTMLElement).closest('button') || 
      (event.target as HTMLElement).closest('.mini-progress')) {
    return
  }
  
  event.preventDefault()
  isDragging.value = true
  
  const startX = event.clientX
  const startY = event.clientY
  const startPosX = miniPosition.value.x
  const startPosY = miniPosition.value.y
  
  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging.value) return
    const deltaX = startX - e.clientX
    const deltaY = startY - e.clientY
    
    // 计算新位置（相对右下角的距离）
    const newX = Math.max(10, Math.min(window.innerWidth - 200, startPosX + deltaX))
    const newY = Math.max(10, Math.min(window.innerHeight - 150, startPosY + deltaY))
    
    miniPosition.value = { x: newX, y: newY }
  }
  
  const onMouseUp = () => {
    isDragging.value = false
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }
  
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

// 事件处理
const onLoadedMetadata = () => {
  if (videoRef.value) {
    duration.value = videoRef.value.duration
    isLoading.value = false
  }
}

const onTimeUpdate = () => {
  if (videoRef.value) {
    currentTime.value = videoRef.value.currentTime
  }
}

const onPlay = () => {
  isPlaying.value = true
  hasStartedPlaying.value = true
  resetHideTimeout()
  checkMiniMode()
  
  // 通知媒体管理器，暂停其他播放器
  if (mediaId) {
    mediaManager.notifyPlay(mediaId)
  }
}

const onPause = () => {
  isPlaying.value = false
  showControls.value = true
  
  // 通知媒体管理器
  if (mediaId) {
    mediaManager.notifyPause(mediaId)
  }
}

const onEnded = () => {
  isPlaying.value = false
  currentTime.value = 0
  showControls.value = true
  hasStartedPlaying.value = false
  isMiniMode.value = false
}

const onWaiting = () => {
  isLoading.value = true
}

const onCanPlay = () => {
  isLoading.value = false
}

const onFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement
}

// 键盘快捷键
const handleKeydown = (event: KeyboardEvent) => {
  if (!containerRef.value?.contains(document.activeElement) && document.activeElement !== document.body) return
  
  switch (event.code) {
    case 'Space':
      event.preventDefault()
      togglePlay()
      break
    case 'ArrowLeft':
      skipBackward()
      break
    case 'ArrowRight':
      skipForward()
      break
    case 'ArrowUp':
      event.preventDefault()
      volume.value = Math.min(1, volume.value + 0.1)
      if (videoRef.value) videoRef.value.volume = volume.value
      break
    case 'ArrowDown':
      event.preventDefault()
      volume.value = Math.max(0, volume.value - 0.1)
      if (videoRef.value) videoRef.value.volume = volume.value
      break
    case 'KeyF':
      toggleFullscreen()
      break
    case 'KeyM':
      toggleMute()
      break
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  document.addEventListener('fullscreenchange', onFullscreenChange)
  window.addEventListener('scroll', checkMiniMode, { passive: true })
  window.addEventListener('resize', checkMiniMode, { passive: true })
  
  // 注册到媒体管理器
  if (videoRef.value) {
    mediaId = mediaManager.registerMedia('video', videoRef.value, pauseVideo)
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('fullscreenchange', onFullscreenChange)
  window.removeEventListener('scroll', checkMiniMode)
  window.removeEventListener('resize', checkMiniMode)
  if (hideControlsTimeout) clearTimeout(hideControlsTimeout)
  
  // 停止 canvas 绘制
  stopCanvasDrawing()
  
  // 从媒体管理器注销
  if (mediaId) {
    mediaManager.unregisterMedia(mediaId)
    mediaId = null
  }
})

const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2]
</script>

<template>
  <div 
    ref="containerRef"
    class="video-player"
    :class="{ fullscreen: isFullscreen }"
    @mousemove="resetHideTimeout"
    @mouseleave="isPlaying && (showControls = false)"
  >
    <!-- 视频元素 - 只有点击后才加载 src -->
    <video
      ref="videoRef"
      :src="hasInteracted ? src : undefined"
      :poster="poster"
      :autoplay="false"
      :loop="loop"
      :muted="muted"
      @loadedmetadata="onLoadedMetadata"
      @timeupdate="onTimeUpdate"
      @play="onPlay"
      @pause="onPause"
      @ended="onEnded"
      @waiting="onWaiting"
      @canplay="onCanPlay"
      @click="togglePlay"
    />

    <!-- 加载动画 -->
    <div class="loading-overlay" v-if="isLoading">
      <div class="loading-spinner">
        <svg viewBox="0 0 50 50">
          <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="4" stroke-dasharray="100" stroke-linecap="round" />
        </svg>
      </div>
    </div>

    <!-- 大播放按钮 -->
    <div class="play-overlay" v-if="!isPlaying && !isLoading" @click="togglePlay">
      <div class="play-button-large">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z"/>
        </svg>
      </div>
    </div>

    <!-- 标题 -->
    <div class="video-title" v-if="title && showControls">{{ title }}</div>

    <!-- 控制栏 -->
    <div class="controls" :class="{ visible: showControls }">
      <!-- 进度条 -->
      <div class="progress-container" @click="seek">
        <div class="progress-bg" />
        <div class="progress-buffered" />
        <div class="progress-fill" :style="{ width: `${progress}%` }" />
        <div class="progress-thumb" :style="{ left: `${progress}%` }" />
      </div>

      <!-- 控制按钮 -->
      <div class="control-buttons">
        <div class="left-controls">
          <!-- 播放/暂停 -->
          <button class="control-btn" @click="togglePlay">
            <svg v-if="isPlaying" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>

          <!-- 快退 -->
          <button class="control-btn" @click="skipBackward" title="后退 10 秒">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
            </svg>
          </button>

          <!-- 快进 -->
          <button class="control-btn" @click="skipForward" title="快进 10 秒">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z"/>
            </svg>
          </button>

          <!-- 音量 -->
          <div class="volume-container" @mouseenter="showVolume = true" @mouseleave="showVolume = false">
            <button class="control-btn" @click="toggleMute">
              <svg v-if="isMuted || volume === 0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
              </svg>
            </button>
            <div class="volume-slider" v-show="showVolume">
              <div class="volume-bar" @click="setVolume">
                <div class="volume-fill" :style="{ width: `${volume * 100}%` }" />
              </div>
            </div>
          </div>

          <!-- 时间 -->
          <span class="time-display">{{ formattedCurrentTime }} / {{ formattedDuration }}</span>
        </div>

        <div class="right-controls">
          <!-- 播放速度 -->
          <div class="settings-container">
            <button class="control-btn" @click="showSettings = !showSettings">
              <span class="speed-badge">{{ playbackRate }}x</span>
            </button>
            <div class="settings-menu" v-show="showSettings">
              <div class="settings-title">播放速度</div>
              <button 
                v-for="rate in playbackRates" 
                :key="rate"
                class="rate-option"
                :class="{ active: playbackRate === rate }"
                @click="setPlaybackRate(rate)"
              >
                {{ rate }}x
              </button>
            </div>
          </div>

          <!-- 全屏 -->
          <button class="control-btn" @click="toggleFullscreen">
            <svg v-if="isFullscreen" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- 迷你悬浮视频播放器 -->
  <Teleport to="body">
    <Transition name="mini-video">
      <div 
        v-if="isMiniMode && mini"
        class="mini-video-player"
        :class="{ dragging: isDragging }"
        :style="{ right: `${miniPosition.x}px`, bottom: `${miniPosition.y}px` }"
        @mousedown="startDrag"
        @mouseenter="showMiniControls = true"
        @mouseleave="showMiniControls = false"
      >
        <!-- 关闭按钮 -->
        <button 
          class="mini-close" 
          :class="{ visible: showMiniControls }"
          @click.stop="closeMiniMode" 
          title="关闭"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>

        <!-- 返回按钮 -->
        <button 
          class="mini-back" 
          :class="{ visible: showMiniControls }"
          @click.stop="scrollToPlayer" 
          title="返回"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"/>
          </svg>
        </button>

        <!-- 视频画面容器 - 使用 canvas 显示当前帧 -->
        <div class="mini-video-container">
          <canvas 
            ref="miniCanvasRef" 
            class="mini-video-canvas"
          ></canvas>
        </div>

        <!-- 中心播放/暂停按钮 -->
        <button 
          class="mini-play-btn" 
          :class="{ visible: showMiniControls }"
          @click.stop="togglePlay"
        >
          <svg v-if="isPlaying" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </button>

        <!-- 底部信息栏 -->
        <div class="mini-info-bar">
          <span class="mini-time">{{ formattedCurrentTime }}</span>
          <div class="mini-progress" @click.stop="seek">
            <div class="mini-progress-fill" :style="{ width: `${progress}%` }"></div>
          </div>
        </div>

        <!-- 播放状态指示器 -->
        <div class="mini-status" :class="{ playing: isPlaying }">
          <span v-if="isPlaying">▶ 播放中</span>
          <span v-else>⏸ 已暂停</span>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.video-player {
  position: relative;
  width: 100%;
  max-width: 100%;
  margin: 24px 0;
  border-radius: 12px;
  overflow: hidden;
  background: #000;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.video-player.fullscreen {
  border-radius: 0;
  max-width: none;
}

video {
  width: 100%;
  display: block;
  cursor: pointer;
}

/* 加载动画 */
.loading-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
}

.loading-spinner svg {
  width: 48px;
  height: 48px;
  color: white;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 播放覆盖层 */
.play-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: rgba(0, 0, 0, 0.3);
}

.play-button-large {
  width: 72px;
  height: 72px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, background 0.2s ease;
}

.play-button-large:hover {
  transform: scale(1.1);
  background: white;
}

.play-button-large svg {
  width: 32px;
  height: 32px;
  margin-left: 4px;
  color: #333;
}

/* 标题 */
.video-title {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 16px 20px;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.7), transparent);
  color: white;
  font-size: 16px;
  font-weight: 600;
}

/* 控制栏 */
.controls {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 40px 16px 12px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.controls.visible {
  opacity: 1;
}

/* 进度条 */
.progress-container {
  position: relative;
  height: 4px;
  cursor: pointer;
  margin-bottom: 12px;
  transition: height 0.2s ease;
}

.progress-container:hover {
  height: 6px;
}

.progress-bg {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.progress-buffered {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 3px;
}

.progress-fill {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  background: #ff4757;
  border-radius: 3px;
}

.progress-thumb {
  position: absolute;
  top: 50%;
  width: 14px;
  height: 14px;
  background: #ff4757;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.2s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.progress-container:hover .progress-thumb {
  opacity: 1;
}

/* 控制按钮区域 */
.control-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left-controls, .right-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.control-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  color: white;
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.control-btn svg {
  width: 20px;
  height: 20px;
}

.time-display {
  color: white;
  font-size: 13px;
  font-variant-numeric: tabular-nums;
  margin-left: 8px;
}

/* 音量控制 */
.volume-container {
  display: flex;
  align-items: center;
}

.volume-slider {
  width: 80px;
  padding: 0 8px;
}

.volume-bar {
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  cursor: pointer;
  position: relative;
}

.volume-fill {
  height: 100%;
  background: white;
  border-radius: 2px;
}

/* 播放速度设置 */
.settings-container {
  position: relative;
}

.speed-badge {
  font-size: 12px;
  font-weight: 600;
  color: white;
}

.settings-menu {
  position: absolute;
  bottom: 100%;
  right: 0;
  background: rgba(28, 28, 28, 0.95);
  backdrop-filter: blur(8px);
  border-radius: 8px;
  padding: 8px 0;
  margin-bottom: 8px;
  min-width: 100px;
}

.settings-title {
  padding: 8px 16px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.rate-option {
  width: 100%;
  padding: 8px 16px;
  background: none;
  border: none;
  color: white;
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  transition: background 0.2s ease;
}

.rate-option:hover {
  background: rgba(255, 255, 255, 0.1);
}

.rate-option.active {
  color: #ff4757;
}

/* ==================== 迷你视频播放器 ==================== */
.mini-video-player {
  position: fixed;
  z-index: 9999;
  width: 280px;
  height: 170px;
  background: #1a1a2e;
  border-radius: 12px;
  box-shadow: 
    0 10px 40px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  overflow: hidden;
  user-select: none;
  cursor: grab;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.mini-video-player:hover {
  box-shadow: 
    0 12px 48px rgba(0, 0, 0, 0.55),
    0 0 0 1px rgba(255, 255, 255, 0.15);
}

.mini-video-player.dragging {
  cursor: grabbing;
  transform: scale(1.02);
  box-shadow: 
    0 15px 50px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(255, 255, 255, 0.2);
}

/* 关闭按钮 - 悬停显示 */
.mini-close {
  position: absolute;
  right: 6px;
  top: 6px;
  width: 22px;
  height: 22px;
  border: none;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 10;
  backdrop-filter: blur(4px);
  opacity: 0;
  transform: scale(0.8);
}

.mini-close.visible {
  opacity: 1;
  transform: scale(1);
}

.mini-close:hover {
  background: rgba(255, 82, 82, 0.7);
  transform: scale(1.1);
}

.mini-close svg {
  width: 12px;
  height: 12px;
  color: white;
}

/* 返回按钮 - 悬停显示 */
.mini-back {
  position: absolute;
  right: 32px;
  top: 6px;
  width: 22px;
  height: 22px;
  border: none;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 10;
  backdrop-filter: blur(4px);
  opacity: 0;
  transform: scale(0.8);
}

.mini-back.visible {
  opacity: 1;
  transform: scale(1);
}

.mini-back:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.mini-back svg {
  width: 12px;
  height: 12px;
  color: white;
}

/* 视频容器 */
.mini-video-container {
  position: absolute;
  inset: 0;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* Canvas 视频画面 */
.mini-video-canvas {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 中心播放按钮 - 悬停显示 */
.mini-play-btn {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) scale(0.8);
  width: 44px;
  height: 44px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  z-index: 5;
  opacity: 0;
}

.mini-play-btn.visible {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}

.mini-play-btn:hover {
  background: rgba(255, 255, 255, 0.35);
  transform: translate(-50%, -50%) scale(1.1);
}

.mini-play-btn:active {
  transform: translate(-50%, -50%) scale(0.95);
}

.mini-play-btn svg {
  width: 22px;
  height: 22px;
  color: white;
  margin-left: 2px;
}

/* 底部信息栏 */
.mini-info-bar {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 6px 8px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 播放状态指示器 */
.mini-status {
  position: absolute;
  left: 8px;
  top: 8px;
  padding: 3px 8px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 4px;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(4px);
  z-index: 5;
}

.mini-status.playing {
  color: #4ade80;
}

.mini-time {
  font-size: 10px;
  color: white;
  font-variant-numeric: tabular-nums;
  min-width: 30px;
}

.mini-progress {
  flex: 1;
  height: 3px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  cursor: pointer;
  overflow: hidden;
}

.mini-progress-fill {
  height: 100%;
  background: #ff4757;
  border-radius: 2px;
  transition: width 0.1s ease;
}

/* 迷你播放器动画 */
.mini-video-enter-active,
.mini-video-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.mini-video-enter-from,
.mini-video-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}

/* 响应式 */
@media (max-width: 640px) {
  .video-title {
    font-size: 14px;
    padding: 12px 16px;
  }
  
  .controls {
    padding: 30px 12px 8px;
  }
  
  .control-btn {
    width: 32px;
    height: 32px;
  }
  
  .control-btn svg {
    width: 18px;
    height: 18px;
  }
  
  .time-display {
    font-size: 11px;
  }
  
  .volume-slider {
    display: none;
  }
  
  /* 迷你播放器移动端适配 */
  .mini-video-player {
    right: 10px !important;
    bottom: 10px !important;
    width: 160px;
    height: 100px;
  }
  
  .mini-play-btn {
    width: 38px;
    height: 38px;
  }
  
  .mini-play-btn svg {
    width: 18px;
    height: 18px;
  }
}
</style>
