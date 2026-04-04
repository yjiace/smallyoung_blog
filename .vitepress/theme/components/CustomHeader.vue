<template>
  <header class="custom-header">
    <div class="header-container">
      <!-- 左侧 Logo 和标题 -->
      <div class="header-left">
        <a href="/" class="logo-link">
          <img src="/logo.png" alt="Logo" class="logo-img" />
          <span class="logo-text">SmallYoung</span>
        </a>
      </div>

      <!-- 中间搜索区域 -->
      <div class="header-center">
        <div class="search-box-wrapper" @click="openSearch">
          <span class="material-symbols-outlined search-icon text-[18px]">search</span>
          <input
            ref="searchInput"
            v-model="searchQuery"
            type="text"
            placeholder="搜索文章..."
            class="search-input"
            @focus="openSearch"
            readonly
          />
          <div class="search-kbd">
            <span class="kbd-text">Ctrl K</span>
          </div>
        </div>
      </div>

      <!-- 右侧导航和功能区 -->
      <div class="header-right">
        <nav class="nav-links">
          <a href="/" class="nav-item">首页</a>
          <a href="/docs" class="nav-item">技术文档</a>
          <a href="/products" class="nav-item">产品</a>
          <a href="/apps" class="nav-item">应用</a>
        </nav>

        <div class="theme-switch-container">
          <button 
            class="theme-switch" 
            :class="{ 'is-dark': isDark }" 
            @click="toggleTheme"
            :aria-label="isDark ? '切换到浅色模式' : '切换到深色模式'"
          >
            <div class="switch-handle shadow-sm">
              <span class="material-symbols-outlined text-[14px]">
                {{ isDark ? 'dark_mode' : 'light_mode' }}
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const searchQuery = ref('')
const searchInput = ref<HTMLInputElement | null>(null)
let searchTimeout: ReturnType<typeof setTimeout> | null = null
const isDark = ref(false)

const emit = defineEmits<{ 'search': [query: string] }>()

function openSearch() {
  emit('search')
}

function onSearchInput() {
  // 由于设置了 readonly，该函数不再需要处理实时输入，
  // 所有的输入将在弹出的搜索模态框中进行。
}

function toggleTheme() {
  isDark.value = !isDark.value
  const htmlElement = document.documentElement
  if (isDark.value) {
    htmlElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    htmlElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

function loadTheme() {
  try {
    const savedTheme = localStorage.getItem('theme')
    // 同时也检查系统偏好或 VitePress 默认类名
    const hasDarkClass = document.documentElement.classList.contains('dark')
    if (savedTheme === 'dark' || (!savedTheme && hasDarkClass)) {
      isDark.value = true
      document.documentElement.classList.add('dark')
    } else {
      isDark.value = false
      document.documentElement.classList.remove('dark')
    }
  } catch {
    isDark.value = false
  }
}

onMounted(() => {
  loadTheme()
})
</script>

<style scoped>
/* Header Styling */
.custom-header {
  position: sticky;
  top: 0;
  z-index: 100;
  height: 64px;
  width: 100%;
  border-bottom: 1px solid var(--vp-c-divider);
  background-color: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.03);
}

.dark .custom-header {
  background-color: rgba(16, 25, 34, 0.8);
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.2);
}

.header-container {
  max-width: 1600px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
}

.header-left {
  display: flex;
  align-items: center;
  min-width: 180px;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.logo-link:hover {
  transform: scale(1.02);
}

.logo-img {
  width: 38px;
  height: 38px;
  object-fit: contain;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.logo-link:hover .logo-img {
  transform: rotate(10deg) scale(1.15);
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: -0.01em;
  background: linear-gradient(135deg, var(--vp-c-text-1) 0%, var(--vp-c-text-2) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.header-center {
  flex: 1;
  max-width: 600px;
  display: flex;
  justify-content: center;
}

.search-box-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  height: 42px;
  width: 100%;
  max-width: 420px;
  padding: 0 16px;
  cursor: text;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.search-box-wrapper:hover,
.search-box-wrapper:focus-within {
  background-color: var(--vp-c-bg-mute);
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 12px -4px var(--vp-c-brand-soft);
}

.search-box-wrapper:focus-within .search-icon {
  color: var(--vp-c-brand-1);
}

.search-icon {
  color: var(--vp-c-text-3);
  margin-right: 10px;
  font-size: 20px !important;
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  outline: none;
  padding: 0;
}

.search-input::placeholder {
  color: var(--vp-c-text-3);
  font-weight: 400;
}

.search-kbd {
  display: flex;
  align-items: center;
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  padding: 2px 8px;
  margin-left: 10px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.kbd-text {
  font-size: 11px;
  font-weight: 700;
  color: var(--vp-c-text-2);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-item {
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  text-decoration: none;
  transition: color 0.2s;
}

.nav-item:hover {
  color: var(--vp-c-brand-1);
}

/* Theme Switcher */
.theme-switch {
  position: relative;
  width: 52px;
  height: 26px;
  background-color: #e2e8f0;
  border-radius: 99px;
  border: 1px solid #cbd5e1;
  cursor: pointer;
  padding: 0;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.dark .theme-switch {
  background-color: #334155;
  border-color: #475569;
}

.switch-handle {
  position: absolute;
  left: 2px;
  width: 20px;
  height: 20px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: #64748b;
}

.theme-switch.is-dark .switch-handle {
  transform: translateX(26px);
  background-color: #1e293b;
  color: #94a3b8;
}

@media (max-width: 960px) {
  .header-center {
    display: none;
  }
  .nav-links {
    display: none;
  }
}
</style>
