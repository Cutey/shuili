import { login, logout, getInfo} from '@/api/login'
import {getInfoSSo} from '@/api/ssologin'
import { getToken, setToken, removeToken } from '@/utils/auth'

const usersso = {
  state: {
    ssotoken: getToken(),
    ssoname: '',
    ssoavatar: '',
    ssoroles: [],
    ssopermissions: [],
  },

  mutations: {
    SET_SSOTOKEN: (state, token) => {
      state.ssotoken = token
    },
    SET_SSONAME: (state, name) => {
      state.ssoname = name
    },
    SET_SSOAVATAR: (state, avatar) => {
      state.ssoavatar = avatar
    },
    SET_SSOROLES: (state, roles) => {
      state.ssoroles = roles
    },
    SET_SSOPERMISSIONS: (state, permissions) => {
      state.ssopermissions = permissions
    }
  },

  actions: {
    // 登录
    SSOLogin({ commit }, userInfo) {
      const username = userInfo.username.trim()
      const password = userInfo.password
      const code = userInfo.code
      const uuid = userInfo.uuid
      return new Promise((resolve, reject) => {
        login(username, password, code, uuid).then(res => {
          setToken(res.token);
          commit('SET_TOKEN', res.token)
          resolve()
        }).catch(error => {
          reject(error);
        })
      })
    },

    // 获取用户信息
        // 获取单点登录用户信息
        SSOGetInfoSSo({ commit, state }) {
        return new Promise((resolve, reject) => {
          getInfoSSo().then(res => {
              const user = res.user
              const avatar = require("@/assets/image/profile.jpg")
              if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
                commit('SET_SSOROLES', res.roles)
                commit('SET_SSOPERMISSIONS', res.permissions)
              } else {
                commit('SET_SSOROLES', ['ROLE_DEFAULT'])
              }
              commit('SET_SSONAME', user.nickName)
              commit('SET_SSOAVATAR', avatar)
              resolve(res)
            }).catch(error => {
              reject(error)
            })
          })
        },
    
    // 退出系统
    SSOLogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then((res) => {
          commit('SET_SSOTOKEN', '')
          commit('SET_SSOROLES', [])
          commit('SET_SSOPERMISSIONS', [])
          removeToken()
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    SSOFedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default usersso
