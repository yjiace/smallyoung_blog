<template>
  <div class="flex flex-col bg-background-light dark:bg-background-dark font-display text-text-light dark:text-text-dark min-h-screen">

    <!-- Hero 区域 -->
    <section class="relative overflow-hidden">
      <!-- 渐变背景 -->
      <div class="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950"></div>
      <!-- 装饰圆圈 -->
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-20 -left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>

      <div class="relative mx-auto max-w-5xl px-6 pt-32 pb-20 lg:pt-40 lg:pb-28 text-center">
        <!-- 头像 -->
        <div class="flex justify-center mb-8">
          <div class="relative group cursor-default">
            <!-- 呼吸发光背景 -->
            <div class="absolute -inset-4 bg-gradient-to-tr from-primary/20 via-purple-500/20 to-blue-500/20 rounded-full blur-2xl animate-pulse group-hover:scale-110 transition-transform duration-700"></div>
            
            <div class="relative logo-container overflow-visible">
              <img
                src="/logo.png"
                alt="SmallYoung"
                class="w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-2xl animate-float"
              />
              <!-- 悬浮装饰点缀 -->
              <!-- <div class="absolute -bottom-2 -right-2 w-10 h-10 bg-white dark:bg-gray-800 rounded-2xl shadow-xl flex items-center justify-center animate-bounce-slow border border-white/50 dark:border-gray-700/50 backdrop-blur-sm">
                <span class="text-2xl">🐕</span>
              </div>-->
            </div>
          </div>
        </div>

        <h1 class="text-4xl lg:text-6xl font-black tracking-normal mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-indigo-500 to-purple-600" style="line-height: 1.25; padding-top: 0.1em; padding-bottom: 0.1em;">
          SmallYoung
        </h1>
        <p class="text-xl lg:text-2xl font-semibold text-text-light/80 dark:text-text-dark/80 mb-4">
          AI · 大模型 · 软件架构
        </p>
        <p class="text-base lg:text-lg text-text-light/60 dark:text-text-dark/60 max-w-2xl mx-auto leading-relaxed mb-10">
          专注于 AI 大模型、Agent、RAG、软件架构等前沿技术的深度解析与实践分享。<br/>
          内容同步更新至今日头条、微信公众号、掘金等平台，欢迎关注。
        </p>

        <!-- CTA 按钮 -->
        <div class="flex flex-wrap items-center justify-center gap-4">
          <a
            href="/docs"
            class="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-white font-semibold hover:bg-primary/90 hover:-translate-y-0.5 transition-all shadow-lg shadow-primary/30"
          >
            <span class="material-symbols-outlined text-xl">description</span>
            浏览技术文档
          </a>
          <a
            href="/apps"
            class="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark font-semibold hover:border-primary hover:-translate-y-0.5 transition-all"
          >
            <span class="material-symbols-outlined text-xl">link</span>
            应用
          </a>
        </div>
      </div>
    </section>

    <!-- 社交平台 & 二维码区域 -->
    <section class="py-16 px-6">
      <div class="mx-auto max-w-5xl">
        <h2 class="text-2xl font-black text-center mb-2">关注我</h2>
        <p class="text-center text-text-light/60 dark:text-text-dark/60 mb-10">内容同步更新，欢迎在各平台关注</p>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- 今日头条 -->
          <div class="group relative flex flex-col items-center gap-6 p-8 rounded-3xl glass-card hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
            <!-- 装饰性光影 -->
            <div class="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors"></div>
            
            <div class="relative w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg" style="background: linear-gradient(135deg, #fe2c55, #ff6384)">
              <svg class="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
              </svg>
            </div>

            <!-- 二维码显示区 -->
            <div class="relative w-40 h-40 flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
              <div class="absolute -inset-2 bg-gradient-to-tr from-primary/20 to-transparent rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div class="relative qr-container w-full h-full rounded-2xl bg-white p-1 border border-gray-100 dark:border-gray-800 overflow-hidden shadow-inner">
                <img src="/images/toutiao.png" alt="今日头条二维码" class="w-full h-full object-contain rounded-xl" />
              </div>
            </div>

            <div class="text-center">
              <p class="font-bold text-lg">今日头条</p>
              <p class="text-sm text-text-light/50 dark:text-text-dark/50 mt-1">AI技术深度解析</p>
            </div>
            
            <a
              href="https://profile.zjurl.cn/rogue/ugc/profile/?f=a&user_id=5496224661"
              target="_blank"
              class="relative z-10 w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold text-sm shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transition-all active:scale-95"
            >
              前去关注
            </a>
          </div>

          <!-- 微信公众号 -->
          <div class="group relative flex flex-col items-center gap-6 p-8 rounded-3xl glass-card hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
            <div class="absolute -top-10 -right-10 w-32 h-32 bg-green-500/10 rounded-full blur-3xl group-hover:bg-green-500/20 transition-colors"></div>

            <div class="relative w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg" style="background: linear-gradient(135deg, #07c160, #35d474)">
              <svg class="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.5 13.5C7.67 13.5 7 12.83 7 12S7.67 10.5 8.5 10.5 10 11.17 10 12 9.33 13.5 8.5 13.5zm7 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM20 2H4C2.9 2 2 2.9 2 4v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
              </svg>
            </div>

            <div class="relative w-40 h-40 flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
              <div class="absolute -inset-2 bg-gradient-to-tr from-green-500/20 to-transparent rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div class="relative qr-container w-full h-full rounded-2xl bg-white p-1 border border-gray-100 dark:border-gray-800 overflow-hidden shadow-inner">
                <img src="/images/wechat.jpg" alt="微信公众号二维码" class="w-full h-full object-contain rounded-xl" />
              </div>
            </div>

            <div class="text-center">
              <p class="font-bold text-lg">微信公众号</p>
              <p class="text-sm text-text-light/50 dark:text-text-dark/50 mt-1">SmallYoung</p>
            </div>
            
            <div class="w-full py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-sm shadow-lg shadow-green-500/20 text-center">
              微信扫码关注
            </div>
          </div>

          <!-- 掘金 -->
          <div class="group relative flex flex-col items-center gap-6 p-8 rounded-3xl glass-card hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
            <div class="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors"></div>

            <div class="relative w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg" style="background: linear-gradient(135deg, #1e80ff, #4c9bff)">
              <svg class="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>

            <div class="relative w-40 h-40 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
              <div class="absolute inset-0 bg-blue-50 dark:bg-blue-950/20 rounded-2xl"></div>
              <svg class="relative w-24 h-24 text-blue-500/40 drop-shadow-sm" viewBox="0 0 48 48" fill="currentColor">
                <path d="M24 4L4 18l4 3 16-11 16 11 4-3L24 4zM24 22l-14 9.5 4 2.5 10-6.5 10 6.5 4-2.5L24 22zM24 36l-8 5.5 8 2.5 8-2.5L24 36z"/>
              </svg>
            </div>

            <div class="text-center">
              <p class="font-bold text-lg">掘金</p>
              <p class="text-sm text-text-light/50 dark:text-text-dark/50 mt-1">技术文章同步更新</p>
            </div>
            
            <a
              href="https://juejin.cn/user/4373200861407227"
              target="_blank"
              class="relative z-10 w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all active:scale-95"
            >
              前往掘金
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- 统计数据 -->
    <section class="py-10 px-6 bg-gradient-to-r from-primary/5 via-indigo-500/5 to-purple-500/5">
      <div class="mx-auto max-w-5xl">
        <div class="grid grid-cols-3 gap-6 text-center">
          <div class="p-6 rounded-2xl bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark">
            <p class="text-3xl lg:text-4xl font-black text-primary mb-1">{{ docsData?.stats?.totalDocs || 0 }}</p>
            <p class="text-sm text-text-light/60 dark:text-text-dark/60">技术文章</p>
          </div>
          <div class="p-6 rounded-2xl bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark">
            <p class="text-3xl lg:text-4xl font-black text-indigo-500 mb-1">{{ docsData?.stats?.totalCategories || 0 }}</p>
            <p class="text-sm text-text-light/60 dark:text-text-dark/60">技术分类</p>
          </div>
          <div class="p-6 rounded-2xl bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark">
            <p class="text-3xl lg:text-4xl font-black text-purple-500 mb-1">{{ docsData?.stats?.totalTags || 0 }}</p>
            <p class="text-sm text-text-light/60 dark:text-text-dark/60">技术标签</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 最新文章 -->
    <section class="py-16 px-6">
      <div class="mx-auto max-w-5xl">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-2xl font-black mb-1">最新文章</h2>
            <p class="text-text-light/60 dark:text-text-dark/60 text-sm">持续更新中，覆盖 AI 前沿技术</p>
          </div>
          <a href="/docs" class="inline-flex items-center gap-1 text-primary text-sm font-medium hover:underline">
            查看全部
            <span class="material-symbols-outlined text-base">arrow_forward</span>
          </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <DocCard v-for="doc in latestDocs" :key="doc.id" :doc="doc" />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { data as docsData } from '../../data/docs.data'
import DocCard from './DocCard.vue'

function onSearch(query: string) {
  if (query) {
    window.location.href = `/docs?q=${encodeURIComponent(query)}`
  }
}

// 最新 6 篇文章
const latestDocs = computed(() => (docsData?.docs || []).slice(0, 6))
</script>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(2deg); }
}

@keyframes bounce-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.animate-float {
  animation: float 5s ease-in-out infinite;
}

.animate-bounce-slow {
  animation: bounce-slow 3s ease-in-out infinite;
}

/* 玻璃拟态卡片 */
.glass-card {
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.dark .glass-card {
  background: rgba(30, 41, 59, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.qr-container {
  box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.05);
}

.dark .qr-container {
  box-shadow: inset 0 2px 15px rgba(0, 0, 0, 0.3);
}
</style>
