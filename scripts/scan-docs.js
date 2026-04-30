import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import fg from 'fast-glob'

/**
 * 读取 .docsignore 文件并返回忽略模式列表
 */
function readDocsIgnore(baseDir) {
  const ignoreFile = path.join(baseDir, '../.docsignore')
  const defaultPatterns = [
    '**/node_modules/**',
    '**/dist/**',
    '**/.git/**',
    '**/.buildcache/**',
    '**/.vitepress/**',
    '**/.slidev/**'
  ]
  const patterns = []

  if (fs.existsSync(ignoreFile)) {
    try {
      const content = fs.readFileSync(ignoreFile, 'utf-8')
      for (const line of content.split('\n')) {
        const trimmed = line.trim()
        if (trimmed && !trimmed.startsWith('#')) {
          patterns.push(trimmed.endsWith('/') ? `${trimmed}**` : trimmed)
        }
      }
    } catch (error) {
      console.warn(`[警告] 读取 .docsignore 失败: ${error.message}`)
    }
  }

  return [...new Set([...defaultPatterns, ...patterns])]
}

/**
 * 解析 Markdown 文件的 frontmatter
 */
function parseFrontmatter(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const { data, content: markdownContent } = matter(content)

    if (!data.title || !data.category || !data.tags || !data.description) {
      return null
    }

    const tags = Array.isArray(data.tags) ? data.tags : [data.tags]
    const categories = Array.isArray(data.category) ? data.category : [data.category]

    return {
      title: data.title,
      categories,
      tags,
      description: data.description,
      author: data.author || '未知作者',
      date: data.date || new Date().toISOString().split('T')[0],
      cover: data.cover,
      content: markdownContent,
      ...data
    }
  } catch (error) {
    console.error(`[错误] 解析文档元数据失败: ${filePath}`, error.message)
    return null
  }
}

/**
 * 生成文档唯一 ID
 */
function generateDocId(filePath, baseDir) {
  const relativePath = path.relative(baseDir, filePath)
  const normalizedPath = relativePath.replace(/\\/g, '/')
  const parts = normalizedPath.split('/')
  const fileName = parts[parts.length - 1].replace(/\.md$/, '')
  
  // 统一替换逻辑：将非中文、非字母数字字符替换为单个连字符
  const sanitized = fileName
    .replace(/[^\u4e00-\u9fa5a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  
  parts[parts.length - 1] = sanitized
  return parts.join('-')
}

/**
 * 生成文档 URL
 */
function generateDocUrl(filePath, baseDir) {
  const relativePath = path.relative(baseDir, filePath)
  const normalizedPath = relativePath.replace(/\\/g, '/')
  const urlPath = normalizedPath.replace(/\.md$/, '')
  return `/docs/${urlPath}`
}

/**
 * 提取文档目录（TOC）
 */
function extractToc(content) {
  // 1. 剥离代码块干扰 (```...```)
  const cleanContent = content.replace(/```[\s\S]*?```/g, '')
  
  const toc = []
  const headingRegex = /^(#{1,6})\s+(.+)$/gm
  let match

  while ((match = headingRegex.exec(cleanContent)) !== null) {
    const level = match[1].length
    if (level === 1) continue // 过滤文章大标题

    const text = match[2].trim()
    const slug = text
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
      .replace(/^-+|-+$/g, '')
    
    toc.push({ level, text, slug })
  }

  return toc
}

/**
 * 扫描文档目录
 */
export async function scanDocs(options = {}) {
  const { baseDir = 'docs', exclude = [] } = options
  const absoluteBaseDir = path.resolve(process.cwd(), baseDir)

  console.log(`[信息] 开始扫描文档目录: ${absoluteBaseDir}`)

  if (!fs.existsSync(absoluteBaseDir)) {
    console.warn(`[警告] 文档目录不存在: ${absoluteBaseDir}`)
    return []
  }

  const ignorePatterns = readDocsIgnore(absoluteBaseDir)
  const allIgnorePatterns = [...ignorePatterns, ...exclude]

  try {
    const mdFiles = await fg(['**/*.md'], {
      cwd: absoluteBaseDir,
      ignore: allIgnorePatterns,
      absolute: true,
      onlyFiles: true,
      caseSensitiveMatch: false
    })

    console.log(`[信息] 找到 ${mdFiles.length} 个 Markdown 文件`)

    const docs = []

    for (const filePath of mdFiles) {
      const meta = parseFrontmatter(filePath)
      if (!meta) continue

      const id = generateDocId(filePath, absoluteBaseDir)
      const docUrl = generateDocUrl(filePath, absoluteBaseDir)
      const toc = extractToc(meta.content)

      docs.push({
        id,
        title: meta.title,
        categories: meta.categories,
        tags: meta.tags,
        description: meta.description,
        author: meta.author,
        date: meta.date,
        cover: meta.cover,
        path: path.relative(process.cwd(), filePath).replace(/\\/g, '/'),
        docUrl,
        toc,
        meta
      })

      console.log(`  ✓ ${meta.title} (${meta.categories.join(', ')})`)
    }

    console.log(`\n[完成] 有效文档: ${docs.length} 篇`)
    return docs
  } catch (error) {
    console.error(`[错误] 扫描过程中发生错误:`, error)
    return []
  }
}

export default { scanDocs }
