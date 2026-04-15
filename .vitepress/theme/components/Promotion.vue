<template>
  <div class="promotion-container mt-16 mb-8">
    <hr class="border-t border-border-light dark:border-border-dark mb-10" />
    <div class="promotion-card bg-primary/5 dark:bg-primary/10 rounded-2xl p-6 lg:p-10 border border-primary/20 backdrop-blur-sm relative overflow-hidden group">
      <!-- Decorative background elements -->
      <div class="absolute -right-16 -top-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700"></div>
      <div class="absolute -left-16 -bottom-16 w-48 h-48 bg-primary/5 rounded-full blur-2xl"></div>
      
      <div class="flex flex-col md:flex-row items-center gap-8 lg:gap-12 relative z-10">
        <!-- Text Content -->
        <div class="flex-1 text-center md:text-left">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-4">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            关注我们
          </div>
          <h3 class="text-2xl lg:text-3xl font-black mb-4 text-text-light dark:text-text-dark tracking-tight">
            更多 AI 工具实战内容
          </h3>
          <p class="text-text-light/70 dark:text-text-dark/70 leading-relaxed text-lg mb-8">
            关注微信公众号 <span class="text-primary font-bold underline underline-offset-4 decoration-primary/30">小杨技术笔记</span>，第一时间获取大模型、Agent、RAG 等前沿技术解析与实战分享。
          </p>
          <div class="flex flex-wrap justify-center md:justify-start gap-3">
            <span class="px-4 py-1.5 rounded-lg bg-white/50 dark:bg-black/20 border border-border-light dark:border-border-dark text-sm font-medium"># AI 智能体</span>
            <span class="px-4 py-1.5 rounded-lg bg-white/50 dark:bg-black/20 border border-border-light dark:border-border-dark text-sm font-medium"># RAG 应用</span>
            <span class="px-4 py-1.5 rounded-lg bg-white/50 dark:bg-black/20 border border-border-light dark:border-border-dark text-sm font-medium"># 技术复盘</span>
          </div>
        </div>

        <!-- QR Code -->
        <div class="relative shrink-0">
          <div class="absolute -inset-6 bg-primary/20 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div class="relative bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-2xl border border-white/20 dark:border-white/10 overflow-hidden transform group-hover:scale-105 transition-transform duration-500">
            <img 
              src="https://www.smallyoung.cn/images/wechat.jpg" 
              alt="小杨技术笔记" 
              class="w-32 h-32 lg:w-40 lg:h-40 rounded-xl"
            />
            <div class="mt-3 text-center">
              <span class="text-[10px] font-bold text-text-light/40 dark:text-text-dark/40 uppercase tracking-[0.2em]">扫码即刻关注</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Promotion component
</script>

<style scoped>
.promotion-container {
  animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUpFade {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}

.promotion-card {
  box-shadow: 0 20px 50px -12px rgba(19, 127, 236, 0.1);
}
</style>
