<template>
  <div class="flex flex-wrap items-center gap-2 mt-4">
    <!-- 全部分类 -->
    <button
      @click="$emit('category-change', null)"
      :class="['px-3 py-1.5 text-sm font-medium rounded-full transition-all', selectedCategory === null ? 'bg-primary text-white shadow-md' : 'bg-card-light dark:bg-card-dark hover:bg-primary/10 dark:hover:bg-primary/20']"
    >
      全部 ({{ totalDocs }})
    </button>

    <!-- 各分类按钮 -->
    <button
      v-for="category in categories"
      :key="category.name"
      @click="$emit('category-change', category.name)"
      :class="['px-3 py-1.5 text-sm font-medium rounded-full transition-all', selectedCategory === category.name ? 'bg-primary text-white shadow-md' : 'bg-card-light dark:bg-card-dark hover:bg-primary/10 dark:hover:bg-primary/20']"
    >
      {{ category.name }} ({{ category.count }})
    </button>
  </div>
</template>

<script setup lang="ts">
import type { CategoryInfo } from '../../data/docs.data'

defineProps<{
  categories: CategoryInfo[]
  totalDocs: number
  selectedCategory: string | null
}>()

defineEmits<{
  (e: 'category-change', category: string | null): void
}>()
</script>
