<template>
  <div>
    <v-container fluid grid-list-xl page>
      <v-layout row wrap>
        <v-flex xs12 sm12 md12>
          <app-canvas
            v-for="canvas in flows"
            :key="canvas"
            :flow="flow"
            v-show="canvas == flow"
            @addLine="addLine"
            @removeLine="removeLine"
            :lines="lines"
            :showJSON="showJSON"
            >{{ canvas }}</app-canvas
          >
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
// eslint-disable-next-line
import VueDraggableResizable from "vue-draggable-resizable";
import AppCanvas from "./canvas";
export default {
  components: { AppCanvas },
  props: {
    flows: {
      type: Array
    },
    flow: {
      type: String,
      default: "Flow 1"
    },
    showJSON: {
      type: Boolean
    }
  },
  data() {
    return {
      page: {
        title: "Blank Page",
        headline: "Black Page",
        description: `A blank page is good to quick-start from scratch.`
      },
      breadcrumbs: [
        {
          text: "Src",
          disabled: false
        },
        {
          text: "Views",
          disabled: false
        },
        {
          text: "Blank",
          disabled: false
        }
      ],
      lines: []
    };
  },
  methods: {
    addLine(lines) {
      this.lines = [...this.lines, ...lines];
      this.lines = [...new Set(this.lines)];
    },
    removeLine(index) {
      this.lines.splice(index, 1);
    }
  }
};
</script>

<style></style>
