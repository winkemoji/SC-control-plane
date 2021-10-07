<template>
  <v-card max-width="720" class="mx-auto">
    <v-container>
      <v-row dense>
        <v-col cols="12">
          <v-toolbar flat color="white">
            <span class="text-h5">设置 settings</span>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-btn color="" class="mr-4" @click="restore_config"
              >恢复默认</v-btn
            >
            <v-btn color="primary" @click="update_config">保存并立即生效</v-btn>
          </v-toolbar>
          <v-divider></v-divider>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12">
          <v-card-title class="headline">日志 logger</v-card-title>
          <v-card-text>
            <v-row dense>
              <v-col cols="12">
                <v-checkbox
                  label="开启DEBUG"
                  v-model="config.logger.debug"
                ></v-checkbox>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col cols="6">
                <v-text-field
                  label="日志路径"
                  v-model="config.logger.file_path"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12">
          <v-card-title class="headline">消息中间件 rabbitmq</v-card-title>
          <v-card-text>
            <v-row dense>
              <v-col cols="6">
                <v-text-field
                  label="host"
                  v-model="config.rabbitmq.host"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  label="port"
                  v-model="config.rabbitmq.port"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col cols="6">
                <v-text-field
                  label="username"
                  v-model="config.rabbitmq.username"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  label="password"
                  v-model="config.rabbitmq.password"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import axios from "axios";
export default {
  computed: {
    daemon_api() {
      let DAEMON_API = "";
      if (process.env.NODE_ENV == "development") {
        DAEMON_API = process.env.VUE_APP_DAEMON_API;
      } else {
        DAEMON_API =
          "http://" +
          document.getElementsByTagName("env")[0].getAttribute("sc-host") +
          ":4400";
      }
      return DAEMON_API;
    },
  },
  data() {
    return {
      config: {
        logger: {
          debug: null,
          file_path: "",
        },
        rabbitmq: {
          host: "",
          port: "",
          username: "",
          password: "",
        },
      },
    };
  },
  mounted() {
    this.bind_data(false);
  },
  methods: {
    bind_data(def = false) {
      let url = "";
      if (def) {
        url = this.daemon_api + "/default-config";
      } else {
        url = this.daemon_api + "/config";
      }
      axios.get(url).then((res) => {
        var data = res.data;
        this.config.logger = data.logger;
        this.config.rabbitmq = data.rabbitmq;
      });
    },
    restore_config() {
      this.bind_data(true);
    },
    update_config() {
      let url = this.daemon_api + "/update-config";
      axios.post(url, this.config).then(() => {
        this.$toast.success("保存成功，服务重启中");
      });
    },
  },
};
</script>
