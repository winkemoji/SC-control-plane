<template>
  <div class="save-data-container">
    <v-form>
      <v-container fluid>
        <v-row>
          <v-col cols="12" md="2">
            <v-text-field
              label="binding key"
              v-model="binding_key"
              required
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="3">
            <v-text-field
              label="routing keys (split by comma)"
              v-model="routing_keys"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
      <v-container fluid>
        <v-label>MongoDB数据库连接配置</v-label>
        <v-row>
          <v-col cols="12" md="3">
            <v-text-field
              label="host"
              v-model="mongodbForm.host"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              label="port"
              v-model="mongodbForm.port"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="3">
            <v-text-field
              label="username"
              v-model="mongodbForm.username"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              label="password"
              type="password"
              v-model="mongodbForm.password"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="3">
            <v-text-field
              label="database"
              v-model="mongodbForm.database"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-btn class="primary" @click="saveMongodbForm">保存</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["blueprintTemplate", "bpSaveData", "mongodbSettings"]),
    binding_key: {
      get: function () {
        return this.bpSaveData.binding_key;
      },
      set: function (val) {
        this.$store.commit("SET_SAVE_DATA_MODULE", { binding_key: val });
      },
    },
    mongodbForm() {
      return this.mongodbSettings;
    },
    routing_keys: {
      get: function () {
        return this.bpSaveData.routing_keys;
      },
      set: function (val) {
        let temp = val.replace(RegExp(" ", "g"), "").split(",");
        this.$store.commit("SET_SAVE_DATA_MODULE", { routing_keys: temp });
      },
    },
  },
  data() {
    return {};
  },
  methods: {
    saveMongodbForm() {
      this.$store.commit("SET_MONGODB", this.mongodbForm);
      this.$toast.success("保存成功");
    },
  },
};
</script>
