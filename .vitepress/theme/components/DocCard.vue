<template>
  <div class="doc-card-wrapper">
    <a
      :href="doc.docUrl"
      target="_blank"
      class="flex cursor-pointer flex-col gap-3 rounded-xl border border-solid border-transparent bg-card-light p-4 transition-all hover:-translate-y-1 hover:shadow-xl hover:border-primary/50 dark:bg-card-dark dark:hover:border-primary/50"
    >
      <!-- 封面图片 16:9 -->
      <div class="cover-image-wrapper relative w-full">
        <div class="cover-image-inner absolute inset-0 rounded-lg bg-cover"
          :style="getCoverStyle()">
        </div>
      </div>

      <div class="flex flex-1 flex-col">
        <p class="text-base font-semibold leading-normal">{{ doc.title }}</p>
        <p class="mt-1 flex-1 text-sm text-slate-600 dark:text-slate-300 line-clamp-2">{{ doc.description }}</p>
      </div>

      <div class="mt-2 flex flex-wrap gap-1">
        <span v-for="cat in doc.categories" :key="cat" :class="getCategoryClass(cat)">{{ cat }}</span>
        <span v-for="(tag, index) in doc.tags.slice(0, 3)" :key="tag" :class="getTagClass(index)">
          {{ tag }}
        </span>
      </div>

      <!-- 作者和日期 -->
      <div class="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span class="flex items-center gap-1">
          <span class="material-symbols-outlined text-sm">person</span>
          {{ doc.author }}
        </span>
        <span>{{ formatDate(doc.date) }}</span>
      </div>
    </a>
  </div>
</template>

<script setup lang="ts">
import type { Doc } from '../../data/docs.data'

const props = defineProps<{ doc: Doc }>()

const colorStyles = [
  { bg: 'bg-blue-100',   text: 'text-blue-800',   darkBg: 'dark:bg-blue-900',   darkText: 'dark:text-blue-200'   },
  { bg: 'bg-red-100',    text: 'text-red-800',    darkBg: 'dark:bg-red-900',    darkText: 'dark:text-red-200'    },
  { bg: 'bg-yellow-100', text: 'text-yellow-800', darkBg: 'dark:bg-yellow-900', darkText: 'dark:text-yellow-200' },
  { bg: 'bg-green-100',  text: 'text-green-800',  darkBg: 'dark:bg-green-900',  darkText: 'dark:text-green-200'  },
  { bg: 'bg-purple-100', text: 'text-purple-800', darkBg: 'dark:bg-purple-900', darkText: 'dark:text-purple-200' },
  { bg: 'bg-pink-100',   text: 'text-pink-800',   darkBg: 'dark:bg-pink-900',   darkText: 'dark:text-pink-200'   },
  { bg: 'bg-indigo-100', text: 'text-indigo-800', darkBg: 'dark:bg-indigo-900', darkText: 'dark:text-indigo-200' },
  { bg: 'bg-teal-100',   text: 'text-teal-800',   darkBg: 'dark:bg-teal-900',   darkText: 'dark:text-teal-200'   },
  { bg: 'bg-orange-100', text: 'text-orange-800', darkBg: 'dark:bg-orange-900', darkText: 'dark:text-orange-200' },
  { bg: 'bg-cyan-100',   text: 'text-cyan-800',   darkBg: 'dark:bg-cyan-900',   darkText: 'dark:text-cyan-200'   },
]

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash)
}

function getCategoryClass(category: string) {
  const color = colorStyles[hashString(category) % colorStyles.length]
  return `inline-block rounded px-2 py-0.5 text-xs font-medium ${color.bg} ${color.text} ${color.darkBg} ${color.darkText}`
}

function getTagClass(index: number) {
  const color = colorStyles[(index + 3) % colorStyles.length]
  return `inline-block rounded px-2 py-0.5 text-xs font-medium ${color.bg} ${color.text} ${color.darkBg} ${color.darkText}`
}

function getCoverStyle() {
  const defaultImages: Record<string, string> = {
    '前端开发': 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRSEXY--Hk7J2XlV4dBEpAfn3UCQekdd7xQnNeo1SR7BAjxEAfmxNCZjLrFm9usH_TVvDtKze4AqbOa2Q3-LFxAn6jvdWGuK5R8yRNiVJWev8Zxb1aUUTKQJ-uypQFJccGHKuOuIJnDkNLO24BAHBa_y2cy9qosL2TZMQBjSLqP5tRnY_gPc25WzhB3U7YXQWDOdHF5VBd4DqyQ0bQHysZHY2urj8Sie_2YuBaJEumg5yWzMdsebnYoDbSeIzCr2PMKJb5M7_f0HI',
    '后端开发': 'https://lh3.googleusercontent.com/aida-public/AB6AXuCuV5CHD57Gp-9tG4WyPkAqbzMojatT8xDnCH0CzK9-RvdCWvdRx9yYqaAsywJPCd8IrR4uw-maRQVxk84ARzW9Z-P5VJnG1PvuvYPoM9fHSc3s04KX60rzwUpc1RWxpCqd576F7ERUD7ca87MM040jGmabXZxaUhj1hNjNXUo8-yE6JCAI0IDlVHqT4yvha5ZV62kq9cAK8iHsc5l8iYtahOHouhdNxB59WqKC764rvABRd0rRna7G6HOuzVsD0MZcILyW4232T9E',
    '人工智能': 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4TnhrrWQ7z6SsV70vOVYk_5yS5jilZ2whlhXilx7Hy1ayM2q4kfpZo4EEMY3tqg8CtblKO11cFZzZn1jb665W-mbmZtq2Jjtd4xV5nD2xfrB3fb0yu91X0oJvpn42ylUiCsPaQKL-a6RJtm1E71TbjZThPsZUuXtjslfo6Pue-6KlMIwOlwqh0SEz8fKb7Y1SGQa2wM8TBXxlioQivFa_ZzJKVzysSE2SZ7wErGEfFnM_ZynLVbkPdSXBa6DSm5n6iMZBdbI8Q5c',
    '计算机基础': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEJaobfqb5gaGY-IQoPHdWPKbdn9bgaf5CCROx3s5yyieX9xXdqZ4FKmCHxRavtW6n6ls03RQyVQ9B-4KlYilRzLHGJ8l66c4r8aJq_jOzN2PDsX804ElcCKYsEu40X2t-A1E0Uf-4kzC0AD90nvtYjYoc44rkvTJgp8GroC9DgCe6K0MHakJMRo2UorJWEc2RqCXRRORGevMVtgc0QXyg0BWjvv6dia31dPTUm9TPEidpFiN1xxjcL3_mMdckcDbvImGNMaFWgEw',
  }
  const firstCategory = props.doc.categories && props.doc.categories.length > 0 ? props.doc.categories[0] : ''
  const imageUrl = props.doc.cover || defaultImages[firstCategory] || defaultImages['计算机基础']
  return { backgroundImage: `url("${imageUrl}")`, backgroundColor: '#e5e7eb' }
}

function formatDate(dateStr: string) {
  try { return new Date(dateStr).toLocaleDateString('zh-CN') } catch { return dateStr }
}
</script>

<style scoped>
.cover-image-wrapper {
  position: relative !important;
  width: 100% !important;
  padding-bottom: 56.25% !important;
  overflow: hidden !important;
  border-radius: 0.5rem;
}
.cover-image-inner {
  position: absolute !important;
  inset: 0 !important;
  width: 100% !important;
  height: 100% !important;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
