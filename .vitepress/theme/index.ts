import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

// 导入自定义布局
import Layout from './Layout.vue'

// 文档相关组件
import HomePage from './components/HomePage.vue'
import CustomHeader from './components/CustomHeader.vue'
import DocsPage from './components/DocsPage.vue'
import DocCard from './components/DocCard.vue'
import DocCategoryNav from './components/DocCategoryNav.vue'
import DocDetailPage from './components/DocDetailPage.vue'
import AppsPage from './components/AppsPage.vue'
import ProductsPage from './components/ProductsPage.vue'

// 媒体组件
import AudioPlayer from './components/AudioPlayer.vue'
import VideoPlayer from './components/VideoPlayer.vue'
import ImageViewer from './components/ImageViewer.vue'

// 交互组件
import MindMapFloat from './components/MindMapFloat.vue'

import DocSidebar from './components/DocSidebar.vue'

export default {
  extends: DefaultTheme,
  Layout,

  enhanceApp({ app }) {
    // 注册首页组件
    app.component('HomePage', HomePage)
    app.component('CustomHeader', CustomHeader)
    app.component('DocSidebar', DocSidebar)

    // 注册文档组件
    app.component('DocsPage', DocsPage)
    app.component('DocCard', DocCard)
    app.component('DocCategoryNav', DocCategoryNav)
    app.component('DocDetailPage', DocDetailPage)

    // 注册应用组件
    app.component('AppsPage', AppsPage)
    app.component('ProductsPage', ProductsPage)

    // 注册媒体组件
    app.component('AudioPlayer', AudioPlayer)
    app.component('VideoPlayer', VideoPlayer)
    app.component('ImageViewer', ImageViewer)

    // 注册交互组件
    app.component('MindMapFloat', MindMapFloat)
  }
} satisfies Theme
