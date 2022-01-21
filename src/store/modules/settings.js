import variables from '@/assets/styles/element-variables.scss'
//import variables from "@/assets/styles/variables.scss";
import defaultSettings from '@/settings'

const { showSettings, tagsView, fixedHeader, sidebarLogo } = defaultSettings

const state = {
  theme: '#2D3D40',//主题
  logoBoxColor:'#38676C',//logoboxColor
  logoTextColor:'#fff',//logoTextColor
  showSettings: showSettings,
  tagsView: tagsView,
  fixedHeader: fixedHeader, 
  sidebarLogo: sidebarLogo
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  },
  
}
const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
  
}


export default {
  namespaced: true,
  state,
  mutations,
  actions
}

