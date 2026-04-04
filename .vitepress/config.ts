import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

// VitePress 配置 - SmallYoung 技术博客
export default withMermaid(defineConfig({
  // 站点基础信息
  title: 'SmallYoung',
  description: 'SmallYoung 技术博客 - AI、大模型、软件架构等前沿技术深度解析',
  lang: 'zh-CN',

  // 基础路径配置
  base: '/',

  // Sitemap 自动生成配置
  sitemap: {
    hostname: 'https://www.smallyoung.cn',
    transformItems: (items) => {
      return items.filter(item => !item.url.includes('404'))
    }
  },

  // 输出目录
  outDir: '../dist/blog',

  // 缓存目录
  cacheDir: '.vitepress/cache',

  // Head 配置
  head: [
    // ========== 国内搜索引擎优化 ==========
    ['meta', { name: 'applicable-device', content: 'pc,mobile' }],
    ['meta', { name: 'mobile-agent', content: 'format=html5;url=https://www.smallyoung.cn' }],

    // ========== 国内社交平台优化 ==========
    ['meta', { name: 'weibo:article:create_at', content: new Date().toISOString() }],

    // ========== 通用 SEO 元数据 ==========
    ['meta', { name: 'author', content: 'SmallYoung' }],
    ['meta', { name: 'copyright', content: 'SmallYoung' }],
    ['meta', { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' }],
    ['meta', { name: 'rating', content: 'general' }],
    ['meta', { name: 'geo.region', content: 'CN' }],
    ['meta', { name: 'geo.placename', content: 'China' }],

    // ========== Favicon ==========
    ['link', { rel: 'icon', type: 'image/png', href: '/favicon.png' }],
    ['link', { rel: 'apple-touch-icon', href: '/favicon.png' }],

    // ========== 外部资源 ==========
    // Tailwind CSS CDN
    ['script', { src: 'https://cdn.tailwindcss.com?plugins=forms,container-queries' }],
    // Google Fonts - Preconnect
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    // Google Fonts - Inter
    ['link', {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap'
    }],
    // Material Symbols Outlined
    ['link', {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined'
    }],
    // Tailwind 配置
    ['script', {}, `
      (function initTailwind() {
        if (typeof tailwind !== 'undefined') {
          tailwind.config = {
            darkMode: "class",
            theme: {
              extend: {
                colors: {
                  "primary": "#137fec",
                  "background-light": "#f6f7f8",
                  "background-dark": "#101922",
                  "text-light": "#0d141b",
                  "text-dark": "#e0e0e0",
                  "card-light": "#ffffff",
                  "card-dark": "#1a2530",
                  "border-light": "#e7edf3",
                  "border-dark": "#2c3a47",
                },
                fontFamily: {
                  "display": ["Inter", "sans-serif"]
                },
                borderRadius: {
                  "DEFAULT": "0.25rem",
                  "lg": "0.5rem",
                  "xl": "0.75rem",
                  "full": "9999px"
                },
              },
            },
          }
        } else {
          setTimeout(initTailwind, 10)
        }
      })()
    `]
  ],

  // 主题配置
  themeConfig: {
    // 导航栏
    nav: [
      { text: '首页', link: '/' },
      { text: '技术文档', link: '/docs' },
      { text: '应用', link: '/apps' },
    ],

    // 侧边栏 - 由 scripts/generate-sidebar.js 自动生成
    sidebar: (() => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { docsSidebar } = require('./sidebar.generated')
        return { '/docs/': docsSidebar }
      } catch {
        // Fallback: 如果 generate-sidebar.js 尚未执行，提供基础导航
        return {
          '/docs/': [
            { text: '正在加载文档...', link: '/docs' }
          ]
        }
      }
    })(),

    // 社交链接
    socialLinks: [],

    // 页脚
    footer: {
      message: 'SmallYoung 技术博客',
      copyright: 'Copyright © 2024 SmallYoung'
    },

    // 搜索
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文章',
            buttonAriaLabel: '搜索文章'
          },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭'
            }
          }
        }
      }
    },

    // 文档页脚
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    // 大纲配置
    outline: {
      label: '页面导航',
      level: [2, 4]
    },

    // 最后更新时间
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'short'
      }
    },

    // 返回顶部
    returnToTopLabel: '返回顶部',

    // 外部链接图标
    externalLinkIcon: true,

    // 深色模式切换
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',

    // 侧边栏菜单标签
    sidebarMenuLabel: '菜单',
  },

  // Markdown 配置
  markdown: {
    lineNumbers: true,
    math: true,
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    },
    config: (md) => {
      const defaultImageRender = md.renderer.rules.image || ((tokens: any, idx: any, options: any, env: any, self: any) => self.renderToken(tokens, idx, options))

      md.renderer.rules.image = (tokens: any, idx: any, options: any, env: any, self: any) => {
        const token = tokens[idx]

        // 为 pub.smallyoung.cn 图片添加 CDN 前缀
        const srcIndex = token.attrIndex('src')
        if (srcIndex >= 0) {
          const src = token.attrs![srcIndex][1]
          if (src.includes('pub.smallyoung.cn') && !src.includes('/cdn-cgi/image/')) {
            const newSrc = src.replace(
              /\/\/pub\.smallyoung\.cn\//,
              '//pub.smallyoung.cn/cdn-cgi/image/quality=80/'
            )
            token.attrSet('src', newSrc)
          }
        }

        // 添加懒加载
        token.attrSet('loading', 'lazy')
        return defaultImageRender(tokens, idx, options, env, self)
      }

      // Mermaid 换行支持
      const defaultFence = md.renderer.rules.fence
      md.renderer.rules.fence = (tokens: any, idx: any, options: any, env: any, self: any) => {
        const token = tokens[idx]
        if (token.info.trim() === 'mermaid') {
          token.content = token.content.replace(/\\n/g, '<br/>')
        }
        return defaultFence!(tokens, idx, options, env, self)
      }
    }
  },

  // 最后更新时间
  lastUpdated: true,

  // 清理 URL
  cleanUrls: true,

  // Mermaid 配置
  mermaid: {
    theme: 'base',
    themeVariables: {
      primaryColor: '#137fec',
      edgeLabelBackground: 'transparent',
      tertiaryColor: '#f6f7f8'
    },
    flowchart: {
      htmlLabels: true,
      useMaxWidth: true,
      curve: 'linear',
      padding: 20,
      nodeSpacing: 50,
      rankSpacing: 50
    },
    securityLevel: 'loose'
  },
  mermaidPlugin: {
    class: 'mermaid-diagram'
  },

  // 构建时为每个页面生成 SEO 元数据
  transformHead({ pageData }) {
    const head: Array<[string, Record<string, string>]> = []
    const siteUrl = 'https://www.smallyoung.cn'
    const siteName = 'SmallYoung'
    const fm = pageData.frontmatter

    // 生成页面 URL
    const pageUrl = `${siteUrl}/${pageData.relativePath.replace(/\.md$/, '').replace(/index$/, '')}`

    // 处理封面图片 URL
    const getAbsoluteImageUrl = (cover: string | undefined): string => {
      if (!cover) return `${siteUrl}/favicon.png`
      if (cover.startsWith('//')) return `https:${cover}`
      if (cover.startsWith('http')) return cover
      return `${siteUrl}${cover}`
    }

    const imageUrl = getAbsoluteImageUrl(fm.cover)
    const description = fm.description || 'SmallYoung 技术博客 - AI、大模型、软件架构等前沿技术深度解析'
    const title = fm.title || siteName

    // ========== Canonical URL ==========
    head.push(['link', { rel: 'canonical', href: pageUrl }])

    // ========== 基础 Meta 标签 ==========
    if (fm.description) {
      head.push(['meta', { name: 'description', content: fm.description }])
    }
    if (fm.keywords) {
      head.push(['meta', { name: 'keywords', content: fm.keywords.join(', ') }])
    } else if (fm.tags) {
      head.push(['meta', { name: 'keywords', content: fm.tags.join(', ') }])
    }

    // ========== Open Graph ==========
    head.push(['meta', { property: 'og:type', content: 'article' }])
    head.push(['meta', { property: 'og:title', content: title }])
    head.push(['meta', { property: 'og:description', content: description }])
    head.push(['meta', { property: 'og:url', content: pageUrl }])
    head.push(['meta', { property: 'og:site_name', content: siteName }])
    head.push(['meta', { property: 'og:image', content: imageUrl }])
    head.push(['meta', { property: 'og:image:width', content: '1200' }])
    head.push(['meta', { property: 'og:image:height', content: '630' }])
    head.push(['meta', { property: 'og:image:alt', content: title }])
    head.push(['meta', { property: 'og:locale', content: 'zh_CN' }])
    if (fm.date) {
      head.push(['meta', { property: 'article:published_time', content: fm.date }])
    }

    // ========== Twitter Card ==========
    head.push(['meta', { name: 'twitter:card', content: 'summary_large_image' }])
    head.push(['meta', { name: 'twitter:title', content: title }])
    head.push(['meta', { name: 'twitter:description', content: description }])
    head.push(['meta', { name: 'twitter:image', content: imageUrl }])

    // ========== 微信/头条专用 ==========
    head.push(['meta', { itemprop: 'name', content: title }])
    head.push(['meta', { itemprop: 'description', content: description }])
    head.push(['meta', { itemprop: 'image', content: imageUrl }])

    // ========== WebSite Schema（仅首页）==========
    if (pageData.relativePath === 'index.md') {
      const websiteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: siteName,
        url: siteUrl,
        description: 'SmallYoung 技术博客 - AI大模型、软件架构前沿技术深度解析',
        inLanguage: 'zh-CN',
        publisher: {
          '@type': 'Organization',
          name: siteName,
          logo: { '@type': 'ImageObject', url: `${siteUrl}/favicon.png` }
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: { '@type': 'EntryPoint', urlTemplate: `${siteUrl}/?q={search_term_string}` },
          'query-input': 'required name=search_term_string'
        }
      }
      head.push(['script', { type: 'application/ld+json' }, JSON.stringify(websiteSchema)] as any)
    }

    if (!fm.title) return head

    // ========== 面包屑 Schema ==========
    const pathParts = pageData.relativePath.replace(/\.md$/, '').split('/')
    if (pathParts.length > 1) {
      const breadcrumbItems = [{ '@type': 'ListItem', position: 1, name: '首页', item: siteUrl }]
      let currentPath = ''
      pathParts.forEach((part: string, index: number) => {
        if (index === pathParts.length - 1 && part === 'index') return
        currentPath += `/${part}`
        const itemName = index === 0
          ? (part === 'docs' ? '技术文档' : part === 'apps' ? '应用' : part)
          : (fm.title || part)
        breadcrumbItems.push({ '@type': 'ListItem', position: index + 2, name: itemName, item: `${siteUrl}${currentPath}` })
      })
      const breadcrumbSchema = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: breadcrumbItems }
      head.push(['script', { type: 'application/ld+json' }, JSON.stringify(breadcrumbSchema)] as any)
    }

    // 跳过特殊布局页面
    const skipLayouts = ['home', 'docs', 'apps']
    if (fm.layout && skipLayouts.includes(fm.layout)) return head

    // ========== Article Schema ==========
    const articleSchema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: fm.title,
      description: fm.description || '',
      image: imageUrl,
      datePublished: fm.date,
      dateModified: fm.dateModified || fm.date,
      author: { '@type': 'Person', name: fm.author || 'SmallYoung' },
      publisher: {
        '@type': 'Organization',
        name: siteName,
        logo: { '@type': 'ImageObject', url: `${siteUrl}/favicon.png` }
      },
      mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
      keywords: fm.keywords?.join(', ') || fm.tags?.join(', ') || undefined
    }
    head.push(['script', { type: 'application/ld+json' }, JSON.stringify(articleSchema)] as any)

    return head
  }
}))
