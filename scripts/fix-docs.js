import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import fg from 'fast-glob'

async function fixDocs() {
  console.log('📝 正在修复文档 layout 设置...')
  const docsDir = path.resolve(process.cwd(), 'docs')
  const files = await fg(['**/*.md'], { cwd: docsDir, absolute: true })

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8')
    const { data, content: markdownContent } = matter(content)
    
    let changed = false
    if (!data.layout) {
      data.layout = 'doc-detail'
      changed = true
    } else if (data.layout === 'doc') {
      data.layout = 'doc-detail'
      changed = true
    }

    if (changed) {
      const newContent = matter.stringify(markdownContent, data)
      fs.writeFileSync(file, newContent, 'utf-8')
      console.log(`  ✓ 已更新: ${path.basename(file)}`)
    }
  }
  console.log('✅ 文档修复完成')
}

fixDocs().catch(console.error)
