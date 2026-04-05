<template>
  <footer class="py-8 border-t border-border-light/30 dark:border-border-dark/20">
    <div class="max-w-7xl mx-auto px-6">
      <div class="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6 text-sm text-text-light/50 dark:text-text-dark/50 font-medium">
        <div class="flex items-center gap-2">
          <span>© {{ new Date().getFullYear() }}</span>
          <span class="hidden md:inline">|</span>
          <a href="https://beian.miit.gov.cn/" target="_blank" class="hover:text-primary transition-colors whitespace-nowrap">
            冀ICP备17000836号-2
          </a>
        </div>
        
        <span class="hidden md:inline text-text-light/20 dark:text-text-dark/20">|</span>
        
        <div class="flex items-center gap-2">
          <img
            src="//cdn.smallyoung.cn/libs/image/beian.png"
            alt="冀公网安备"
            class="h-4 w-4 opacity-70"
          />
          <a
            href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=13018102000160"
            target="_blank"
            class="hover:text-primary transition-colors whitespace-nowrap"
          >
            冀公网安备 13018102000160号
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// 全局 Footer 组件 - 包含 ICP 和公网安备信息
</script>
