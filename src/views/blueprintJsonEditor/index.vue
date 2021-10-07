<template>
  <div class="blueprint-json-editor-container">
    <json-editor ref="jsonEditor" v-model="bp" />
  </div>
</template>

<script>
import JsonEditor from "@/components/json-editor";
export default {
  name: "blueprint-json-editor",
  components: {
    JsonEditor,
  },
};
</script>
