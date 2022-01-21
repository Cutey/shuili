import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getTokensso, setTokensso, removeTokensso } from '@/utils/autjsso'
import { getToken, setToken, removeToken } from '@/utils/auth'

NProgress.configure({ showSpinner: false })

// 免登录白名单
const whiteList = ['/login', '/auth-redirect', '/bind', '/register']

let url = "http://10.1.98.120:19997/apicture/;casoauth=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NDI0MjM0NDgsImxvZ2luX3VzZXJfa2V5IjoiNjYyNjNhNjMtOGIxMS00ODNiLWFjMDItY2U2ZjlmMDJiOWU0In0.hOT_Sqa-d4PTwJ-F-zPg06KKYtwpzCm6io92XtT7V7c#/"
if (window.location.href.indexOf(';casoauth') > -1) {
    let path = window.location.href;
    let casoauth = path.split(';casoauth=');

    if (casoauth.length > 1 && !getToken()) {
        setToken(casoauth[1]);
    }
} else {
    if (getToken) {
        // return
    } else {
        store.dispatch('SSOFedLogOut').then(() => {
            // Message.error(err)
            // next({ path: '/' })
        })
    }
}
// console.log(url.indexOf(';casoauth') > -1, '单点登录严重')
router.beforeEach((to, from, next) => {
    NProgress.start();
    if (getToken()) {
        /* has token*/
        if (to.path === '/login') {
            window.open(process.env.VUE_APP_PATH_API, '_self')
            NProgress.done()
        } else {
            if (store.getters.roles.length === 0) {
                // 判断当前用户是否已拉取完user_info信息 
                store.dispatch('GetInfo').then(res => {
                        // 拉取user_info
                        const roles = res.roles
                        store.dispatch('GenerateRoutes', { roles }).then(accessRoutes => {
                            // 测试 默认静态页面
                            // store.dispatch('permission/generateRoutes', { roles }).then(accessRoutes => {
                            // 根据roles权限生成可访问的路由表
                            router.addRoutes(accessRoutes) // 动态添加可访问路由表
                            next({...to, replace: true }) // hack方法 确保addRoutes已完成
                        })
                    })
                    .catch(err => {
                        store.dispatch('SSOFedLogOut').then(() => {
                            Message.error(err)
                            next({ path: '/' })
                        })
                    })
            } else {
                next();
                // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
                // if (hasPermission(store.getters.roles, to.meta.roles)) {
                //   next()
                // } else {
                //   next({ path: '/401', replace: true, query: { noGoBack: true }})
                // }
                // 可删 ↑
            }
        }
    } else {
        // 没有token
        if (whiteList.indexOf(to.path) !== -1) {
            // 在免登录白名单，直接进入
            //window.open(process.env.VUE_APP_PATH_API,'_self')
            next();
        } else {
            //window.open(process.env.VUE_APP_PATH_API,'_self')
            store.dispatch('SSOFedLogOut').then(() => {
                // Message.error(err)
                // next({ path: '/' })
            })
            next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
            NProgress.done()
        }
    }
})



router.afterEach(() => {
    NProgress.done()
})