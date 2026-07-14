const SET_USERNAME = 'SET_USERNAME';
const SET_TOKEN = 'SET_TOKEN';
const SET_USERID = 'SET_USERID';

export default {
  namespaced: true,
  state: {
    username: localStorage.getItem('username') || '',
    userId: localStorage.getItem('userId') || '',
    token: localStorage.getItem('token') || ''
  },
  mutations: {
    [SET_USERNAME](state, username) {
      state.username = username;
    },
    [SET_USERID](state, userId) {
      state.userId = userId;
    },
    [SET_TOKEN](state, token) {
      state.token = token;
    }
  },
  actions: {},
  getters: {
    getUsername(state) {
      return state.username;
    }
  }
};
