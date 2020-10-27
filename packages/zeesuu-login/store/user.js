export default (opt) => {
  // Default set
  opt.token = opt.token || 'token';

  const state = {
    $userInfo: {},
    $token: '',
  };

  const mutations = {
    SET_USERINFO(state, payload) {
      state.$userInfo = { ...payload };
    },
    SET_TOKEN(state, payload) {
      state.$token = payload;
    },
  };

  const actions = {
    $setUserInfo({ commit }, payload) {
      // 数据判断
      if (!payload || typeof payload !== 'object') {
        console.error('[zeesuu-login] needs a params whit Object type');
        return;
      }
      commit('SET_USERINFO', payload);
    },
    $setToken({ commit }, payload) {
      commit('SET_TOKEN', payload);
      window.localStorage.setItem(opt.token, payload);
    },
  };

  const getters = {
    $userInfo: (state) => state.$userInfo,
    $token: (state) => {
      if (window.localStorage.getItem(opt.token)) {
        state.$token = window.localStorage.getItem(opt.token);
      }
      return state.$token;
    },
  };

  return {
    state,
    mutations,
    actions,
    getters,
  };
};
