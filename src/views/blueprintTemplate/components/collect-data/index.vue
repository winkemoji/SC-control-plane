<template>
  <div class="collect-data-container">
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

          <v-col cols="12" md="2">
            <v-menu
              ref="menu"
              v-model="snmpCredentialsDialog.menu2"
              :close-on-content-click="false"
              :nudge-right="40"
              :return-value.sync="collect_interval"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="collect_interval"
                  label="采集间隔(分钟)"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-time-picker
                v-if="snmpCredentialsDialog.menu2"
                v-model="collect_interval"
                scrollable
                full-width
                format="24hr"
                @click:minute="$refs.menu.save(collect_interval)"
              ></v-time-picker>
            </v-menu>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
    <!-- oids -->
    <v-data-table
      :headers="oids_table.headers"
      :items="oids"
      class="elevation-1"
      dense
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>oids</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn @click="oidEditDialog.isShow = true" color="primary"
            >添加OID</v-btn
          >
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small @click="editOid(item)"> mdi-pencil </v-icon>
        <v-icon small @click="showDeleteOid(item)"> mdi-delete </v-icon>
      </template>
      <template v-slot:no-data>暂无数据</template>
    </v-data-table>
    <!-- agents -->
    <v-data-table
      :headers="agents_table.headers"
      :items="agents"
      class="elevation-1"
      dense
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>agents</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn @click="snmpCredentialsDialog.isShow = true" class="mr-10"
            >默认snmp凭证</v-btn
          >
          <v-btn @click="showAddAgent()" color="primary">添加agent</v-btn>
        </v-toolbar>
      </template>
      <template v-slot:[`item.use_default_credentials`]="{ item }">
        <v-chip :color="getColor(item.use_default_credentials)" small dark>{{
          item.use_default_credentials
        }}</v-chip>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small @click="editAgent(item)"> mdi-pencil </v-icon>
        <v-icon small @click="showDeleteAgent(item)"> mdi-delete </v-icon>
      </template>
      <template v-slot:no-data>暂无数据</template>
    </v-data-table>
    <!-- snmp credentials -->
    <v-dialog v-model="snmpCredentialsDialog.isShow" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">默认SNMP凭证</span>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="4" md="4">
              <v-text-field
                label="version"
                v-model="snmpCredentialsForm.version"
                required
                disabled
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="8" md="8">
              <v-text-field
                label="username"
                v-model="snmpCredentialsForm.username"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4" md="4">
              <v-select
                v-model="snmpCredentialsForm.auth_protocol"
                :items="authProtocolList"
                label="auth protocol"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="8" md="8">
              <v-text-field
                :disabled="snmpCredentialsDialog.auth_pass_disabled"
                :append-icon="
                  snmpCredentialsDialog.auth_pass_show
                    ? 'mdi-eye'
                    : 'mdi-eye-off'
                "
                :type="
                  snmpCredentialsDialog.auth_pass_show ? 'text' : 'password'
                "
                v-model="snmpCredentialsForm.auth_pass"
                label="auth pass"
                @click:append="
                  snmpCredentialsDialog.auth_pass_show =
                    !snmpCredentialsDialog.auth_pass_show
                "
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4" md="4">
              <v-select
                v-model="snmpCredentialsForm.priv_protocol"
                :items="privProtocolList"
                label="priv protocol"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="8" md="8">
              <v-text-field
                :disabled="snmpCredentialsDialog.priv_pass_disabled"
                :append-icon="
                  snmpCredentialsDialog.priv_pass_show
                    ? 'mdi-eye'
                    : 'mdi-eye-off'
                "
                :type="
                  snmpCredentialsDialog.priv_pass_show ? 'text' : 'password'
                "
                v-model="snmpCredentialsForm.priv_pass"
                label="priv pass"
                @click:append="
                  snmpCredentialsDialog.priv_pass_show =
                    !snmpCredentialsDialog.priv_pass_show
                "
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="saveSnmpCredentials"
            >save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- oid delete dialog -->
    <v-dialog v-model="oidDeleteDialog.isShow" width="500">
      <v-card>
        <v-card-title class="lighten-2"> 删除oid </v-card-title>
        <v-card-text> {{ oidDeleteDialog.message }} </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="deleteOid()"> 删除 </v-btn>
          <v-btn color="primary" text @click="oidDeleteDialog.isShow = false">
            取消
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- agent delete dialog -->
    <v-dialog v-model="agentDeleteDialog.isShow" width="500">
      <v-card>
        <v-card-title class="lighten-2"> 删除agent </v-card-title>
        <v-card-text> {{ agentDeleteDialog.message }} </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="deleteAgent()"> 删除 </v-btn>
          <v-btn color="primary" text @click="oidDeleteDialog.isShow = false">
            取消
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- add or edit oid dialog -->
    <v-dialog v-model="oidEditDialog.isShow" width="500">
      <v-card>
        <v-card-title>
          <span class="headline">{{ oidFormTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="4" md="4">
                <v-text-field
                  label="name"
                  v-model="oidForm.name"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="8" md="8">
                <v-text-field
                  label="description"
                  v-model="oidForm.description"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="8" md="8">
                <v-text-field label="oid" v-model="oidForm.oid"></v-text-field>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-select
                  v-model="oidForm.operation"
                  :items="oidOpList"
                  label="operation"
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeOid()">cancel</v-btn>
          <v-btn color="blue darken-1" text @click="saveOid()">save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- add or edit agent dialog -->
    <v-dialog v-model="agentEditDialog.isShow" width="500">
      <v-card>
        <v-card-title>
          <span class="headline">{{ agentFormTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="6">
                <v-text-field label="ip" v-model="agentForm.ip"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-checkbox
                  v-model="agentForm.use_default_credentials"
                  label="使用默认snmp凭证"
                ></v-checkbox>
              </v-col>
              <!-- 如果不使用snmp默认凭证 -->
              <v-col
                cols="12"
                sm="12"
                md="12"
                v-if="!agentForm.use_default_credentials"
              >
                <v-row>
                  <v-col cols="12" sm="4" md="4">
                    <v-text-field
                      label="version"
                      value="v3"
                      required
                      disabled
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="8" md="8">
                    <v-text-field
                      label="username"
                      v-model="agentForm.credentials.username"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4" md="4">
                    <v-select
                      v-model="agentForm.credentials.auth_protocol"
                      :items="authProtocolList"
                      label="auth protocol"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="8" md="8">
                    <v-text-field
                      :disabled="agentEditDialog.auth_pass_disabled"
                      :append-icon="
                        agentEditDialog.auth_pass_show
                          ? 'mdi-eye'
                          : 'mdi-eye-off'
                      "
                      :type="
                        agentEditDialog.auth_pass_show ? 'text' : 'password'
                      "
                      v-model="agentForm.credentials.auth_pass"
                      label="auth pass"
                      @click:append="
                        agentEditDialog.auth_pass_show =
                          !agentEditDialog.auth_pass_show
                      "
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4" md="4">
                    <v-select
                      v-model="agentForm.credentials.priv_protocol"
                      :items="privProtocolList"
                      label="priv protocol"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="8" md="8">
                    <v-text-field
                      :disabled="agentEditDialog.priv_pass_disabled"
                      :append-icon="
                        agentEditDialog.priv_pass_show
                          ? 'mdi-eye'
                          : 'mdi-eye-off'
                      "
                      :type="
                        agentEditDialog.priv_pass_show ? 'text' : 'password'
                      "
                      v-model="agentForm.credentials.priv_pass"
                      label="priv pass"
                      @click:append="
                        agentEditDialog.priv_pass_show =
                          !agentEditDialog.priv_pass_show
                      "
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeAgent()">cancel</v-btn>
          <v-btn color="blue darken-1" text @click="saveAgent()">save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["blueprintTemplate", "bpCollectData"]),
    agents() {
      return this.bpCollectData.agents;
    },
    oids() {
      return this.bpCollectData.oids;
    },
    snmpCredentialsForm() {
      return this.bpCollectData.snmp_credentials;
    },
    binding_key: {
      get: function () {
        return this.bpCollectData.binding_key;
      },
      set: function (val) {
        this.$store.commit("SET_COLLECT_DATA_MODULE", { binding_key: val });
      },
    },
    routing_keys: {
      get: function () {
        return this.bpCollectData.routing_keys;
      },
      set: function (val) {
        let temp = val.replace(RegExp(" ", "g"), "").split(",");
        this.$store.commit("SET_COLLECT_DATA_MODULE", { routing_keys: temp });
      },
    },
    collect_interval: {
      get: function () {
        let t = this.bpCollectData.collect_interval;
        let h = Math.floor(t / 60);
        let m = t - h * 60;
        h = ("0" + h).slice(-2);
        m = ("0" + m).slice(-2);
        return h + ":" + m;
      },
      set: function (val) {
        let [h, m] = val.split(":");
        h = parseInt(h);
        m = parseInt(m);
        let t = h * 60 + m;
        this.$store.commit("SET_COLLECT_DATA_MODULE", {
          collect_interval: t,
        });
      },
    },
    oidFormTitle() {
      return this.oidEditedIndex === -1 ? "添加OID" : "编辑OID";
    },
    agentFormTitle() {
      return this.agentEditedIndex === -1 ? "添加AGENT" : "编辑AGENT";
    },
  },
  data() {
    return {
      snmpCredentialsDialog: {
        isShow: false,
        menu2: false,
        auth_pass_disabled: true,
        auth_pass_show: false,
        priv_pass_disabled: true,
        priv_pass_show: false,
      },
      oidDeleteDialog: {
        item: null,
        isShow: false,
        message: "确定要删除oid?",
      },
      agentDeleteDialog: {
        item: null,
        isShow: false,
        message: "确定要删除agent?",
      },
      oidEditDialog: {
        item: null,
        isShow: false,
        auth_pass_disabled: true,
        auth_pass_show: false,
        priv_pass_disabled: true,
        priv_pass_show: false,
      },
      agentEditDialog: {
        item: null,
        isShow: false,
        auth_pass_disabled: true,
        auth_pass_show: false,
        priv_pass_disabled: true,
        priv_pass_show: false,
      },
      oidEditedIndex: -1,
      agentEditedIndex: -1,
      authProtocolList: [
        "None",
        "MD5",
        "SHA",
        "SHA-224",
        "SHA-256",
        "SHA-384",
        "SHA-512",
      ],
      privProtocolList: ["None", "AES", "DES"],
      oidOpList: ["get", "walk"],
      agentForm: {
        ip: "",
        use_default_credentials: true,
        credentials: {
          username: "",
          auth_protocol: "None",
          auth_pass: "",
          priv_protocol: "None",
          priv_pass: "",
        },
      },
      oidForm: {
        name: "",
        oid: "",
        description: "",
        operation: "",
      },
      oids_table: {
        headers: [
          {
            text: "name",
            align: "start",
            sortable: false,
            value: "name",
          },
          { text: "oid", value: "oid", sortable: false },
          { text: "description", value: "description", sortable: false },
          { text: "operation", value: "operation", sortable: false },
          {
            text: "操作",
            value: "actions",
            sortable: false,
            width: 100,
          },
        ],
      },
      agents_table: {
        headers: [
          {
            text: "ip",
            align: "start",
            sortable: true,
            value: "ip",
          },
          {
            text: "使用默认凭证",
            value: "use_default_credentials",
            sortable: true,
          },
          { text: "操作", value: "actions", sortable: false, width: 100 },
        ],
      },
    };
  },
  mounted() {},
  methods: {
    closeOid() {
      this.oidEditDialog.isShow = false;
      this.$nextTick(() => {
        this.oidForm = {};
        this.oidEditedIndex = -1;
      });
    },
    closeAgent() {
      this.agentEditDialog.isShow = false;
      this.$nextTick(() => {
        // 用于清空表单中的内容
        let temp =
          '{"ip":"","use_default_credentials":true,"credentials":{"username":"","auth_protocol":"None","auth_pass":"",\
          "priv_protocol":"None","priv_pass":""}}';
        this.agentForm = Object.assign({}, JSON.parse(temp));
        this.agentEditedIndex = -1;
      });
    },
    deleteOid() {
      let item = this.oidDeleteDialog.item;
      const index = this.oids.indexOf(item);
      this.$store.commit("DELETE_OID", index);
      this.oidDeleteDialog.isShow = false;
    },
    deleteAgent() {
      let item = this.agentDeleteDialog.item;
      const index = this.agents.indexOf(item);
      this.$store.commit("DELETE_AGENT", index);
      this.agentDeleteDialog.isShow = false;
    },
    editOid(item) {
      this.oidEditedIndex = this.oids.indexOf(item);
      this.oidForm = Object.assign({}, item);
      this.oidEditDialog.isShow = true;
    },
    editAgent(item) {
      this.agentEditedIndex = this.agents.indexOf(item);
      let temp =
        '{"ip":"","use_default_credentials":true,"credentials":{"username":"","auth_protocol":"None","auth_pass":"",\
          "priv_protocol":"None","priv_pass":""}}';
      this.agentForm = Object.assign(JSON.parse(temp), item);
      this.agentEditDialog.isShow = true;
    },

    getColor(use_default_credentials) {
      if (use_default_credentials) return "green";
      else return "red";
    },
    saveSnmpCredentials() {
      this.$store.commit("SET_SNMP_CREDENTIALS", this.snmpCredentialsForm);
      this.snmpCredentialsDialog.isShow = false;
    },
    showDeleteAgent(item) {
      this.agentDeleteDialog.item = item;
      this.agentDeleteDialog.isShow = true;
    },
    saveOid() {
      if (this.oidEditedIndex > -1) {
        this.$store.commit("UPDATE_OID", [this.oidEditedIndex, this.oidForm]);
      } else {
        this.$store.commit("ADD_OID", this.oidForm);
      }
      this.closeOid();
    },
    showDeleteOid(item) {
      this.oidDeleteDialog.item = item;
      this.oidDeleteDialog.isShow = true;
    },
    showAddAgent() {
      this.agentEditDialog.isShow = true;
      this.agentForm.use_default_credentials = true;
    },
    saveAgent() {
      let copy = Object.assign({}, this.agentForm);
      if (copy.use_default_credentials) {
        delete copy.credentials;
      }
      if (this.agentEditedIndex > -1) {
        this.$store.commit("UPDATE_AGENT", [this.agentEditedIndex, copy]);
      } else {
        this.$store.commit("ADD_AGENT", copy);
      }
      this.closeAgent();
    },
  },

  watch: {
    "snmpCredentialsForm.auth_protocol"(val) {
      if (val == "None") {
        this.snmpCredentialsDialog.auth_pass_disabled = true;
        this.snmpCredentialsForm.auth_pass = "";
      } else {
        this.snmpCredentialsDialog.auth_pass_disabled = false;
      }
    },
    "snmpCredentialsForm.priv_protocol"(val) {
      if (val == "None") {
        this.snmpCredentialsDialog.priv_pass_disabled = true;
        this.snmpCredentialsForm.priv_pass = "";
      } else {
        this.snmpCredentialsDialog.priv_pass_disabled = false;
      }
    },
    "agentForm.credentials.auth_protocol"(val) {
      if (val == "None") {
        this.agentEditDialog.auth_pass_disabled = true;
        this.agentForm.credentials.auth_pass = "";
      } else {
        this.agentEditDialog.auth_pass_disabled = false;
      }
    },
    "agentForm.credentials.priv_protocol"(val) {
      if (val == "None") {
        this.agentEditDialog.priv_pass_disabled = true;
        this.agentForm.credentials.priv_pass = "";
      } else {
        this.agentEditDialog.priv_pass_disabled = false;
      }
    },
  },
};
</script>
<style lang="scss">
.collect-data-container {
  ::v-deep .v-data-table {
    border: none;
  }
}
</style>
