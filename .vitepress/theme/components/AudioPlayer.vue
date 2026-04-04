<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { mediaManager } from '../utils/mediaManager'

interface Props {
  src: string
  title?: string
  author?: string
  cover?: string
  mini?: boolean // 是否支持迷你模式
}

const props = withDefaults(defineProps<Props>(), {
  title: '音频',
  author: '',
  cover: '',
  mini: true
})

const audioRef = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(1)
const isMuted = ref(false)
const isLoading = ref(false) // 初始为 false，只有开始加载后才设为 true
const showVolume = ref(false)
const isMiniMode = ref(false) // 迷你模式状态
const hasStartedPlaying = ref(false) // 是否曾经开始播放过
const isDragging = ref(false) // 是否正在拖拽
const hasInteracted = ref(false) // 是否已点击过播放按钮（懒加载标志）
const miniPosition = ref({ x: 20, y: 20 }) // 迷你播放器位置（相对右下角）

// 媒体管理器ID
let mediaId: string | null = null

// 暂停方法供媒体管理器调用
const pauseAudio = () => {
  if (audioRef.value && isPlaying.value) {
    audioRef.value.pause()
  }
  // 关闭迷你模式，避免与其他播放器的迷你窗口重叠
  isMiniMode.value = false
  hasStartedPlaying.value = false
}

// 监听滚动，自动切换迷你模式
const playerRef = ref<HTMLElement | null>(null)
const checkMiniMode = () => {
  // 只要曾经播放过且滚动离开，就显示迷你模式（不管是否暂停）
  if (!props.mini || !playerRef.value || !hasStartedPlaying.value) {
    isMiniMode.value = false
    return
  }
  
  const rect = playerRef.value.getBoundingClientRect()
  const isOutOfView = rect.bottom < 0 || rect.top > window.innerHeight
  isMiniMode.value = isOutOfView
}

// 格式化时间
const formatTime = (time: number): string => {
  if (isNaN(time) || !isFinite(time)) return '0:00'
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
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
  if (!audioRef.value) return
  
  // 首次点击时，设置懒加载标志并触发加载
  if (!hasInteracted.value) {
    hasInteracted.value = true
    isLoading.value = true
    // 等待 src 被设置后再播放
    nextTick(() => {
      audioRef.value?.load()
      audioRef.value?.play()
    })
    return
  }
  
  if (isPlaying.value) {
    audioRef.value.pause()
  } else {
    audioRef.value.play()
  }
}

// 进度条点击
const seek = (event: MouseEvent) => {
  if (!audioRef.value) return
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const percent = (event.clientX - rect.left) / rect.width
  audioRef.value.currentTime = percent * duration.value
}

// 音量控制
const setVolume = (event: MouseEvent) => {
  if (!audioRef.value) return
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const percent = (event.clientX - rect.left) / rect.width
  volume.value = Math.max(0, Math.min(1, percent))
  audioRef.value.volume = volume.value
  isMuted.value = volume.value === 0
}

// 静音切换
const toggleMute = () => {
  if (!audioRef.value) return
  isMuted.value = !isMuted.value
  audioRef.value.muted = isMuted.value
}

// 快进/快退
const skipForward = () => {
  if (!audioRef.value) return
  audioRef.value.currentTime = Math.min(duration.value, currentTime.value + 10)
}

const skipBackward = () => {
  if (!audioRef.value) return
  audioRef.value.currentTime = Math.max(0, currentTime.value - 10)
}

// 关闭迷你模式（停止播放并关闭）
const closeMiniMode = () => {
  isMiniMode.value = false
  hasStartedPlaying.value = false
  if (audioRef.value) {
    audioRef.value.pause()
    audioRef.value.currentTime = 0
  }
}

