<template>
  <div class="blueprint-container">
    <v-data-table
      :headers="table.headers"
      :items="table.data"
      sort-by="calories"
      class="elevation-1"
      dense
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>采集 collections</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
        </v-toolbar>
      </template>
      <template v-slot:[`item.status`]="{ item }">
        <v-btn icon :color="getColor(item.status)">
          <v-icon>mdi-circle-medium</v-icon>
        </v-btn>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-menu offset-y :min-width="menu.minWidth">
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list v-if="item.status">
            <v-list-item
              v-for="(menuItem, i) in menu.startedItems"
              :key="i"
              @click="menuHandler(menuItem, item)"
            >
              <v-list-item-title>{{ menuItem.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
          <v-list v-else>
            <v-list-item
              v-for="(menuItem, i) in menu.items"
              :key="i"
              @click="menuHandler(menuItem, item)"
            >
              <v-list-item-title>{{ menuItem.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
      <template v-slot:no-data>暂无采集</template>
    </v-data-table>
    <v-dialog v-model="deleteDialog.isShow" width="500">
      <v-card>
        <v-card-title class="lighten-2"> 删除采集 </v-card-title>
        <v-card-text> {{ deleteDialog.message }} </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="deleteCollection()"> 删除 </v-btn>
          <v-btn color="primary" text @click="deleteDialog.isShow = false">
            取消
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {
  collectionsR,
  collectionsD,
  collectionsStart,
  collectionsStop,
  collectionRestart,
} from "@/api/collections";
export default {
  name: "settings",
  data: () => ({
    deleteDialog: {
      isShow: false,
      message: "",
    },
    menu: {
      minWidth: 100,
      items: [
        { title: "启动", flag: "start" },
        { title: "删除", flag: "delete" },
      ],
      startedItems: [
        { title: "重启", flag: "restart" },
        { title: "停止", flag: "stop" },
      ],
    },
    table: {
      headers: [
        { text: "状态", value: "status", sortable: false, width: 50 },
        {
          text: "名称",
          align: "start",
          sortable: false,
          value: "name",
        },
        { text: "创建时间", value: "create_time", sortable: true },
        { text: "操作", value: "actions", sortable: false },
      ],
      data: [],
    },
    collection: null,
  }),
  mounted() {
    this.initialize();
  },

  methods: {
    menuHandler(menuItem, collection) {
      //this.collection为当前选定的蓝图
      this.collection = collection;
      if (menuItem.flag == "start") {
        this.startCollection();
      }
      if (menuItem.flag == "delete") {
        // this.deleteCollection();
        this.showDeleteDialog();
      }
      if (menuItem.flag == "stop") {
        this.stopCollection();
      }
      if (menuItem.flag == "restart") {
        this.restartCollection();
      }
    },
    showDeleteDialog() {
      this.deleteDialog.isShow = true;
    },
    restartCollection() {
      let collection_id = this.collection.collection_id;
      this.collection.status = 0;
      collectionRestart(collection_id).then(() => {
        this.$toast.info("重启采集");
        this.bindData();
      });
    },
    startCollection() {
      let collection_id = this.collection.collection_id;
      collectionsStart(collection_id).then(() => {
        this.$toast.success("采集启动");
        this.bindData();
      });
    },
    stopCollection() {
      let collection_id = this.collection.collection_id;
      collectionsStop(collection_id).then(() => {
        this.$toast.info("采集停止");
        this.bindData();
      });
    },
    deleteCollection() {
      let collection_id = this.collection.collection_id;
      collectionsD(collection_id).then(() => {
        this.$toast.warning("采集删除");
        this.bindData();
        this.deleteDialog.isShow = false;
      });
    },
    getColor(status) {
      if (status) return "green";
      else return "red";
    },
    bindData() {
      collectionsR().then((res) => {
        this.table.data = res;
      });
    },
    initialize() {
      this.bindData();
    },
  },
};
</script>
