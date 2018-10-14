import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    files: {
      host: null,
      asset: null,
    },
  },
  mutations: {
    setFile(state, { target, file }) {
      state.files[target] = file;
    },
  },
});
