<template>
  <div class="collection-monitor">
    <v-card>
      <v-toolbar flat color="white">
        <v-toolbar-title>监视器 monitor</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-btn @click="test">test</v-btn>
        <v-btn class="mr-10" @click="clearCache">清除缓冲区</v-btn>
        <v-btn :color="statusCtl.current.color" @click="startOrStopMonitor"
          >{{ statusCtl.current.label }}
          <v-icon right dark>{{ statusCtl.current.icon }}</v-icon>
        </v-btn>
      </v-toolbar>
      <v-form>
        <v-container fluid>
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="unique_name"
                label="采集名称"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="binding_keys"
                label="binding keys(split by comma)"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
      <monitor v-model="cache" />
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Monitor from "@/components/monitor";
export default {
  name: "collectionMonitor",
  components: {
    Monitor,
  },
  computed: {
    ...mapGetters(["monitorCache", "monitorForm"]),
    unique_name: {
      get() {
        return this.monitorForm.unique_name;
      },
      set(val) {
        this.$store.commit("SET_UNIQUE_NAME", val);
      },
    },
    binding_keys: {
      get() {
        return this.monitorForm.binding_keys;
      },
      set(val) {
        this.$store.commit("SET_BINDING_KEYS", val);
      },
    },
    cache: {
      get() {
        return this.monitorCache;
      },
      set(val) {
        val;
      },
    },
    isRunning: {
      get() {
        return this.$store.state.monitor.isRunning;
      },
      set(val) {
        this.$store.commit("CHANGE_IS_RUNNING", val);
      },
    },
  },
  data() {
    return {
      statusCtl: {
        flag: false,
        current: {
          icon: "",
          label: "",
          color: "",
        },
        start: {
          icon: "mdi-run",
          label: "启动",
          color: "success",
        },
        stop: {
          icon: "mdi-stop",
          label: "停止",
          color: "error",
        },
      },
      websock: null,
    };
  },
  mounted() {
    this.initWebSocket();
    if (this.isRunning) {
      Object.assign(this.statusCtl.current, this.statusCtl.stop);
    } else {
      Object.assign(this.statusCtl.current, this.statusCtl.start);
    }
  },
  methods: {
    test() {
      this.wsSend({
        target: "start",
        data: {
          unique_name: this.unique_name,
          binding_keys: this.binding_keys,
        },
      });
    },
    startOrStopMonitor() {
      if (this.isRunning) {
        Object.assign(this.statusCtl.current, this.statusCtl.start);
        this.websock.close();
        this.isRunning = false;
      } else {
        Object.assign(this.statusCtl.current, this.statusCtl.stop);
        this.wsSend({
          target: "start",
          data: {
            unique_name: this.unique_name,
            binding_keys: this.binding_keys,
          },
        });
        this.isRunning = true;
      }
    },
    initWebSocket() {
      var wsuri = process.env.VUE_APP_BASE_WS_API + "/monitor";

      this.websock = new WebSocket(wsuri);
      this.websock.onopen = this.wsOpen;
      this.websock.onmessage = this.wsMessage;
      this.websock.onerror = this.wsError;
      this.websock.onclose = this.wsClose;
    },
    wsOpen() {
      console.log("establish connection.");
    },
    wsError() {
      //连接建立失败重连
      this.initWebSocket();
    },
    wsMessage(e) {
      console.log("on message.");
      //数据接收
      console.log(e.data);
      this.$store.commit("ADD_CACHE", JSON.parse(e.data));
    },
    wsSend(data) {
      //数据发送
      this.websock.send(JSON.stringify(data));
    },
    wsClose(e) {
      //关闭
      console.log("断开连接", e);
      let that = this;
      //断开重连
      setTimeout(() => {
        console.log("re init.");
        that.initWebSocket();
      }, 2000);
    },
    clearCache() {
      this.$store.commit("RESET_CACHE");
    },
  },
};
</script>
<style lang="less"></style>
