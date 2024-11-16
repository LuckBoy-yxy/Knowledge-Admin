import Main from '@/components/main/index'

export default [
  {
    path: '/content',
    name: 'article_management',
    meta: {
      // icon: 'logo-buffer',
      icon: 'md-albums',
      title: '文章管理'
    },
    component: Main,
    children: [
      {
        path: 'index',
        name: 'content_management',
        meta: {
          // icon: 'md-grid',
          icon: 'ios-paper',
          title: '内容管理'
        },
        component: () => import('@/view/content/index.vue')
      },
      {
        path: 'tags',
        name: 'tags_management',
        meta: {
          // icon: 'md-grid',
          icon: 'md-pricetags',
          title: '标签管理'
        },
        // component: () => import('@/view/components/tables/tables.vue')
        component: () => import('@/view/content/tags.vue')
      }
    ]
  },
  {
    path: '/user',
    name: 'user',
    meta: {
      icon: 'md-people',
      title: '用户管理'
    },
    component: Main,
    children: [
      {
        path: 'index',
        name: 'user_management',
        meta: {
          icon: 'ios-people',
          title: '用户管理'
        },
        component: () => import('@/view/user/index.vue')
      }
    ]
  },
  {
    path: '/menu',
    name: 'menu',
    meta: {
      icon: 'md-settings',
      title: '菜单管理'
    },
    component: Main,
    children: [
      {
        path: 'index',
        name: 'menu_management',
        meta: {
          icon: 'ios-menu',
          title: '菜单管理'
        },
        component: () => import('@/view/menu/index.vue')
      }
    ]
  },
  {
    path: '/roles',
    name: 'roles',
    meta: {
      icon: 'md-checkbox',
      title: '权限管理'
    },
    component: Main,
    children: [
      {
        path: 'index',
        name: 'roles_management',
        meta: {
          icon: 'md-key',
          title: '角色权限'
        },
        component: () => import('@/view/roles/index.vue')
      }
    ]
  }
]
