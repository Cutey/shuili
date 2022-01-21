import Vue from 'vue'
import Cookies from 'js-cookie'
import formCreate from '@form-create/element-ui'
import 'normalize.css/normalize.css' // a modern alternative to CSS resets
import Element from 'element-ui'
import './assets/styles/element-variables.scss'
import 'font-awesome/css/font-awesome.css';
import '@/assets/styles/index.scss' // global css
import '@/assets/styles/ruoyi.scss' // ruoyi css
import '@/assets/styles/font.css'
import '@/assets/styles/until.css'
import '@/assets/styles/creatfrom.css'
import '@/assets/styles/elechange.css'
import '@/assets/styles/el-diong.css'
import '@/assets/iconfont/iconfont.css'
import '@/assets/iconfontnew/iconfont.css'
import '@/assets/iconfontmaptool/iconfont.css'
import permission from './directive/permission'
import html2canvas from "html2canvas";
import domtoimage from 'dom-to-image'
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'

//引入turf.js
import * as turf from '@turf/turf'
Vue.prototype.$turf = turf

import App from './App'
import store from './store'
import router from './router'
import animate from 'animate.css' //css动画插件

// import './assets/icons' // icon
// import './permission' // permission control
import './sso'
import { getDicts } from "@/api/system/dict/data";
import { getConfigKey } from "@/api/system/config";
import { parseTime, resetForm, addDateRange, selectDictLabel, download, handleTree } from "@/utils/ruoyi";
import 'ol/ol.css';

// 全局方法挂载
Vue.prototype.getDicts = getDicts
Vue.prototype.getConfigKey = getConfigKey
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.download = download
Vue.prototype.handleTree = handleTree

Vue.prototype.msgSuccess = function(msg) {
    this.$message({ showClose: true, message: msg, type: "success" });
}

Vue.prototype.msgError = function(msg) {
    this.$message({ showClose: true, message: msg, type: "error" });
}

Vue.prototype.msgInfo = function(msg) {
    this.$message.info(msg);
}
Vue.use(animate)
Vue.use(formCreate);
Vue.use(Viewer, {
    defaultOptions: {
        zIndex: 99
    }
})

Viewer.setDefaults({
        Options: { 'inline': true, 'button': true, 'navbar': true, 'title': true, 'toolbar': true, 'tooltip': true, 'movable': true, 'zoomable': true, 'rotatable': true, 'scalable': true, 'transition': true, 'fullscreen': true, 'keyboard': true, 'url': 'data-source' }
    })
    // 全局组件挂载
    // Vue.component('Pagination', Pagination)

Vue.use(permission) //登录状态劫持方法

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

Vue.use(Element, {
    size: Cookies.get('size') || 'medium' // set element-ui default size
});

Vue.config.productionTip = false;

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
});