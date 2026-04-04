<template>
  <aside class="doc-sidebar custom-scrollbar">
    <div v-for="section in sidebar" :key="section.text" class="sidebar-section">
      <div 
        class="section-header" 
        @click="toggleSection(section.text)"
      >
        <span class="section-title">{{ section.text }}</span>
        <span class="material-symbols-outlined expand-icon" :class="{ 'is-collapsed': collapsedSections.has(section.text) }">
          expand_more
        </span>
      </div>
      
      <transition name="expand">
        <nav v-if="!collapsedSections.has(section.text)" class="section-items">
          <a
            v-for="item in section.items"
            :key="item.link"
            :href="item.link"
            target="_blank"
            class="sidebar-item"
            :class="{ 'is-active': isActive(item.link) }"
          >
            {{ item.text }}
          </a>
        </nav>
      </transition>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vitepress'

const props = defineProps<{
  sidebar: any[]
}>()

const route = useRoute()
const collapsedSections = ref<Set<string>>(new Set())

function toggleSection(text: string) {
  if (collapsedSections.value.has(text)) {
    collapsedSections.value.delete(text)
  } else {
    collapsedSections.value.add(text)
  }
}

function isActive(link: string) {
  // 移除开头的斜杠进行比较，或者使用 route.path
  const path = route.path.replace(/\.html$/, '').replace(/\/$/, '')
  const itemLink = link.replace(/\.html$/, '').replace(/\/$/, '')
  return path === itemLink
}
</script>

<style scoped>
.doc-sidebar {
  width: 280px;
  height: calc(100vh - 64px);
  position: sticky;
  top: 64px;
  padding: 40px 16px 40px 24px;
  overflow-y: auto;
  border-right: 1px solid var(--vp-c-divider);
  background-color: transparent;
  transition: all 0.3s ease;
}

.sidebar-section {
  margin-bottom: 28px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  cursor: pointer;
  user-select: none;
  border-radius: 10px;
  margin-bottom: 6px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.section-header:hover {
  background-color: var(--vp-c-bg-soft);
}

.section-title {
  font-size: 14px;
  font-weight: 800;
  color: var(--vp-c-text-1);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  opacity: 0.85;
}

.expand-icon {
  font-size: 18px;
  color: var(--vp-c-text-3);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.expand-icon.is-collapsed {
  transform: rotate(-90deg);
}

.section-items {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-top: 4px;
}

.sidebar-item {
  font-size: 13.5px;
  line-height: 1.5;
  padding: 9px 12px;
  border-radius: 10px;
  color: var(--vp-c-text-2);
  text-decoration: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: 1px;
}

.sidebar-item:hover {
  background-color: var(--vp-c-bg-mute);
  color: var(--vp-c-brand-1);
  transform: translateX(4px);
}

.sidebar-item.is-active {
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-weight: 700;
  box-shadow: 0 4px 12px -4px var(--vp-c-brand-soft);
}

/* 展开动画 */
.expand-enter-active, .expand-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  max-height: 1000px;
  opacity: 1;
  overflow: hidden;
}
.expand-enter-from, .expand-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
}

/* 自定义滚动条 */
.doc-sidebar::-webkit-scrollbar {
  width: 4px;
}
.doc-sidebar::-webkit-scrollbar-track {
  background: transparent;
}
.doc-sidebar::-webkit-scrollbar-thumb {
  background: var(--vp-c-divider);
  border-radius: 10px;
  transition: background 0.3s;
}
.doc-sidebar:hover::-webkit-scrollbar-thumb {
  background: var(--vp-c-text-3);
}
</style>
