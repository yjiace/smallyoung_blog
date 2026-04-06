<template>
  <!-- 全屏滚动捕捉容器 (注：配合 CustomHeader 高度进行了偏移补偿) -->
  <div class="product-showcase bg-background-light dark:bg-background-dark font-display text-text-light dark:text-text-dark">
    
    <!-- 侧边导航指示器 (Fixed) -->
    <div class="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-4">
      <button 
        v-for="(node, idx) in products.length + 1" 
        :key="idx"
        @click="scrollToNode(idx)"
        class="group relative flex items-center justify-end"
      >
      <!-- 
        <span class="mr-4 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-black tracking-widest uppercase text-primary">
          {{ getNodeLabel(idx) }}
        </span>
         -->
        <div 
          class="w-3 h-3 rounded-full border-2 transition-all duration-300"
          :class="[
            currentActive === idx 
              ? 'bg-primary border-primary scale-125 shadow-lg shadow-primary/40' 
              : 'border-text-light/20 dark:border-text-dark/20 hover:border-primary/50'
          ]"
        ></div>
      </button>
    </div>

    <!-- 1. Hero 区域 (Banner 1) -->
    <section 
      id="node-0"
      class="snap-node relative h-[calc(100vh-64px)] flex items-center overflow-hidden snap-start scroll-mt-16"
    >
      <div class="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/30 dark:from-primary/5 dark:to-transparent"></div>
      <div class="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      
      <div class="relative mx-auto max-w-7xl px-6 w-full">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div class="space-y-6 lg:space-y-8 animate-in slide-in-from-left duration-700">
            <h1 class="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter leading-[1.2]">
              创新驱动<br/>
              <span class="bg-clip-text text-transparent bg-gradient-to-r from-primary via-indigo-500 to-purple-600">
                全场景产品矩阵
              </span>
            </h1>
            <p class="text-lg lg:text-xl text-text-light/60 dark:text-text-dark/60 max-w-lg leading-relaxed font-medium">
              在这里，我们集中展示了在 AI 智能助手、移动端 APP 及高性能 Web 平台上的核心研发成果。每一款产品都是对“效能与体验”的极致诠释。
            </p>
            <div class="flex gap-4">
              <button @click="scrollToNode(1)" class="px-6 py-3 md:px-8 md:py-4 rounded-full bg-primary text-white font-bold shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95">
                浏览产品详情
              </button>
            </div>
          </div>
          <div class="hidden lg:flex justify-center">
             <div class="relative w-80 h-80 flex items-center justify-center animate-float">
               <img src="/logo.png" alt="Logo" class="absolute w-64 h-64 object-contain drop-shadow-2xl" />
            </div>
          </div>
        </div>
      </div>

      <!-- 底部下滑提示 -->
      <div 
        class="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce opacity-40 cursor-pointer hover:opacity-100 transition-opacity"
        @click="scrollToNode(1)"
      >
        <span class="material-symbols-outlined text-2xl lg:text-3xl">expand_more</span>
      </div>
    </section>

    <!-- 2. 产品列表 (Banner 集合) -->
    <div class="banners-container">
      <section 
        v-for="(item, index) in products" 
        :key="item.title"
        :id="'node-' + (index + 1)"
        class="snap-node min-h-[calc(100vh-64px)] lg:h-[calc(100vh-64px)] flex items-center px-6 snap-start scroll-mt-16 overflow-hidden border-t border-border-light/50 dark:border-border-dark/30 py-12 lg:py-0"
      >
        <div class="mx-auto max-w-7xl w-full">
          <div class="group grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-24 items-center">
            
            <!-- 图片区域 (Mockup) -->
            <div 
              :class="[
                'relative flex justify-center w-full animate-in zoom-in-95 duration-700',
                index % 2 === 0 ? 'lg:col-span-6 lg:order-1' : 'lg:col-span-6 lg:order-2'
              ]"
            >
              <div 
                class="relative transition-all duration-700"
                :class="[
                  item.type === 'web' ? 'w-full max-w-2xl' : 'w-full max-w-[280px] lg:max-w-[360px]'
                ]"
              >
                <!-- 手机边框特效 -->
                <div v-if="item.type !== 'web'" class="absolute -inset-6 bg-primary/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div 
                  class="relative overflow-hidden shadow-3xl transition-all duration-700 group-hover:shadow-primary/40"
                  :class="[
                    item.type === 'web' 
                      ? 'rounded-[1rem] lg:rounded-[1.5rem] aspect-[16/10]' 
                      : [
                          'rounded-[2rem] lg:rounded-[2.5rem] aspect-[9/16] border-[6px] lg:border-[8px] border-card-dark dark:border-border-dark max-h-[60vh] lg:max-h-[82vh]',
                          index % 2 === 0 ? 'lg:-rotate-6 group-hover:lg:-rotate-3' : 'lg:rotate-6 group-hover:lg:rotate-3'
                        ]
                  ]"
                >
                  <img :src="item.image" :alt="item.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                  <div class="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
                </div>
              </div>
            </div>

            <!-- 文字区域 -->
            <div 
              :class="[
                'lg:col-span-6 space-y-6 lg:space-y-8 animate-in slide-in-from-bottom-8 duration-700 delay-200',
                index % 2 === 0 ? 'lg:order-2' : 'lg:order-1 flex flex-col'
              ]"
            >
              <div class="space-y-2 lg:space-y-4">
                <h2 class="text-3xl md:text-4xl lg:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-text-light to-text-light/60 dark:from-text-dark dark:to-text-dark/60 leading-tight">
                  {{ item.title }}
                </h2>
              </div>
              <p class="text-base lg:text-xl text-text-light/60 dark:text-text-dark/60 leading-relaxed font-medium indent-8 lg:indent-[2em]">
                {{ item.description }}
              </p>
              <div :class="['flex gap-4 pt-2 lg:pt-4']">
                <button 
                  @click="handleAction(item)"
                  class="px-8 py-3 lg:px-10 lg:py-4 rounded-full bg-primary text-white font-bold text-sm shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  {{ item.type === 'miniprogram' ? '扫码体验' : '查看详情' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>


  </div>

    <!-- 二维码弹窗 (Global Modal) -->
    <Transition name="fade">
      <div 
        v-if="activeQRCode" 
        class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md px-6"
        @click.self="closeQRCode"
      >
        <div class="relative bg-white dark:bg-card-dark rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-300 border border-border-light dark:border-border-dark overflow-hidden">
          <button 
            @click="closeQRCode"
            class="absolute top-4 right-4 text-text-light/40 dark:text-text-dark/40 hover:text-primary transition-colors z-10"
          >
            <span class="material-symbols-outlined">close</span>
          </button>
          
          <div class="space-y-6 text-center">
            <h3 class="text-2xl font-black tracking-tight text-text-light dark:text-text-dark">扫描开始体验</h3>
            <div class="relative aspect-square rounded-2xl bg-white p-4 shadow-inner overflow-hidden border-4 border-primary/10">
              <img :src="activeQRCode" alt="QR Code" class="w-full h-full object-contain" />
              <!-- 如果没有图片显示提示 -->
              <div v-if="!activeQRCode" class="absolute inset-0 flex items-center justify-center text-xs text-text-light/20">
                二维码加载中...
              </div>
            </div>
            <p class="text-sm text-text-light/60 dark:text-text-dark/60 font-medium">
              微信扫一扫，立即体验小程序
            </p>
          </div>
        </div>
      </div>
    </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const currentActive = ref(0)
