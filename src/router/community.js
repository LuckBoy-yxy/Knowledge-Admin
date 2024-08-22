import Main from '@/components/main/index'

export default [
  {
    path: '/content',
    name: 'article_management',
    meta: {
      icon: 'logo-buffer',
      title: '文章管理'
    },
    component: Main,
    children: [
      {
        path: 'index',
        name: 'content_management',
        meta: {
          icon: 'md-grid',
          title: '内容管理'
        },
        component: () => import('@/view/content/index.vue')
      },
      {
        path: 'tags',
        name: 'tags_management',
        meta: {
          icon: 'md-grid',
          title: '标签管理'
        },
        component: () => import('@/view/components/tables/tables.vue')
      }
    ]
  }
]
