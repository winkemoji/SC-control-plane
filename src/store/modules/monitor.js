const state = {
  form: {
    unique_name: "",
    binding_keys: [],
  },
  isRunning: false,
  cache: [],
  base_cache: [],
};
const mutations = {
  SET_UNIQUE_NAME: (state, payload) => {
    state.form.unique_name = payload;
  },
  SET_BINDING_KEYS: (state, payload) => {
    state.form.binding_keys = payload.split(",");
  },
  ADD_CACHE: (state, payload) => {
    let copy = JSON.parse(JSON.stringify(state.cache));
    copy.push(payload);
    state.cache = copy;
  },
  RESET_CACHE: (state) => {
    let copy = Object.assign([], state.base_cache);
    state.cache = copy;
  },
  CHANGE_IS_RUNNING: (state, payload) => {
    state.isRunning = payload;
  },
};

const actions = {};

export default {
  state,
  mutations,
  actions,
};