const products = ref<any[]>([])
const activeQRCode = ref<string | null>(null)

function getNodeLabel(idx: number) {
  if (idx === 0) return 'Intro'
  return `Project 0${idx}`
}

function handleAction(item: any) {
  if (item.type === 'miniprogram' && item.qrcode) {
    activeQRCode.value = item.qrcode
  } else if (item.link && item.link !== '#') {
    window.open(item.link, '_blank')
  }
}

function closeQRCode() {
  activeQRCode.value = null
}

function scrollToNode(idx: number) {
  const el = document.getElementById(`node-${idx}`)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

// 监听滚动更新当前激活点
const handleScroll = () => {
  const nodes = document.querySelectorAll('.snap-node')
  let currentIdx = 0
  let minDiff = Infinity
  
  nodes.forEach((node, idx) => {
    const rect = node.getBoundingClientRect()
    // 检查哪个节点最接近视口中心
    const diff = Math.abs(rect.top - 64) 
    if (diff < minDiff) {
      minDiff = diff
      currentIdx = idx
    }
  })
  currentActive.value = currentIdx
}

onMounted(() => {
  // 获取产品数据
  fetch('/data/products.json')
    .then(res => res.json())
    .then(data => {
      products.value = data
    })
    .catch(err => {
      console.error('Failed to load products:', err)
    })

  window.addEventListener('scroll', handleScroll, { passive: true })
  // 启用全局全屏捕捉样式
  document.documentElement.style.scrollSnapType = 'y mandatory'
  document.documentElement.style.scrollBehavior = 'smooth'
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  // 恢复全局样式
  document.documentElement.style.scrollSnapType = ''
  document.documentElement.style.scrollBehavior = ''
})

import { computed } from 'vue'
</script>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-30px); }
}
.animate-float {
  animation: float 8s ease-in-out infinite;
}

.shadow-3xl {
  box-shadow: 0 45px 80px -20px rgba(0, 0, 0, 0.45);
}

.product-showcase {
  scroll-behavior: smooth;
}

/* 进场动画补丁 */
.animate-in {
  animation-fill-mode: forwards;
}

@media (max-width: 1024px) {
  .snap-node {
    height: auto !important;
    min-height: 85vh !important;
    padding-top: 5rem !important;
    padding-bottom: 5rem !important;
    scroll-snap-align: none !important; /* 移动端有时自动捕捉体验不好，可以禁用或设为 center */
  }
}

/* 弹窗动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
