import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { anyRoutes, resetRouter, asyncRoutes, constantRoutes } from '@/router'
import router from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    // 菜单标记，数组内部元素是字符串
    routes: [],
    // 角色信息
    roles: [],
    // 按钮权限信息
    buttons: [],
    // 对比之后，项目中已有的异步路由，与服务器返回的标记信息进行对比最终需要展示的路由
    resultAsyncRoutes: [],
    // 最终交给用户的路由
    resultAllRoutes:[],
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  // SET_NAME: (state, name) => {
  //   state.name = name
  // },
  // SET_AVATAR: (state, avatar) => {
  //   state.avatar = avatar
  // }
  // 存储用户信息
  SET_USERINFO: (state, userInfo) => {
    // 用户名
    state.name = userInfo.name;
    // 用户头像
    state.avatar = userInfo.avatar;
    // 菜单权限标记
    state.routes = userInfo.routes;
    // 按钮权限标记
    state.buttons = userInfo.buttons;
    // 角色
    state.roles = userInfo.roles;
  },
  // 最终计算出来的异步路由
  SET_RESYLTASYNCROUTES: (state, asyncRoutes) => {
    // vuex 保存当前用户的异步路由，注意，一个用户需要展示的路由：常量、异步、任意
    state.resultAsyncRoutes = asyncRoutes;
    // 计算出当前用户需要展示的所有路由
    state.resultAllRoutes = constantRoutes.concat(state.resultAsyncRoutes,anyRoutes);
    // 给路由器添加新的路由
    router.addRoutes(state.resultAllRoutes)
  }
}

// 两个数组进行对比，得出当前用户显示哪些异步路由
const computedAsyncRoutes = (asyncRoutes, routes) => {
  // 过滤出当前用户，需要展示的异步路由
  return asyncRoutes.filter((item) => {
    // 路由中不能只看一层
    // 数组当中没有这个元素，返回-1，如果有就返回第一个索引
    if (routes.indexOf(item.name) != -1) {
      // 递归 进入条件是存在children且children不为空
      if (item.children && item.children.length) {
        item.children = computedAsyncRoutes(item.children, routes);
      }
      return true;
    }
  })
}


const actions = {
  // 处理登录业务
  async login({ commit }, userInfo) {
    // 解构出用户名与密码
    const { username, password } = userInfo
    let result = await login({ username: username.trim(), password: password });
    // 下面请求发送的是mock数据，mock的数据是20000
    if (result.code === 20000) {
      commit('SET_TOKEN', result.data.token);
      setToken(result.data.token)
      return 'ok';
    } else {
      return Promise.reject(new Error('faile'))
    }
    // return new Promise((resolve, reject) => {
    //   login({ username: username.trim(), password: password }).then(response => {
    //     const { data } = response
    //     commit('SET_TOKEN', data.token)
    //     setToken(data.token)
    //     resolve()
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })

  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        // vuex存储用户的全部信息
        commit('SET_USERINFO', data);
        commit('SET_RESYLTASYNCROUTES', computedAsyncRoutes(asyncRoutes, data.routes))

        // const { name, avatar } = data

        // commit('SET_NAME', name)
        // commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

