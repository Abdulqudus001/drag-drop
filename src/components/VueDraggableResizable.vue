<template>
  <vue-draggable-resizable
    @dragging="onDrag"
    @resizing="onResize"
    :w="width"
    :h="height"
    class-name="v-drag"
    id="vdr"
    class-name-handle="v-handle"
  >
    <slot></slot>
  </vue-draggable-resizable>
</template>
<script>
//eslint-disable-next-line
import VueDraggableResizable from "vue-draggable-resizable";
export default {
  data: () => ({
    width: 60,
    height: 60,
    x: 0,
    y: 0
  }),
  methods: {
    onResize: function(x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
    },
    onDrag: function(x, y) {
      this.x = x;
      this.y = y;
    }
  }
};
</script>
<style scoped>
.v-drag {
  display: none;
  border: 1px solid #373737;
  background: #fff;
}
.v-handle {
  /* display: none; */
}
</style>
