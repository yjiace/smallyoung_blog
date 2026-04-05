<template>
  <div class="flex flex-col bg-background-light dark:bg-background-dark font-display text-text-light dark:text-text-dark">
    <div class="flex flex-1">
      <main class="w-full flex-1 p-6 lg:p-8">
        <div class="mx-auto max-w-7xl">
          <div class="mb-6">
            <h1 class="text-4xl font-black leading-tight tracking-tighter">技术文档</h1>
            <p class="mt-2 text-text-light/60 dark:text-text-dark/60">深入学习各类技术知识</p>
            <!-- 分类导航 -->
            <DocCategoryNav
              v-if="docsData && docsData.docs && docsData.docs.length > 0"
              :categories="docsData.categories"
              :total-docs="docsData.stats.totalDocs"
              :selected-category="selectedCategory"
              @category-change="onCategoryChange"
            />
          </div>

          <div v-if="docsData && docsData.docs && docsData.docs.length > 0">
            <!-- 文档列表 -->
            <div v-if="filteredDocs.length > 0">
              <div class="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
                <DocCard
                  v-for="doc in paginatedDocs"
                  :key="doc.id"
                  :doc="doc"
                />
              </div>

              <!-- 分页 -->
              <div v-if="totalPages > 1" class="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
                <div class="flex items-center gap-1.5">
                  <button @click="currentPage = 1" :disabled="currentPage === 1"
                    class="hidden sm:flex px-2.5 py-1.5 rounded-lg border border-border-light dark:border-border-dark hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    title="首页">
                    <span class="material-symbols-outlined text-[18px]">first_page</span>
                  </button>
                  <button @click="currentPage--" :disabled="currentPage === 1"
                    class="px-2.5 py-1.5 rounded-lg border border-border-light dark:border-border-dark hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    title="上一页">
                    <span class="material-symbols-outlined text-[18px]">chevron_left</span>
                  </button>

                  <div class="flex items-center gap-1 mx-1">
                    <template v-for="page in displayedPages" :key="page">
                      <button v-if="page !== '...'" @click="currentPage = page as number"
                        :class="[
                          'min-w-[36px] h-[36px] flex items-center justify-center rounded-lg border transition-all text-sm font-medium',
                          currentPage === page 
                            ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' 
                            : 'border-border-light dark:border-border-dark hover:bg-gray-100 dark:hover:bg-gray-800'
                        ]">
                        {{ page }}
                      </button>
                      <span v-else class="px-1 text-text-light/40 dark:text-text-dark/40">...</span>
                    </template>
                  </div>

                  <button @click="currentPage++" :disabled="currentPage === totalPages"
                    class="px-2.5 py-1.5 rounded-lg border border-border-light dark:border-border-dark hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    title="下一页">
                    <span class="material-symbols-outlined text-[18px]">chevron_right</span>
                  </button>
                  <button @click="currentPage = totalPages" :disabled="currentPage === totalPages"
                    class="hidden sm:flex px-2.5 py-1.5 rounded-lg border border-border-light dark:border-border-dark hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    title="末页">
                    <span class="material-symbols-outlined text-[18px]">last_page</span>
                  </button>
                </div>

                <div class="text-[13px] font-medium text-text-light/50 dark:text-text-dark/50 bg-gray-100/50 dark:bg-gray-800/30 px-3 py-1 rounded-full border border-border-light/50 dark:border-border-dark/30">
                  共 {{ filteredDocs.length }} 篇文档
                </div>
              </div>
            </div>

            <!-- 无结果提示 -->
            <div v-else class="text-center py-16">
              <div class="text-6xl mb-4">😕</div>
              <p class="text-xl font-semibold mb-2">没有找到匹配的文档</p>
              <p class="text-text-light/60 dark:text-text-dark/60">试试调整筛选条件或搜索关键词</p>
            </div>
          </div>

          <!-- 空状态 -->
          <div v-else class="flex flex-col items-center justify-center py-20">
            <div class="text-8xl mb-6 opacity-50">📄</div>
            <p class="text-2xl font-semibold text-text-light/70 dark:text-text-dark/70 mb-2">暂无文档</p>
            <p class="text-text-light/50 dark:text-text-dark/50">文档正在撰写中，敬请期待</p>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { data as docsData } from '../../data/docs.data'
import CustomHeader from './CustomHeader.vue'
import DocCard from './DocCard.vue'
import DocCategoryNav from './DocCategoryNav.vue'

const selectedCategory = ref<string | null>(null)
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = 12

const filteredDocs = computed(() => {
  let docs = docsData.docs || []
  if (selectedCategory.value) {
    docs = docs.filter(d => d.category === selectedCategory.value)
  }
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    docs = docs.filter(doc =>
      doc.title.toLowerCase().includes(query) ||
      doc.description.toLowerCase().includes(query) ||
      doc.category.toLowerCase().includes(query) ||
      doc.tags.some(tag => tag.toLowerCase().includes(query)) ||
      doc.author.toLowerCase().includes(query)
    )
  }
  return docs
})

const totalPages = computed(() => Math.ceil(filteredDocs.value.length / pageSize))

const paginatedDocs = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredDocs.value.slice(start, start + pageSize)
})

const displayedPages = computed(() => {
  const pages: (number | string)[] = []
  const total = totalPages.value
  const current = currentPage.value
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else if (current <= 4) {
    for (let i = 1; i <= 5; i++) pages.push(i)
    pages.push('...', total)
  } else if (current >= total - 3) {
    pages.push(1, '...')
    for (let i = total - 4; i <= total; i++) pages.push(i)
  } else {
    pages.push(1, '...')
    for (let i = current - 1; i <= current + 1; i++) pages.push(i)
    pages.push('...', total)
  }
  return pages
})

watch([selectedCategory, searchQuery], () => { currentPage.value = 1 })

function onCategoryChange(category: string | null) { selectedCategory.value = category }
function onSearch(query: string) { searchQuery.value = query }
</script>
