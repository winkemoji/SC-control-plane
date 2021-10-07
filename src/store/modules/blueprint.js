const state = {
  meta: {
    unique_name: "",
    tag: "",
    create_time: "",
  },
  base_meta: {
    unique_name: "",
    tag: "",
    create_time: "",
  },
  template: {
    unique_name: "",
    modules: {
      collect_data: {
        binding_key: "module.c",
        routing_keys: ["module.p", "log.c"],
        collect_interval: 5,
        snmp_credentials: {
          version: "v3",
          username: "",
          auth_protocol: "None",
          auth_pass: "",
          priv_protocol: "None",
          priv_pass: "",
        },
        oids: [],
        agents: [],
      },
      parse_data: {
        binding_key: "module.p",
        routing_keys: ["module.s", "log.p"],
        script: "",
      },
      save_data: {
        binding_key: "module.s",
        routing_keys: ["log.s"],
        mongodb: {
          host: "",
          port: "",
          username: "",
          password: "",
          database: "",
        },
      },
    },
  },
  base_template: {
    unique_name: "",
    modules: {
      collect_data: {
        binding_key: "module.c",
        routing_keys: ["module.p", "log.c"],
        collect_interval: 5,
        snmp_credentials: {
          version: "v3",
          username: "",
          auth_protocol: "None",
          auth_pass: "",
          priv_protocol: "None",
          priv_pass: "",
        },
        oids: [],
        agents: [],
      },
      parse_data: {
        binding_key: "module.p",
        routing_keys: ["module.s", "log.p"],
        script:
          'def parse_data(data):\n    """\n    write your own code in the section below.   \n    """  \n    return data',
      },
      save_data: {
        binding_key: "module.s",
        routing_keys: ["log.s"],
        mongodb: {
          host: "",
          port: "27017",
          username: "",
          password: "",
          database: "",
        },
      },
    },
  },
};

const mutations = {
  SET_SCRIPT: (state, payload) => {
    let copy = JSON.parse(JSON.stringify(state.template));
    copy.modules.parse_data.script = payload;
    state.template = copy;
  },
  SET_MONGODB: (state, payload) => {
    let copy = JSON.parse(JSON.stringify(state.template));
    copy.modules.save_data.mongodb = payload;
    state.template = copy;
  },
  ADD_OID: (state, payload) => {
    let copy = JSON.parse(JSON.stringify(state.template));
    copy.modules.collect_data.oids.push(payload);
    state.template = copy;
  },
  UPDATE_OID: (state, payload) => {
    let [index, oidForm] = payload;
    let copy = JSON.parse(JSON.stringify(state.template));
    let oids = copy.modules.collect_data.oids;
    Object.assign(oids[index], oidForm);
    state.template = copy;
  },
  DELETE_OID: (state, index) => {
    let copy = JSON.parse(JSON.stringify(state.template));
    let oids = copy.modules.collect_data.oids;
    oids.splice(index, 1);
    state.template = copy;
  },
  ADD_AGENT: (state, payload) => {
    let copy = JSON.parse(JSON.stringify(state.template));
    copy.modules.collect_data.agents.push(payload);
    state.template = copy;
  },
  UPDATE_AGENT: (state, payload) => {
    let [index, agentForm] = payload;
    let copy = JSON.parse(JSON.stringify(state.template));
    let agents = copy.modules.collect_data.agents;
    agents[index] = agentForm;
    state.template = copy;
  },
  DELETE_AGENT: (state, index) => {
    let copy = JSON.parse(JSON.stringify(state.template));
    let agents = copy.modules.collect_data.agents;
    agents.splice(index, 1);
    state.template = copy;
  },
  UPDATE_TEMPLATE: (state, template) => {
    state.template = Object.assign({}, state.base_template, template);
  },
  UPDATE_META: (state, meta) => {
    state.meta = Object.assign({}, state.base_meta, meta);
  },
  RESET_TEMPLATE: (state) => {
    let copy = Object.assign({}, state.base_template);
    state.template = copy;
  },
  RESET_META: (state) => {
    let copy = Object.assign({}, state.base_meta);
    state.meta = copy;
  },
  SET_UNIQUE_NAME: (state, unique_name) => {
    let meta = JSON.parse(JSON.stringify(state.meta));
    let template = JSON.parse(JSON.stringify(state.template));
    template.unique_name = unique_name;
    meta.unique_name = unique_name;
    state.meta = meta;
    state.template = template;
  },
  SET_TAG: (state, tag) => {
    let copy = JSON.parse(JSON.stringify(state.meta));
    copy.tag = tag;
    state.meta = copy;
  },
  SET_SNMP_CREDENTIALS: (state, payload) => {
    let copy = JSON.parse(JSON.stringify(state.template));
    copy.modules.collect_data.snmp_credentials = payload;
    state.template = copy;
  },
  SET_COLLECT_DATA_MODULE: (state, payload) => {
    let copy = JSON.parse(JSON.stringify(state.template));
    for (var k in payload) {
      copy.modules.collect_data[k] = payload[k];
    }
    state.template = copy;
  },
  SET_PARSE_DATA_MODULE: (state, payload) => {
    let copy = JSON.parse(JSON.stringify(state.template));
    for (var k in payload) {
      copy.modules.parse_data[k] = payload[k];
    }
    state.template = copy;
  },
  SET_SAVE_DATA_MODULE: (state, payload) => {
    let copy = JSON.parse(JSON.stringify(state.template));
    for (var k in payload) {
      copy.modules.save_data[k] = payload[k];
    }
    state.template = copy;
  },
};

const actions = {};

export default {
  state,
  mutations,
  actions,
};
