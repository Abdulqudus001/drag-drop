<template>
  <div>
    <section-definition
      :title="page.title"
      :breadcrumbs="breadcrumbs"
    ></section-definition>
    <v-container fluid grid-list-xl page>
      <v-layout row wrap>
        <v-flex xs12 sm8 md12>
          <div id="div1" @drop="drop($event)" @dragover="allowDrop($event)">
            <vue-draggable-resizable
              v-for="item in shapes"
              :key="item.id"
              :min-width="60"
              :min-height="60"
              :w="60"
              :h="60"
              :x="item.x"
              :y="item.y"
              :class-name="item.data"
              :id="`vdr${item.id}`"
              :parent="true"
              :grid="[20, 20]"
              @dragging="onDrag"
              @resizing="onResize"
              @activated="showCircle = true"
              @deactivated="showCircle = false"
            >
              <div
                draggable="true"
                class="connect-arrow"
                @dragstart="drag($event)"
                @drop="dropArrow(item.id, $event)"
                @dragover="allowDrop($event)"
                id="drag"
                v-show="showCircle"
              ></div>
            </vue-draggable-resizable>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
// eslint-disable-next-line
import VueDraggableResizable from "vue-draggable-resizable";
export default {
  data() {
    return {
      width: 60,
      height: 60,
      x: 0,
      y: 0,
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
      shapeCount: 0,
      shapes: [],
      line: [],
      start: "",
      end: "",
      showCircle: false
    };
  },
  methods: {
    onResize() {
      if (this.line) {
        this.line.forEach(line => {
          line.position();
        });
      }
    },
    onDrag() {
      if (this.line) {
        this.line.forEach(line => {
          line.position();
        });
      }
    },
    drag(ev) {
      ev.stopPropagation();
      this.start = ev.target.parentNode.id;
    },
    allowDrop(ev) {
      ev.preventDefault();
    },
    dropArrow(id, ev) {
      ev.preventDefault();
      this.end = ev.target.parentNode.id;
      let line = new window.LeaderLine(
        document.getElementById(this.start),
        document.getElementById(this.end),
        {
          path: "grid",
          color: "#000",
          endPlus: "arrow3",
          size: 2
        }
      );
      this.line.splice(id, 1, line);
    },
    drop(ev) {
      ev.preventDefault();
      if (ev.target.id != "drag") {
        var data = ev.dataTransfer.getData("text/html");
        if (data) {
          this.shapes.push({
            id: this.shapeCount,
            data: data,
            x: ev.offsetX,
            y: ev.offsetY
          });
          this.shapeCount += 1;
        }
      }
    }
  }
};
</script>

<style>
#div1 {
  width: 800px;
  max-width: 100%;
  height: 500px;
  position: relative;
}
.square,
.circle,
.rect {
  border: 1px solid #373737;
  position: relative;
}
.circle {
  border-radius: 50%;
}
.rect {
  border-radius: 15%;
}
.connect-arrow {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  left: 50%;
  margin-left: -15px;
  top: -25px;
  border-radius: 50%;
}
.connect-arrow::after {
  content: "";
  width: 10px;
  height: 10px;
  border: 1px solid #373737;
  border-radius: 50%;
  position: relative;
  top: 0px;
}
.custom-handle {
  display: block;
  position: absolute;
  height: 10px;
  width: 10px;
  border: 1px solid black;
  -webkit-transition: all 300ms linear;
  -ms-transition: all 300ms linear;
  transition: all 300ms linear;
}

.custom-handle-tl {
  top: -10px;
  left: -10px;
  cursor: nw-resize;
}

.custom-handle-tm {
  /* background-color: pink; */
  border: none;
  border-radius: 50%;
  top: -10px;
  left: 50%;
  margin-left: -7px;
  cursor: none;
  display: none;
}

.custom-handle-tr {
  top: -10px;
  right: -10px;
  cursor: ne-resize;
}

.custom-handle-ml {
  top: 50%;
  margin-top: -7px;
  left: -10px;
  cursor: w-resize;
}

.custom-handle-mr {
  top: 50%;
  margin-top: -7px;
  right: -10px;
  cursor: e-resize;
}

.custom-handle-bl {
  bottom: -10px;
  left: -10px;
  cursor: sw-resize;
}

.custom-handle-bm {
  bottom: -10px;
  left: 50%;
  margin-left: -7px;
  cursor: s-resize;
}

.custom-handle-br {
  bottom: -10px;
  right: -10px;
  cursor: se-resize;
}
</style>
