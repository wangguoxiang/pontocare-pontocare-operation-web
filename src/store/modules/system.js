import http from '@/services/index';

const SET_KEEP_LOGIN = 'SET_KEEP_LOGIN';
const SET_SHOW_SESSION_EXPIRED = 'SET_SHOW_SESSION_EXPIRED';
const SET_SERVER_LIST = 'SET_SERVER_LIST';
const SET_SHOW_CAPTCHA_VERIFY_FAIL = 'SET_SHOW_CAPTCHA_VERIFY_FAIL';
const SET_IS_UPDATE_VERSION = 'SET_IS_UPDATE_VERSION';

export default {
  namespaced: true,
  state: {
    keepLogin: localStorage.getItem('keep_login') || '',
    showSessionExpired: false,
    serverList: [],
    showCaptchaVerifyFail: false,
    isUpdateVersion: false
  },
  mutations: {
    [SET_KEEP_LOGIN](state, keepLogin) {
      state.keepLogin = keepLogin;
    },
    [SET_SHOW_SESSION_EXPIRED](state, showSessionExpired) {
      state.showSessionExpired = showSessionExpired;
    },
    [SET_SERVER_LIST](state, serverList) {
      state.serverList = serverList;
    },
    [SET_SHOW_CAPTCHA_VERIFY_FAIL](state, showCaptchaVerifyFail) {
      state.showCaptchaVerifyFail = showCaptchaVerifyFail;
    },
    [SET_IS_UPDATE_VERSION](state, isUpdateVersion) {
      state.isUpdateVersion = isUpdateVersion;
    }
  },
  actions: {
    getServerList({ commit }) {
      http.getServerList().then((res) => {
        // 兼容多种 API 返回格式：直接返回数组，或包裹在 { data: [...] } / { records: [...] } 中
        const list = Array.isArray(res) ? res : (res.data || res.records || []);
        commit(SET_SERVER_LIST, list);
      });
    }
  },
  getters: {
    getKeepLogin(state) {
      return state.keepLogin;
    },
    getCurrentServer(state) {
      if (Array.isArray(state.serverList) && state.serverList.length > 0) {
        const currentEndPoint = window.location.protocol + '//' + window.location.host;
        return state.serverList.find(item => item.endpoint.includes(currentEndPoint)) || {};
      } else {
        return {};
      }
    }
  }
};
