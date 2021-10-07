<template>
  <div class="json-editor">
    <textarea ref="textarea" />
  </div>
</template>
<script>
import CodeMirror from "codemirror";
import "codemirror/addon/lint/lint.css";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
require("script-loader!jsonlint");
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/lint/lint";
import "codemirror/addon/lint/json-lint";

export default {
  name: "monitor",
  /* eslint-disable vue/require-prop-types */
  props: ["value"],
  data() {
    return {
      jsonEditor: false,
    };
  },
  watch: {
    value(value) {
      const editorValue = this.jsonEditor.getValue();
      if (value !== editorValue) {
        this.jsonEditor.setValue(JSON.stringify(this.value, null, 2));
      }
    },
  },
  mounted() {
    // CodeMirror.fromTextArea()中第一个参数是DOM元素，而且必须是textarea元素；第二个参数是可选配置项
    this.jsonEditor = CodeMirror.fromTextArea(this.$refs.textarea, {
      lineNumbers: true,
      mode: "application/json",
      gutters: ["CodeMirror-lint-markers"],
      theme: "material",
      lint: true,
    });

    this.jsonEditor.setValue(JSON.stringify(this.value, null, 2));
    this.jsonEditor.on("change", (cm) => {
      this.$emit("changed", cm.getValue());
      this.$emit("input", cm.getValue());
    });
  },
  methods: {
    getValue() {
      return JSON.parse(this.jsonEditor.getValue());
    },
  },
};
</script>

<style lang="scss" scoped>
$editor-height: 600px;
$font-size: 12px;
.json-editor {
  position: relative;
  font-size: $font-size;
  ::v-deep .CodeMirror {
    height: $editor-height;
  }
  ::v-deep .CodeMirror-scroll {
    height: $editor-height;
  }
}
</style>