// 返回主播放器位置
const scrollToPlayer = () => {
  playerRef.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

// 迷你播放器拖拽功能
const startDrag = (event: MouseEvent) => {
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
    
    // 计算新位置（仍然是相对右下角的距离）
    const newX = Math.max(10, Math.min(window.innerWidth - 110, startPosX + deltaX))
    const newY = Math.max(10, Math.min(window.innerHeight - 130, startPosY + deltaY))
    
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
  if (audioRef.value) {
    duration.value = audioRef.value.duration
    isLoading.value = false
  }
}

const onTimeUpdate = () => {
  if (audioRef.value) {
    currentTime.value = audioRef.value.currentTime
  }
}

const onPlay = () => {
  isPlaying.value = true
  hasStartedPlaying.value = true
  checkMiniMode()
  
  // 通知媒体管理器，暂停其他播放器
  if (mediaId) {
    mediaManager.notifyPlay(mediaId)
  }
}

const onPause = () => {
  isPlaying.value = false
  // 暂停时不关闭迷你模式，保持 hasStartedPlaying 状态
  
  // 通知媒体管理器
  if (mediaId) {
    mediaManager.notifyPause(mediaId)
  }
}

const onEnded = () => {
  isPlaying.value = false
  currentTime.value = 0
  // 播放结束时关闭迷你模式
  hasStartedPlaying.value = false
  isMiniMode.value = false
}

const onWaiting = () => {
  isLoading.value = true
}

const onCanPlay = () => {
  isLoading.value = false
}

// 键盘快捷键
const handleKeydown = (event: KeyboardEvent) => {
  if (event.target !== document.body) return
  
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
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  window.addEventListener('scroll', checkMiniMode, { passive: true })
  window.addEventListener('resize', checkMiniMode, { passive: true })
  
  // 注册到媒体管理器
  if (audioRef.value) {
    mediaId = mediaManager.registerMedia('audio', audioRef.value, pauseAudio)
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('scroll', checkMiniMode)
  window.removeEventListener('resize', checkMiniMode)
  
  // 从媒体管理器注销
  if (mediaId) {
    mediaManager.unregisterMedia(mediaId)
    mediaId = null
  }
})
</script>

<template>
  <!-- 隐藏的原生播放器 - 只有点击后才加载 src -->
  <audio
    ref="audioRef"
    :src="hasInteracted ? src : undefined"
    @loadedmetadata="onLoadedMetadata"
    @timeupdate="onTimeUpdate"
    @play="onPlay"
    @pause="onPause"
    @ended="onEnded"
    @waiting="onWaiting"
    @canplay="onCanPlay"
  />

  <!-- 主播放器 -->
  <div ref="playerRef" class="audio-player">
    <!-- 封面和信息 -->
    <div class="player-info" v-if="title || author || cover">
      <div class="cover-wrapper" v-if="cover">
        <img :src="cover" :alt="title" class="cover-image" />
        <div class="cover-overlay" :class="{ playing: isPlaying }">
          <svg class="music-wave" viewBox="0 0 24 24">
            <rect class="bar bar1" x="2" y="10" width="3" height="4" />
            <rect class="bar bar2" x="7" y="6" width="3" height="12" />
            <rect class="bar bar3" x="12" y="8" width="3" height="8" />
            <rect class="bar bar4" x="17" y="4" width="3" height="16" />
          </svg>
        </div>
      </div>
      <div class="text-info">
        <div class="title">{{ title }}</div>
        <div class="author" v-if="author">{{ author }}</div>
      </div>
    </div>

    <!-- 控制区域 -->
    <div class="player-controls">
      <!-- 进度条 -->
      <div class="progress-container">
        <span class="time current">{{ formattedCurrentTime }}</span>
        <div class="progress-bar" @click="seek">
          <div class="progress-bg" />
          <div class="progress-fill" :style="{ width: `${progress}%` }" />
          <div class="progress-thumb" :style="{ left: `${progress}%` }" />
        </div>
        <span class="time duration">{{ formattedDuration }}</span>
      </div>

      <!-- 按钮区域 -->
      <div class="buttons">
        <!-- 快退 -->
        <button class="control-btn" @click="skipBackward" title="后退 10 秒">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8zm-1.1 11H10v-3.3L9 13v-.7l1.8-.6h.1V16zm4.3-1.8c0 .3 0 .6-.1.8l-.3.6-.5.3-.7.1c-.3 0-.5 0-.7-.1l-.5-.3-.3-.6-.1-.8v-.7c0-.3 0-.6.1-.8l.3-.6.5-.3.7-.1c.3 0 .5 0 .7.1l.5.3.3.6.1.8v.7zm-.9-.8v-.5s-.1-.2-.1-.3-.1-.1-.2-.2-.2-.1-.3-.1-.2 0-.3.1l-.2.2s-.1.2-.1.3v2s.1.2.1.3.1.1.2.2.2.1.3.1.2 0 .3-.1l.2-.2s.1-.2.1-.3v-.5-.5z"/>
          </svg>
        </button>

        <!-- 播放/暂停 -->
        <button class="control-btn play-btn" @click="togglePlay" :disabled="isLoading">
          <svg v-if="isLoading" class="loading-spinner" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" stroke-dasharray="32" stroke-linecap="round" />
          </svg>
          <svg v-else-if="isPlaying" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </button>

        <!-- 快进 -->
        <button class="control-btn" @click="skipForward" title="快进 10 秒">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8zm-1.1 11H10v-3.3L9 13v-.7l1.8-.6h.1V16zm4.3-1.8c0 .3 0 .6-.1.8l-.3.6-.5.3-.7.1c-.3 0-.5 0-.7-.1l-.5-.3-.3-.6-.1-.8v-.7c0-.3 0-.6.1-.8l.3-.6.5-.3.7-.1c.3 0 .5 0 .7.1l.5.3.3.6.1.8v.7zm-.9-.8v-.5s-.1-.2-.1-.3-.1-.1-.2-.2-.2-.1-.3-.1-.2 0-.3.1l-.2.2s-.1.2-.1.3v2s.1.2.1.3.1.1.2.2.2.1.3.1.2 0 .3-.1l.2-.2s.1-.2.1-.3v-.5-.5z"/>
          </svg>
        </button>

        <!-- 音量控制 -->
        <div class="volume-container" @mouseenter="showVolume = true" @mouseleave="showVolume = false">
          <button class="control-btn volume-btn" @click="toggleMute">
            <svg v-if="isMuted || volume === 0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
            </svg>
            <svg v-else-if="volume < 0.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
          </button>
          <div class="volume-slider" v-show="showVolume">
            <div class="volume-bar" @click="setVolume">
              <div class="volume-bg" />
              <div class="volume-fill" :style="{ width: `${volume * 100}%` }" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 迷你悬浮播放器 - 正方形卡片风格 -->
  <Teleport to="body">
    <Transition name="mini-player">
      <div 
        v-if="isMiniMode && mini"
        class="mini-player"
        :style="{ right: `${miniPosition.x}px`, bottom: `${miniPosition.y}px` }"
        :class="{ dragging: isDragging }"
        @mousedown="startDrag"
      >
        <!-- 关闭按钮 -->
        <button class="mini-close" @click.stop="closeMiniMode" @mousedown.stop title="关闭">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>

        <!-- 中心区域：唱片 + 播放按钮重叠 + 动效 -->
        <div class="mini-center" @click.stop @mousedown.stop>
          <!-- 脉冲光环动画 -->
          <div class="pulse-ring" :class="{ active: isPlaying }"></div>
          <div class="pulse-ring ring2" :class="{ active: isPlaying }"></div>
          
          <!-- 唱片背景 -->
          <div class="mini-disc" :class="{ spinning: isPlaying }">
            <div class="mini-disc-groove"></div>
            <div class="mini-disc-groove ring2"></div>
            <div class="mini-disc-inner">
              <!-- 音波动画 -->
              <div class="sound-waves" :class="{ active: isPlaying }">
                <span class="wave"></span>
                <span class="wave"></span>
                <span class="wave"></span>
              </div>
            </div>
          </div>
          
          <!-- 播放按钮覆盖在唱片上 -->
          <button class="mini-play-btn" :class="{ playing: isPlaying }" @click.stop="togglePlay">
            <svg v-if="isPlaying" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>
        </div>

        <!-- 底部滚动标题 -->
        <div class="mini-title-bar">
          <div class="mini-title-scroll" :class="{ scrolling: title.length > 8 }">
            <span>{{ title }}</span>
            <span v-if="title.length > 8">{{ title }}</span>
          </div>
        </div>

        <!-- 进度条 -->
        <div class="mini-progress" @click.stop="seek" @mousedown.stop>
          <div class="mini-progress-fill" :style="{ width: `${progress}%` }"></div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.audio-player {
  --player-bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --player-bg-dark: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  --text-primary: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.7);
  --progress-bg: rgba(255, 255, 255, 0.2);
  --progress-fill: #ffffff;
  --btn-hover: rgba(255, 255, 255, 0.1);
  
  background: var(--player-bg);
  border-radius: 16px;
  padding: 20px;
  margin: 24px 0;
  box-shadow: 0 10px 40px rgba(102, 126, 234, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.dark .audio-player {
  background: var(--player-bg-dark);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
}

.audio-player:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 50px rgba(102, 126, 234, 0.4);
}

.dark .audio-player:hover {
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.5);
}

