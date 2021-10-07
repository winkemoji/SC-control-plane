<template>
  <div class="parse-data-container">
    <!-- binding keys etc . -->
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
    </v-form>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["blueprintTemplate", "bpParseData"]),
    binding_key: {
      get: function () {
        return this.bpParseData.binding_key;
      },
      set: function (val) {
        this.$store.commit("SET_PARSE_DATA_MODULE", { binding_key: val });
      },
    },
    routing_keys: {
      get: function () {
        return this.bpParseData.routing_keys;
      },
      set: function (val) {
        let temp = val.replace(RegExp(" ", "g"), "").split(",");
        this.$store.commit("SET_PARSE_DATA_MODULE", { routing_keys: temp });
      },
    },
  },
};
</script>
