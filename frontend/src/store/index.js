import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    ctx: null,
    canvas: null,
    brushColor: '#000',
    brushSize: 2,
  },
  mutations: {
    mutateCtx(state, data) {
      state.ctx = data;
    },
    mutateCanvas(state, data) {
      state.canvas = data;
    },
    mutateBrushColor(state, data) {
      state.brushColor = data;
    },
    mutateBrushSize(state, data) {
      state.brushSize = data;
    },
  },
  actions: {
  },
  modules: {
  },
});
