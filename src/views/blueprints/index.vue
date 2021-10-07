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
          <v-toolbar-title>蓝图 blueprints</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="newBlueprint()">新建蓝图</v-btn>
        </v-toolbar>
      </template>
      <template v-slot:[`item.tag`]="{ item }">
        <v-chip outlined small>{{ item.tag }}</v-chip>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-menu offset-y :min-width="menu.minWidth">
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list>
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
      <template v-slot:no-data>暂无蓝图</template>
    </v-data-table>
    <v-dialog v-model="deleteDialog.isShow" width="500">
      <v-card>
        <v-card-title class="lighten-2"> 删除蓝图 </v-card-title>
        <v-card-text> {{ deleteDialog.message }} </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="deleteBlueprint()"> 删除 </v-btn>
          <v-btn color="primary" text @click="deleteDialog.isShow = false">
            取消
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { blueprintsR, blueprintsD, blueprintsA } from "@/api/blueprints";
export default {
  name: "settings",
  data: () => ({
    deleteDialog: {
      isShow: false,
      message: "",
    },
    alert: false,
    menu: {
      minWidth: 100,
      items: [
        { title: "组装", flag: "assemble" },
        { title: "编辑", flag: "edit" },
        { title: "删除", flag: "delete" },
      ],
    },
    table: {
      headers: [
        {
          text: "名称",
          align: "start",
          sortable: false,
          value: "name",
        },
        { text: "标签", value: "tag", sortable: false },
        { text: "创建时间", value: "create_time", sortable: true },
        { text: "操作", value: "actions", sortable: false },
      ],
      data: [],
    },
    blueprint: null,
  }),
  mounted() {
    this.initialize();
  },

  methods: {
    menuHandler(menuItem, blueprint) {
      //this.blueprint为当前选定的蓝图
      this.blueprint = blueprint;
      if (menuItem.flag == "assemble") {
        this.assembleBlueprint();
      }
      if (menuItem.flag == "edit") {
        this.editBlueprint();
      }
      if (menuItem.flag == "delete") {
        this.showDeleteDialog();
      }
    },
    assembleBlueprint() {
      let blueprint_id = this.blueprint.blueprint_id;
      blueprintsA(blueprint_id).then(() => {
        this.$toast.success("组装完成");
      });
    },
    editBlueprint() {
      let blueprint_id = this.blueprint.blueprint_id;
      this.$router.push({
        path: "/blueprint-template",
        query: { blueprint_id },
      });
    },
    showDeleteDialog() {
      this.deleteDialog.isShow = true;
    },
    deleteBlueprint() {
      let blueprint_id = this.blueprint.blueprint_id;
      blueprintsD(blueprint_id).then(() => {
        this.$toast.warning("蓝图删除");
        this.deleteDialog.isShow = false;
        this.bindData();
      });
    },
    bindData() {
      blueprintsR().then((res) => {
        this.table.data = res;
      });
    },
    initialize() {
      this.bindData();
    },
    newBlueprint() {
      this.$router.push("/blueprint-template");
    },
  },
};
</script>
