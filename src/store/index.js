// import createPersistedState from "vuex-persistedstate";
import Vue from "vue";
import Vuex from "vuex";
import getters from "./getters";
import blueprint from "./modules/blueprint";
import monitor from "./modules/monitor";
Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    blueprint,
    monitor,
  },
  getters,
});

export default store;
