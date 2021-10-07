<template>
  <div class="json-editor">
    <textarea ref="textarea" />
  </div>
</template>
<script>
import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/python/python";

export default {
  name: "PythonEditor",
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
        this.jsonEditor.setValue(this.value);
      }
    },
  },
  mounted() {
    // CodeMirror.fromTextArea()中第一个参数是DOM元素，而且必须是textarea元素；第二个参数是可选配置项
    this.jsonEditor = CodeMirror.fromTextArea(this.$refs.textarea, {
      lineNumbers: true,
      mode: "python",
      indentUnit: 4,
      theme: "material",
    });

    this.jsonEditor.setValue(this.value);
    this.jsonEditor.on("change", (cm) => {
      this.$emit("changed", cm.getValue());
      this.$emit("input", cm.getValue());
    });
  },
  methods: {
    // not implemented.
    changeHeight() {},
    getValue() {
      return JSON.parse(this.jsonEditor.getValue());
    },
  },
};
</script>

<style lang="scss" scoped>
$editor-height: 550px;
$font-size: 16px;
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
