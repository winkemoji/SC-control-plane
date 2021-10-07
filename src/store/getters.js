const getters = {
  blueprintMeta: (state) => state.blueprint.meta,
  blueprintTemplate: (state) => state.blueprint.template,
  bpCollectData: (state) => state.blueprint.template.modules.collect_data,
  bpParseData: (state) => state.blueprint.template.modules.parse_data,
  bpSaveData: (state) => state.blueprint.template.modules.save_data,
  bpParseScript: (state) => state.blueprint.template.modules.parse_data.script,
  monitorCache: (state) => state.monitor.cache,
  monitorForm: (state) => state.monitor.form,
  mongodbSettings: (state) =>
    state.blueprint.template.modules.save_data.mongodb,
};
export default getters;
