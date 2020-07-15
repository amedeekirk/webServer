import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    ctx: null,
    canvas: null,
  },
  mutations: {
    mutateCtx(state, data) {
      state.ctx = data;
    },
    mutateCanvas(state, data) {
      state.canvas = data;
    },
  },
  actions: {
  },
  modules: {
  },
});
