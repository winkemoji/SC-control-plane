<template>
  <div class="blueprint-template-container">
    <v-row>
      <v-container fluid>
        <v-card>
          <v-toolbar flat color="white">
            <v-btn icon @click="$router.go(-1)">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <v-divider class="mr-4 ml-1" inset vertical></v-divider>
            <v-toolbar-title>{{ formatTitle }}</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-btn
              v-if="isEditBlueprint"
              @click="deleteCollection()"
              class="mr-4"
              >删除采集
              <v-icon right dark>mdi-delete</v-icon>
            </v-btn>
            <v-btn
              color="success"
              v-if="isEditBlueprint"
              dark
              @click="assembleAndRun()"
              class="mr-4"
              >保存并组装
              <v-icon right dark>mdi-run</v-icon>
            </v-btn>
            <v-btn color="primary" dark @click="saveBlueprint()"
              >保存
              <v-icon right dark>mdi-content-save</v-icon>
            </v-btn>
          </v-toolbar>
        </v-card>
      </v-container>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card class="mx-auto">
          <v-card-title>元数据</v-card-title>
          <v-form v-model="metaValid" ref="metaForm">
            <v-container fluid>
              <v-row>
                <v-col cols="12" md="2">
                  <v-text-field
                    v-model="unique_name"
                    :rules="nameRules"
                    label="名称"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="3">
                  <v-text-field
                    v-model="tag"
                    :rules="tagRules"
                    label="标签"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="3">
                  <v-text-field
                    disabled
                    v-model="create_time"
                    label="创建时间"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card>
          <v-toolbar flat>
            <v-toolbar-title>配置 </v-toolbar-title>
          </v-toolbar>
          <v-tabs v-model="currentTab">
            <v-tab> 数据采集collect</v-tab>
            <v-tab> 数据解析parse</v-tab>
            <v-tab> 数据保存save</v-tab>
            <v-divider vertical></v-divider>
            <v-tab>json</v-tab>
            <v-tab-item> <collect-data></collect-data></v-tab-item>
            <v-tab-item> <parse-data></parse-data></v-tab-item>
            <v-tab-item> <save-data></save-data></v-tab-item>
            <v-tab-item>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-subtitle
                    >*不建议直接编辑,可能会跳过一些校验</v-list-item-subtitle
                  >
                </v-list-item-content>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  @click="jsonEditorSave"
                  :disabled="jsonEditor.saveDisabled"
                  >更新JSON</v-btn
                >
              </v-list-item>
            </v-tab-item>
          </v-tabs>
        </v-card>
        <!-- 不要把json-editor放到v-tab里面，有bug,必须要点击一下才更新内容 -->
        <json-editor
          v-if="jsonEditor.isShow"
          id="jsonEditor"
          ref="jsonEditor"
          v-model="bp"
        />
        <python-editor
          v-model="parseScript"
          v-if="pythonEditor.isShow"
        ></python-editor>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import {
  blueprintsC,
  blueprintR,
  blueprintsU,
  blueprintsA,
} from "@/api/blueprints";
import {
  collectionsStart,
  collectionsD,
  collectionsR,
} from "@/api/collections";
import JsonEditor from "@/components/json-editor";
import PythonEditor from "@/components/python-editor";
import CollectData from "./components/collect-data/index";
import ParseData from "./components/parse-data/index";
import SaveData from "./components/save-data/index";
export default {
  computed: {
    ...mapGetters(["blueprintTemplate", "blueprintMeta", "bpParseScript"]),
    bp: {
      get: function () {
        return this.blueprintTemplate;
      },
      set: function (val) {
        try {
          JSON.parse(val);
          this.jsonEditor.saveDisabled = false;
        } catch (err) {
          this.jsonEditor.saveDisabled = true;
        }
      },
    },
    blueprint_id() {
      return this.$route.query.blueprint_id;
    },
    unique_name: {
      get: function () {
        return this.blueprintTemplate.unique_name;
      },
      set: function (val) {
        this.$store.commit("SET_UNIQUE_NAME", val);
      },
    },
    tag: {
      get: function () {
        return this.blueprintMeta.tag;
      },
      set: function (val) {
        this.$store.commit("SET_TAG", val);
      },
    },
    create_time: {
      get: function () {
        return this.blueprintMeta.create_time;
      },
    },
    parseScript: {
      get: function () {
        return this.bpParseScript;
      },
      set: function (val) {
        val = val.replace("'", '"');
        this.$store.commit("SET_SCRIPT", val);
      },
    },
  },
  components: {
    JsonEditor,
    PythonEditor,
    CollectData,
    ParseData,
    SaveData,
  },
  watch: {
    blueprintTemplate(val) {
      // TODO for debug
      // console.log("in blueprint watch");
      // console.log(val);
      val;
    },
    currentTab(val) {
      //主要解决json editor 不会正常mounted的bug.
      if (val == 3) {
        this.jsonEditor.isShow = true;
      } else {
        this.jsonEditor.isShow = false;
      }
      if (val == 1) {
        this.pythonEditor.isShow = true;
      } else {
        this.pythonEditor.isShow = false;
      }
    },
  },
  data: () => ({
    isEditBlueprint: false,
    formatTitle: "",
    currentTab: 0,
    jsonEditor: {
      isShow: false,
      saveDisabled: false,
    },
    pythonEditor: {
      isShow: false,
    },
    metaValid: false,
    collectDataValid: false,
    nameRules: [
      (v) => !!v || "name is required",
      // (v) => v.length <= 10 || "Name must be less than 10 characters",
    ],
    tagRules: [
      (v) => !!v || "tag is required",
      // (v) => v.length <= 20 || "tag must be less than 20 characters",
    ],
  }),
  mounted() {
    this.initialize();
  },
  methods: {
    initialize() {
      let blueprint_id = this.blueprint_id;
      //判断query 中是否有blueprint_id, 如果有为编辑蓝图，如果没有为新建蓝图
      if (!blueprint_id) {
        this.initCreateBlueprint();
      } else {
        this.initEditBlueprint(blueprint_id);
      }
    },
    initCreateBlueprint() {
      this.formatTitle = "创建蓝图";
      this.isEditBlueprint = false;
      this.reset();
    },
    initEditBlueprint(blueprint_id) {
      this.formatTitle = "编辑蓝图";
      this.isEditBlueprint = true;
      //获取当前blueprint_id蓝图数据并绑定上去
      blueprintR(blueprint_id).then((res) => {
        let meta = {
          unique_name: res[0].name,
          create_time: res[0].create_time,
          tag: res[0].tag,
        };
        let template = JSON.parse(res[0].blueprint);
        this.$store.commit("UPDATE_META", meta);
        this.$store.commit("UPDATE_TEMPLATE", template);
      });
    },
    saveBlueprint() {
      //如果验证通过,创建或更新蓝图
      if (!this.$refs.metaForm.validate()) return;
      let blueprint_id = this.blueprint_id;
      if (blueprint_id) {
        //更新蓝图
        let data = Object.assign({}, this.blueprintMeta); //组装更新蓝图所需要的数据
        delete data.create_time;
        let blueprint = JSON.stringify(this.blueprintTemplate);
        data["blueprint"] = blueprint;
        blueprintsU(blueprint_id, data).then(() => {
          this.$toast.success("保存成功");
        });
      } else {
        //创建蓝图
        let data = Object.assign({}, this.blueprintMeta); //组装更新蓝图所需要的数据
        delete data.create_time; //蓝图中的时间是自动生成的，所以不用给这个数据
        let blueprint = JSON.stringify(this.blueprintTemplate);
        data["blueprint"] = blueprint;
        console.log(data);
        blueprintsC(data).then(() => {
          this.$toast.success("创建成功");
          this.$router.push("/blueprints");
        });
      }
    },
    deleteCollection() {
      // let unique_name = this.blueprintMeta.unique_name;
      collectionsR().then((res) => {
        let collection_id = "";
        let isAssembled = false;
        // 判断当前蓝图是否组装
        for (var i = 0; i < res.length; i++) {
          if (res[i].name === this.blueprintMeta.unique_name) {
            collection_id = res[i].collection_id;
            isAssembled = true;
            break;
          }
        }
        if (isAssembled) {
          collectionsD(collection_id).then(() => {
            this.$toast.warning("删除成功");
          });
        } else {
          this.$toast.error("并没有运行中的采集");
        }
      });
      // collectionsD().then();
      collectionsD;
    },
    assembleAndRun() {
      if (!this.$refs.metaForm.validate()) return;
      let blueprint_id = this.blueprint_id;
      if (blueprint_id) {
        //更新蓝图
        let data = Object.assign({}, this.blueprintMeta); //组装更新蓝图所需要的数据
        delete data.create_time;
        let blueprint = JSON.stringify(this.blueprintTemplate);
        data["blueprint"] = blueprint;
        blueprintsU(blueprint_id, data)
          .then(() => {})
          .then(() => {
            blueprintsA(blueprint_id).then((res) => {
              this.collection_id = res["collection"]["collection_id"];
              this.$toast.info("组装成功");
            });
            collectionsStart;
            // .then(() => {
            //   collectionsStart(this.collection_id).then(() => {
            //     this.$toast.info("组装并运行中");
            //   });
            // });
          });
      }
    },
    reset() {
      this.$store.commit("RESET_TEMPLATE");
      this.$store.commit("RESET_META");
    },
    changeEditorHeight(height) {
      this.editorHeight.current = height;
      this.$refs.jsonEditor.changeHeight();
    },
    jsonEditorSave() {
      let res = this.$refs.jsonEditor.getValue();
      this.$store.commit("UPDATE_TEMPLATE", res);
      console.log(res.tag);
      this.$store.commit("UPDATE_META", {
        unique_name: res.unique_name,
        tag: this.tag,
        create_time: this.create_time,
      });
    },
  },
};
</script>
<style lang="scss" scoped></style>
