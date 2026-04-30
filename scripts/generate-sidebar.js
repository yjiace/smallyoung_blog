import fs from 'fs'
import path from 'path'
import { scanDocs } from './scan-docs.js'

async function generateSidebar() {
  console.log('📦 正在生成侧边栏配置...')
  
  const docsDir = path.resolve(process.cwd(), 'docs')
  const docs = await scanDocs({
    baseDir: docsDir,
    exclude: ['node_modules', 'dist', '.git', '.buildcache']
  })

  // 按分类分组
  const categoryMap = new Map()
  for (const doc of docs) {
    const categories = doc.categories || []
    for (const category of categories) {
      if (!categoryMap.has(category)) {
        categoryMap.set(category, [])
      }
      categoryMap.get(category).push({
        text: doc.title,
        link: doc.docUrl,
        date: doc.date
      })
    }
  }

  // 构建侧边栏
  const sidebar = []
  const sortedCategories = Array.from(categoryMap.keys()).sort((a, b) => a.localeCompare(b, 'zh-CN'))

  for (const category of sortedCategories) {
    const items = categoryMap.get(category)
    // 按日期倒序
    items.sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0
      const dateB = b.date ? new Date(b.date).getTime() : 0
      return dateB - dateA
    })

    sidebar.push({
      text: category,
      collapsed: false,
      items: items.map(item => ({
        text: item.text,
        link: item.link
      }))
    })
  }

  const outputPath = path.resolve(process.cwd(), '.vitepress/sidebar.generated.js')
  // 确保目录存在
  const dir = path.dirname(outputPath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  const content = `// 自动生成的侧边栏配置，请勿手动编辑\n// 生成时间: ${new Date().toLocaleString()}\n\nexport const docsSidebar = ${JSON.stringify(sidebar, null, 2)}`
  
  fs.writeFileSync(outputPath, content, 'utf-8')
  console.log(`✅ 侧边栏配置生成成功: ${outputPath}`)
}

generateSidebar().catch(console.error)
