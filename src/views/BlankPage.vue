<template>
  <div>
    <v-container fluid grid-list-xl page>
      <v-layout row wrap>
        <v-flex xs12 sm12 md12>
          <div class="nav">
            <ul>
              <li class="header">Flow</li>
              <li
                v-for="(item, index) in shapes"
                :key="item.id"
                @mouseenter="highlightFlow(item.id)"
                @mouseleave="unHighlightFlow(item.id)"
              >
                {{ item.title }}
                <v-icon @click="removeFlow(index)" class="close">close</v-icon>
              </li>
              <li class="header">Connection</li>
              <li
                v-for="(item, index) in line"
                :key="item.id"
                @mouseenter="highlightLine(index)"
                @mouseleave="unHighlightLine(index)"
              >
                Connection{{ index }}
                <v-icon @click="removeLine(index)" class="close">close</v-icon>
              </li>
            </ul>
          </div>
          <div
            id="div1"
            @drop="drop($event)"
            @dragover="allowDrop($event)"
            @click.stop="hideFooter($event)"
          >
            <vue-draggable-resizable
              v-for="item in shapes"
              :key="item.id"
              :min-width="100"
              :min-height="100"
              :w="100"
              :h="100"
              :x="item.x"
              :y="item.y"
              :class-name="item.data"
              class-name-handle="custom-handle"
              :id="`vdr${item.id}`"
              :parent="true"
              :grid="[20, 20]"
              @dragging="onDrag"
              @resizing="onResize"
              @activated="activated(item.id)"
              @deactivated="item.showCircle = false"
              :active="item.showFooter"
            >
              <div
                draggable="true"
                class="connect-arrow"
                @dragstart="drag($event)"
                id="drag"
                v-show="item.showCircle"
              ></div>
              <div
                class="content"
                :id="item.id"
                @drop="dropArrow(item.id, $event)"
                @dragover="allowDrop($event)"
              >
                <div :id="item.id" class="content__header">
                  <p>{{ item.title }}</p>
                </div>
                <div :id="item.id" class="content__description">
                  <p>{{ item.description }}</p>
                </div>
              </div>
            </vue-draggable-resizable>
          </div>
          <div
            v-for="footer in shapes"
            :key="footer.id"
            class="foot"
            v-show="footer.showFooter"
          >
            <v-icon class="close" @click="deActivated(footer.id)">close</v-icon>
            <div class="input">
              <label for="title">Title</label>
              <input
                v-model="footer.title"
                type="text"
                name="title"
                id="title"
                placeholder="Enter title text"
              />
            </div>
            <div class="input">
              <label for="desc">Description</label>
              <input
                v-model="footer.description"
                type="text"
                name="desc"
                id="desc"
                placeholder="Enter description text"
              />
            </div>
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
      showCircle: false,
      showFooter: false
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
      ev.dataTransfer.setData('text', 'foo');
      this.start = ev.target.parentNode.id;
    },
    allowDrop(ev) {
      ev.preventDefault();
    },
    dropArrow(id, ev) {
      this.shapes.forEach(shape => {
        shape.showFooter = false;
      });
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
            y: ev.offsetY,
            title: `Title${this.shapeCount}`,
            description: `Description${this.shapeCount}`,
            showFooter: false,
            showCircle: false
          });
          this.shapeCount += 1;
        }
      }
    },
    activated(id) {
      this.shapes.forEach(shape => {
        shape.showFooter = false;
      });
      this.shapes[id].showFooter = true;
      this.shapes[id].showCircle = true;
    },
    deActivated(id) {
      this.shapes[id].showFooter = false;
      this.shapes[id].showCircle = false;
    },
    hideFooter(e) {
      if (e.target.id == "div1") {
        this.shapes.forEach(shape => {
          shape.showFooter = false;
        });
      }
    },
    removeFlow(index) {
      this.shapes.splice(index, 1);
    },
    highlightFlow(id) {
      document.getElementById(id).classList.add("hover");
    },
    unHighlightFlow(id) {
      document.getElementById(id).classList.remove("hover");
    },
    highlightLine(index) {
      this.line[index].outline = true;
      this.line[index].outlineColor = 'red';
      this.line[index].outlineSize = '4';
    },
    unHighlightLine(index) {
      this.line[index].outline = false;
    },
    removeLine(index) {
      this.line[index].remove();
      this.line.splice(index, 1);
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
  left: 200px;
}
.nav {
  width: 200px;
  position: absolute;
  left: 0;
  bottom: 0;
  top: 0;
  background: #fff;
  box-shadow: 0px 2px 2px 0 rgba(0, 0, 0, 0.2);
}

.nav ul {
  padding: 0;
}

.nav li {
  list-style-type: none;
  margin: 20px 0;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

.nav li:hover {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 12px;
}

.content {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.content__header {
  background: #241d3b;
  text-align: center;
  font-weight: bold;
  color: #fff;
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
.foot {
  position: absolute;
  bottom: 0px;
  box-shadow: 0px 2px 2px 2px rgba(0, 0, 0, 0.2);
  left: 200px;
  right: 0;
  padding: 20px;
  background: #fff;
}

.foot .close,
.nav .close {
  position: absolute;
  right: 5px;
  top: 5px;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  background: #241d3b;
  color: #fff;
  cursor: pointer;
}

.nav .close {
  top: 10px;
  width: 20px;
  height: 20px;
}

.input {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.input input {
  border: 1px solid #241d3b;
  padding: 5px 20px;
  width: 80%;
  border-radius: 5px;
}

.hover {
  border: 1.5px solid red;
}
</style>
