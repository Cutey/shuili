import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: 路由配置项
 *
 * hidden: true                   // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true               // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect           // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'             // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
    roles: ['admin','editor']    // 设置该路由进入的权限，支持多个权限叠加
    title: 'title'               // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'             // 设置该路由的图标，对应路径src/icons/svg
    breadcrumb: false            // 如果设置为false，则不会在breadcrumb面包屑中显示
  }
 */
// 公共路由
export const constantRoutes = [{
        path: '/',
        component: Layout,
        redirect: 'generalmessage',
        children: [
            {
            path: 'numberlook',
            component: (resolve) => require(['@/views/numberlook/index'], resolve),
            name: '数字看板',
            meta: { title: '数字看板', icon: 'dashboard', noCache: true, affix: true }
            },
            {
            path: 'generalmessage',
            component: (resolve) => require(['@/views/generalmessage/index'], resolve),
            name: '综合信息',
            meta: { title: '综合信息', icon: 'dashboard', noCache: true, affix: true }
            },
            {
            path: 'themeresults',
            component: (resolve) => require(['@/views/themeresults/index'], resolve),
            name: '主题成果',
            meta: { title: '主题成果', icon: 'dashboard', noCache: true, affix: true }
            },
            {
            path: 'projectapplication',
            component: (resolve) => require(['@/views/projectapplication/index'], resolve),
            name: '专题应用',
            meta: { title: '专题应用', icon: 'dashboard', noCache: true, affix: true }
            },
            {
            path: 'industryshared',
            component: (resolve) => require(['@/views/industryshared/index'], resolve),
            name: '专题应用',
            meta: { title: '专题应用', icon: 'dashboard', noCache: true, affix: true }
            }
          
        ],
        meta:{
            affix: true   
        }
    },
    {
        path: '/login',
        component: (resolve) => require(['@/views/login'], resolve),
        hidden: true
    },
    {
        path: '/mapserverlist',
        name:'mapserverlist',
        component: (resolve) => require(['@/serverlayout/index'], resolve),
        hidden: true,
        // redirect: 'severlist',
        children: [
            {
                path: '/servermap/:id',
                component: (resolve) => require(['@/views/servermap/index'], resolve),
                name: 'servermap',
                meta: { title: '服务展示', icon: 'dashboard', noCache: true, affix: false }
            },
            {
                path: '/severlist',
                component: (resolve) => require(['@/views/severlist/index'], resolve),
                name: 'severlist',
                meta: { title: '服务展示', icon: 'dashboard', noCache: true, affix: false }
            }
        ]
    },

]

export default new Router({
    //mode: 'history', // 去掉url中的#
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
})