/* 播放器信息区 */
.player-info {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.cover-wrapper {
  position: relative;
  width: 64px;
  height: 64px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.cover-overlay.playing {
  opacity: 1;
}

.music-wave {
  width: 24px;
  height: 24px;
  fill: white;
}

.music-wave .bar {
  transform-origin: bottom;
  animation: none;
}

.cover-overlay.playing .bar1 { animation: wave 0.4s ease-in-out infinite alternate; }
.cover-overlay.playing .bar2 { animation: wave 0.4s ease-in-out infinite alternate 0.1s; }
.cover-overlay.playing .bar3 { animation: wave 0.4s ease-in-out infinite alternate 0.2s; }
.cover-overlay.playing .bar4 { animation: wave 0.4s ease-in-out infinite alternate 0.3s; }

@keyframes wave {
  0% { transform: scaleY(0.5); }
  100% { transform: scaleY(1); }
}

.text-info {
  flex: 1;
  min-width: 0;
}

.title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.author {
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 4px;
}

/* 控制区域 */
.player-controls {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 进度条 */
.progress-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.time {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  min-width: 40px;
  font-variant-numeric: tabular-nums;
}

.time.current {
  text-align: right;
}

.time.duration {
  text-align: left;
}

.progress-bar {
  flex: 1;
  height: 6px;
  position: relative;
  cursor: pointer;
  border-radius: 3px;
}

.progress-bg {
  position: absolute;
  inset: 0;
  background: var(--progress-bg);
  border-radius: 3px;
}

.progress-fill {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  background: var(--progress-fill);
  border-radius: 3px;
  transition: width 0.1s ease;
}

.progress-thumb {
  position: absolute;
  top: 50%;
  width: 14px;
  height: 14px;
  background: white;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.progress-bar:hover .progress-thumb {
  opacity: 1;
}

/* 按钮区域 */
.buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.control-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  color: var(--text-primary);
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease, transform 0.2s ease;
}

.control-btn:hover {
  background: var(--btn-hover);
}

.control-btn:active {
  transform: scale(0.95);
}

.control-btn svg {
  width: 20px;
  height: 20px;
}

.play-btn {
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
}

.play-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.play-btn svg {
  width: 28px;
  height: 28px;
}

.play-btn:disabled {
  cursor: wait;
}

.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 音量控制 */
.volume-container {
  position: relative;
  display: flex;
  align-items: center;
}

.volume-slider {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  padding: 12px 8px;
  border-radius: 8px;
  margin-bottom: 8px;
}

.volume-bar {
  width: 80px;
  height: 4px;
  position: relative;
  cursor: pointer;
  border-radius: 2px;
}

.volume-bg {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.volume-fill {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  background: white;
  border-radius: 2px;
}

/* ==================== 迷你播放器 - 正方形卡片风格 ==================== */
.mini-player {
  position: fixed;
  z-index: 9999;
  width: 100px;
  height: 120px;
  background: linear-gradient(145deg, #5b4b8a 0%, #4a3d6e 100%);
  border-radius: 16px;
  box-shadow: 
    0 10px 40px rgba(91, 75, 138, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  overflow: hidden;
  user-select: none;
  cursor: grab;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.mini-player:active,
.mini-player.dragging {
  cursor: grabbing;
  transform: scale(1.05);
  box-shadow: 
    0 15px 50px rgba(91, 75, 138, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.mini-player:hover {
  box-shadow: 
    0 12px 48px rgba(91, 75, 138, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

/* 关闭按钮 */
.mini-close {
  position: absolute;
  right: 6px;
  top: 6px;
  width: 20px;
  height: 20px;
  border: none;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 10;
  backdrop-filter: blur(4px);
}

.mini-close:hover {
  background: rgba(255, 82, 82, 0.6);
  transform: scale(1.1);
}

.mini-close svg {
  width: 12px;
  height: 12px;
  color: rgba(255, 255, 255, 0.9);
}

/* 中心区域容器 */
.mini-center {
  position: absolute;
  left: 50%;
  top: 45%;
  transform: translate(-50%, -50%);
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

/* 唱片背景 - 居中 */
.mini-disc {
  position: absolute;
  width: 65px;
  height: 65px;
  background: 
    radial-gradient(circle at 30% 30%, rgba(255,255,255,0.15) 0%, transparent 40%),
    conic-gradient(from 0deg, #2a2a3a, #1a1a2a, #2a2a3a, #1a1a2a, #2a2a3a, #1a1a2a, #2a2a3a);
  border-radius: 50%;
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.5),
    inset 0 0 0 2px rgba(255, 255, 255, 0.05),
    inset 0 0 30px rgba(0, 0, 0, 0.4);
}

.mini-disc.spinning {
  animation: disc-spin 3s linear infinite;
}

@keyframes disc-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 唱片纹路 */
.mini-disc-groove {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50px;
  height: 50px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.mini-disc-groove.ring2 {
  width: 35px;
  height: 35px;
}

/* 唱片中心 */
.mini-disc-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 
    0 2px 8px rgba(102, 126, 234, 0.5),
    inset 0 1px 2px rgba(255, 255, 255, 0.3);
  overflow: hidden;
}

.mini-disc-inner::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4px;
  height: 4px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

/* 脉冲光环动画 */
.pulse-ring {
  position: absolute;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  border: 2px solid rgba(102, 126, 234, 0.3);
  opacity: 0;
  pointer-events: none;
}

.pulse-ring.active {
  animation: pulse-expand 2s ease-out infinite;
}

.pulse-ring.ring2.active {
  animation-delay: 1s;
}

@keyframes pulse-expand {
  0% {
    transform: scale(0.8);
    opacity: 1;
    border-color: rgba(102, 126, 234, 0.6);
  }
  100% {
    transform: scale(1.8);
    opacity: 0;
    border-color: rgba(102, 126, 234, 0);
  }
}

/* 音波动画 */
.sound-waves {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  height: 12px;
}

.sound-waves .wave {
  width: 2px;
  height: 4px;
  background: white;
  border-radius: 1px;
  opacity: 0.8;
}

.sound-waves.active .wave {
  animation: wave-bounce 0.5s ease-in-out infinite alternate;
}

.sound-waves.active .wave:nth-child(1) {
  animation-delay: 0s;
}

.sound-waves.active .wave:nth-child(2) {
  animation-delay: 0.15s;
}

.sound-waves.active .wave:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes wave-bounce {
  0% {
    height: 4px;
  }
  100% {
    height: 12px;
  }
}

/* 播放按钮 - 覆盖在唱片中心 */
.mini-play-btn {
  position: relative;
  z-index: 5;
  width: 42px;
  height: 42px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.3),
    inset 0 0 0 1px rgba(255, 255, 255, 0.15);
}

.mini-play-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
  box-shadow: 
    0 6px 20px rgba(0, 0, 0, 0.4),
    inset 0 0 0 1px rgba(255, 255, 255, 0.2);
}

.mini-play-btn:active {
  transform: scale(0.95);
}

.mini-play-btn.playing {
  background: rgba(102, 126, 234, 0.4);
  box-shadow: 
    0 4px 20px rgba(102, 126, 234, 0.5),
    0 0 15px rgba(102, 126, 234, 0.3),
    inset 0 0 0 1px rgba(255, 255, 255, 0.2);
  animation: btn-glow 2s ease-in-out infinite alternate;
}

@keyframes btn-glow {
  0% {
    box-shadow: 
      0 4px 20px rgba(102, 126, 234, 0.5),
      0 0 15px rgba(102, 126, 234, 0.3),
      inset 0 0 0 1px rgba(255, 255, 255, 0.2);
  }
  100% {
    box-shadow: 
      0 4px 25px rgba(118, 75, 162, 0.6),
      0 0 20px rgba(118, 75, 162, 0.4),
      inset 0 0 0 1px rgba(255, 255, 255, 0.25);
  }
}

.mini-play-btn svg {
  width: 20px;
  height: 20px;
  color: white;
  margin-left: 2px;
}

/* 底部标题栏 */
.mini-title-bar {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 14px;
  height: 16px;
  overflow: hidden;
  padding: 0 8px;
}

.mini-title-scroll {
  display: flex;
  white-space: nowrap;
  font-size: 10px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
  text-align: center;
  justify-content: center;
}

.mini-title-scroll span {
  padding-right: 30px;
}

.mini-title-scroll.scrolling {
  justify-content: flex-start;
  animation: scroll-title 6s linear infinite;
}

@keyframes scroll-title {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

/* 进度条 */
.mini-progress {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 4px;
  background: rgba(0, 0, 0, 0.3);
  cursor: pointer;
}

.mini-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #a855f7 100%);
  transition: width 0.1s ease;
  box-shadow: 0 0 8px rgba(102, 126, 234, 0.5);
}

/* 迷你播放器动画 */
.mini-player-enter-active,
.mini-player-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.mini-player-enter-from,
.mini-player-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}

/* 响应式 */
@media (max-width: 480px) {
  .audio-player {
    padding: 16px;
  }
  
  .player-info {
    margin-bottom: 16px;
  }
  
  .cover-wrapper {
    width: 48px;
    height: 48px;
  }
  
  .title {
    font-size: 14px;
  }
  
  .progress-container {
    gap: 8px;
  }
  
  .time {
    font-size: 11px;
    min-width: 32px;
  }
  
  .control-btn {
    width: 36px;
    height: 36px;
  }
  
  .control-btn svg {
    width: 18px;
    height: 18px;
  }
  
  .play-btn {
    width: 48px;
    height: 48px;
  }
  
  .play-btn svg {
    width: 24px;
    height: 24px;
  }
  
  /* 迷你播放器移动端适配 */
  .mini-player {
    right: 10px;
    bottom: 10px;
    width: 90px;
    height: 110px;
  }
  
  .mini-disc {
    width: 44px;
    height: 44px;
  }
  
  .mini-play-center {
    width: 36px;
    height: 36px;
  }
  
  .mini-play-center svg {
    width: 18px;
    height: 18px;
  }
}
</style>
