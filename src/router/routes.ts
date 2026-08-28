//路由配置
export const baseRoute = [
    {
        path: '/logReg',
        name: 'logReg',
        component: () => import('@/views/LogReg.vue')
    }, {
        path: '/articleDetail',
        name: 'articleDetail',
        component: () => import('@/views/ArticleDetail.vue')
    },
    {
        path: '/comment',
        name: 'comment',
        component: () => import('@/views/Comment.vue')
    },
    {
        path: '/otherUserHome',
        name: 'otherUserHome',
        component: () => import('@/views/OtherUserHome.vue')
    },
    {
        path: '/about',
        name: 'about',
        component: () => import('@/views/About.vue')
    }
]

export  const backRoute = [
    {
        path: '/back',
        name: 'backLayout',
        component: () => import('@/views/BackLayout.vue'),
        redirect: '/back/home',
        children: [
            {
                //统计页面
                path: '/back/home',
                name: 'backHome',
                component: () => import('@/views/BackHome.vue')
            },
            {
                //管理员文章
                path: '/back/myArticle',
                name: 'backMyArticle',
                component: () => import('@/views/BackMyArticle.vue')
            },
            {
                //文章管理
                path: '/back/articleManager',
                name: 'backArticleManager',
                component: () => import('@/views/BackArticleManager.vue')
            }
        ]
    }
]
export  const frontRoute = [
    {
        path: '/',
        name: 'home',
        component: () => import('@/views/Home.vue')
    },
    {
        path: '/profile',
        name: 'profile',
        component: () => import('@/views/Profile.vue'),
        redirect: '/profile/info',
        children: [
            {
                path: '/profile/info',
                name: 'profileInfo',
                component: () => import('@/views/ProfileInfo.vue')
            },{
                path: '/profile/article',
                name: 'profileArticle',
                component: () => import('@/views/ProfileArticle.vue')
            }
        ]
    },{
        path: '/articleSquare',
        name: 'articleSquare',
        component: () => import('@/views/ArticleSquare.vue')
    },{
        path: '/aiConversation',
        name: 'aiConversation',
        component: () => import('@/views/AIConversation.vue')
    }
]