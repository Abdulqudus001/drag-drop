<template>
  <div class="json">
    <vue-json :path="'res'" :data="json" />
  </div>
</template>

<script>
import VueJson from "vue-json-pretty";
export default {
  components: { VueJson },
  props: ["json"]
};
</script>

<style>
.json {
  position: fixed;
  top: 69px;
  left: 200px;
  right: 0;
  bottom: 0;
  background: #fff;
  z-index: 3;
  overflow-y: auto;
}
</style>
