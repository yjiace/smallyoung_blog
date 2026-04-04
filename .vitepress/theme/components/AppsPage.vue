<template>
  <div class="flex flex-col bg-background-light dark:bg-background-dark font-display text-text-light dark:text-text-dark">
    <main class="w-full flex-1 p-6 lg:p-8">
      <div class="mx-auto max-w-7xl">
        <!-- 页面标题 (统一位置，保持原内容) -->
        <header class="mb-10 text-left">
          <h1 class="text-4xl font-black leading-tight tracking-tighter">精选应用</h1>
          <p class="mt-2 text-text-light/60 dark:text-text-dark/60">探索高效工具生态，发现提升生产力的数字利器</p>
        </header>

        <!-- 应用卡片网格 -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <a
            v-for="(link, index) in friendLinks"
            :key="link.name"
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            class="group relative flex flex-col justify-between overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            :style="{ background: getGradient(index) }"
          >
            <!-- 背景装饰圆圈 -->
            <div class="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10"></div>
            <div class="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-white/5"></div>

            <!-- 图标 + 名称 -->
            <div class="relative flex items-center gap-4 mb-3">
              <div class="w-14 h-14 rounded-xl overflow-hidden bg-white/20 flex items-center justify-center flex-shrink-0 shadow-lg">
                <img
                  v-if="link.avatar"
                  :src="link.avatar"
                  :alt="link.name"
                  class="w-10 h-10 object-contain"
                  @error="($event.target as HTMLImageElement).style.display='none'"
                />
                <span v-else class="text-2xl font-black text-white">{{ link.name[0] }}</span>
              </div>
              <div>
                <h3 class="text-xl font-black text-white leading-tight">{{ link.name }}</h3>
                <div class="h-0.5 w-12 bg-white/40 mt-1 group-hover:w-20 transition-all duration-300"></div>
              </div>
            </div>

            <!-- 描述 -->
            <p class="relative text-white/80 text-sm leading-relaxed mb-5">{{ link.introduction }}</p>

            <!-- 按钮 -->
            <div class="relative">
              <span
                class="inline-block px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 group-hover:shadow-lg bg-white/20 text-white"
              >
                {{ link.title }}
              </span>
            </div>
          </a>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import CustomHeader from './CustomHeader.vue'

interface FriendLink {
  name: string
  introduction: string
  url: string
  avatar?: string
  title: string
}

// 预定义精美渐变色池
const gradients = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #6a82fb 0%, #fc5c7d 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #7f53ac 0%, #647dee 100%)',
  'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
  'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
  'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
  'linear-gradient(135deg, #f77062 0%, #fe5196 100%)',
  'linear-gradient(135deg, #24243e 0%, #302b63 50%, #0f0c29 100%)'
]

const friendLinks = ref<FriendLink[]>([])

onMounted(async () => {
  try {
    const response = await fetch('/data/apps.json')
    if (response.ok) {
      friendLinks.value = await response.json()
    }
  } catch (error) {
    console.error('加载应用列表失败:', error)
  }
})

// 获取渐变色逻辑
const getGradient = (index: number) => {
  return gradients[index % gradients.length]
}
</script>

<style scoped>
.group:hover .group-hover\:shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
}
</style>
