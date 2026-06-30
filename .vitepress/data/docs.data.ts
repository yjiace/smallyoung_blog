import path from 'path'
import { scanDocs } from '../../scripts/scan-docs.js'

// TOC 项类型
export interface TocItem {
    level: number
    text: string
    slug: string
}

// 文档类型定义
export interface Doc {
    id: string
    title: string
    categories: string[]
    tags: string[]
    description: string
    author: string
    date: string
    cover?: string
    path: string
    docUrl: string
    toc: TocItem[]
    meta: Record<string, unknown>
}

// 分类信息类型
export interface CategoryInfo {
    name: string
    count: number
}

// 文档索引类型
export interface DocIndex {
    version: string
    generated: string
    docs: Doc[]
    categories: CategoryInfo[]
    tags: string[]
    stats: {
        totalDocs: number
        totalCategories: number
        totalTags: number
    }
}

// 生成文档索引
function generateDocsIndex(docs: Doc[]): DocIndex {
    // 按日期倒序排列（最新的在前面）
    const sortedDocs = [...docs].sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0
        const dateB = b.date ? new Date(b.date).getTime() : 0
        return dateB - dateA
    })

    // 统计每个分类的文档数量
    const categoryMap = new Map<string, number>()
    sortedDocs.forEach(d => {
        const categories = d.categories || []
        categories.forEach(cat => {
            categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1)
        })
    })
    const priorityCategories = ['人工智能', '后端开发']
    const getPriority = (name: string) => {
        const index = priorityCategories.indexOf(name)
        return index !== -1 ? index : Infinity
    }

    const categories: CategoryInfo[] = Array.from(categoryMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => {
            const priorityA = getPriority(a.name)
            const priorityB = getPriority(b.name)

            if (priorityA !== priorityB) {
                return priorityA - priorityB
            }

            return b.name.localeCompare(a.name, 'zh-CN')
        })

    const tags = [...new Set(sortedDocs.flatMap(d => d.tags))]

    return {
        version: '1.0.0',
        generated: new Date().toISOString(),
        docs: sortedDocs,
        categories,
        tags,
        stats: {
            totalDocs: sortedDocs.length,
            totalCategories: categories.length,
            totalTags: tags.length
        }
    }
}

// VitePress Data Loader
export default {
    // 监听 docs/ 目录下 .md 文件的变化
    watch: ['../docs/**/*.md'],

    async load(): Promise<DocIndex> {
        try {
            // docs/ 在 smallyoung_blog/docs/，即 process.cwd() + /docs
            const docsDir = path.resolve(process.cwd(), 'docs')
            const docs = await scanDocs({
                baseDir: docsDir,
                exclude: ['node_modules', 'dist', '.git', '.buildcache']
            })

            const index = generateDocsIndex(docs)
            return index
        } catch (error) {
            console.error('加载文档数据失败:', error)
            return {
                version: '1.0.0',
                generated: new Date().toISOString(),
                docs: [],
                categories: [],
                tags: [],
                stats: { totalDocs: 0, totalCategories: 0, totalTags: 0 }
            }
        }
    }
}
