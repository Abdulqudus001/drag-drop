<template>
  <div class="canvas" id="canvas" @scroll="positionLine">
    <div class="nav">
      <ul>
        <li id="audio" draggable="true" @dragstart="dragFlow($event)">Audio</li>
        <li id="menu" draggable="true" @dragstart="dragFlow($event)">Menu</li>
        <li id="dial" draggable="true" @dragstart="dragFlow($event)">Dial</li>
        <li id="crm" draggable="true" @dragstart="dragFlow($event)">CRM</li>
        <li id="validation" draggable="true" @dragstart="dragFlow($event)">
          Validation
        </li>
        <li id="trigger" draggable="true" @dragstart="dragFlow($event)">
          Trigger
        </li>
      </ul>
    </div>
    <div
      id="div1"
      @drop="drop($event)"
      @dragover="allowDrop($event)"
      @click.stop="hideFooter($event)"
    >
      <slot name="flow"></slot>
      <vue-draggable-resizable
        v-for="(item, index) in shapes"
        :key="item.id"
        :min-width="120"
        :min-height="120"
        :w="120"
        :h="120"
        :x="item.x"
        :y="item.y"
        class-name="flow"
        class-name-handle="custom-handle"
        :id="`vdr${item.id}`"
        :draggable="item.draggable"
        :parent="true"
        :grid="[20, 20]"
        @dragging="positionLine"
        @resizing="positionLine"
        @activated="activated(index)"
        @deactivated="item.showCircle = false"
        :active="item.showFooter"
      >
        <div
          draggable="true"
          class="connect-arrow"
          @dragstart.stop="drag($event, index)"
          @mouseenter="disableDrag"
          @mouseleave="enableDrag"
          id="drag"
          v-show="item.showCircle"
        ></div>
        <div
          class="content"
          :id="item.id"
          @drop="dropArrow(item.id, $event, index)"
          @dragover="allowDrop($event)"
        >
          <div :id="item.id" class="content__header">
            <p>{{ item.title }}</p>
            <v-icon @click.stop="removeFlow(index)">close</v-icon>
          </div>
          <div :id="item.id" class="content__description">
            <v-icon>{{ icon[`${item.data}`] }}</v-icon>
            <p>{{ item.name }}</p>
          </div>
        </div>
      </vue-draggable-resizable>
    </div>
    <v-btn fixed fab class="zoom-in" @click.stop="zoomIn">
      <v-icon light>add</v-icon>
    </v-btn>
    <v-btn fixed fab class="zoom-out" @click.stop="zoomOut">
      <v-icon light>mdi-minus</v-icon>
    </v-btn>
    <div
      v-for="(footer, index) in shapes"
      :key="footer.id"
      class="foot"
      v-show="footer.showFooter"
    >
      <v-icon class="close" @click="deActivated(index)">close</v-icon>
      <v-tabs>
        <v-tab>General</v-tab>
        <v-tab>Settings</v-tab>
        <v-tab-item>
          <div v-show="footer.data == 'dial'">
            <div class="input">
              <label for="dial-type">Connection</label>
              <multi-select
                id="dial-type"
                :options="dialTypes"
                v-model="footer.model.dialType"
                placeholder="Select Dial Type"
              ></multi-select>
            </div>
            <div class="input">
              <label for="queue">Queue Type</label>
              <multi-select
                id="queue"
                :options="queueTypes"
                v-model="footer.model.queueType"
                placeholder="Select type"
              ></multi-select>
            </div>
            <div class="input">
              <label for="caller">DID</label>
              <input
                v-model="footer.model.callerId"
                type="text"
                name="caller"
                id="caller"
                placeholder="Phone Number"
              />
            </div>
          </div>
          <div v-show="footer.data == 'trigger'">
            <div class="input">
              <label for="connection">Connection</label>
              <multi-select
                id="connection"
                :options="connections"
                v-model="footer.model.connection"
                placeholder="Select Connection"
              ></multi-select>
            </div>
            <div class="input">
              <label for="type">Type</label>
              <multi-select
                id="type"
                :options="type"
                v-model="footer.model.type"
                placeholder="Select type"
              ></multi-select>
            </div>
            <div class="input">
              <label for="desc">DID</label>
              <input
                v-model="footer.model.did"
                type="text"
                name="desc"
                id="desc"
                placeholder="DID"
              />
            </div>
          </div>
          <div v-show="footer.data == 'validation'">
            <div class="input">
              <label for="validation">Expression</label>
              <textarea
                placeholder="Enter description text"
                v-model="footer.model.expression"
                name="validation"
                id="validation"
                cols="44"
                rows="5"
              ></textarea>
            </div>
          </div>
          <div v-show="footer.data == 'audio'">
            <v-container grid-list-md>
              <v-layout row wrap>
                <v-flex sm7>
                  <div class="input">
                    <label for="file">Audio File</label>
                    <input
                      @change="addFile"
                      type="file"
                      name="file"
                      id="file"
                    />
                  </div>
                </v-flex>
                <v-flex sm5>
                  <div class="input">
                    <label for="timeout">Timeout</label>
                    <input
                      v-model.number="footer.model.timeout"
                      type="number"
                      name="timeout"
                      id="timeout"
                      placeholder=""
                    />
                    seconds
                  </div>
                </v-flex>
                <v-flex sm7>
                  <v-layout row wrap>
                    <v-flex sm6>
                      <v-checkbox
                        v-model="footer.model.skip"
                        label="Skip on DTMF"
                      ></v-checkbox>
                    </v-flex>
                    <v-flex sm6>
                      <v-checkbox
                        v-model="footer.model.expect"
                        label="Expect DTMF"
                      ></v-checkbox>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex sm5>
                  <div class="input">
                    <label for="repeat">Repeat</label>
                    <input
                      v-model.number="footer.model.repeat"
                      type="number"
                      name="repeat"
                      id="repeat"
                    />
                    times
                  </div>
                </v-flex>
              </v-layout>
            </v-container>
          </div>
          <div v-show="footer.data == 'menu'">
            <v-container grid-list-md>
              <v-layout row wrap>
                <v-flex sm10 class="menu-header">
                  <v-layout>
                    <v-flex sm4>Value</v-flex>
                    <v-flex sm6>Action</v-flex>
                    <v-flex sm2><v-icon>add</v-icon></v-flex>
                  </v-layout>
                </v-flex>
                <v-flex sm10 class="menu-item">
                  <v-layout v-for="menu in footer.model" :key="menu.id">
                    <v-flex sm4>
                      <input
                        class="menu-value"
                        v-model.number="menu.value"
                        type="number"
                        name=""
                        id=""
                      />
                    </v-flex>
                    <v-flex sm6>
                      <multi-select
                        :options="menuItems"
                        v-model="menu.action"
                      ></multi-select>
                    </v-flex>
                    <v-flex sm2
                      ><v-icon>indeterminate_check_box</v-icon></v-flex
                    >
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-container>
          </div>
        </v-tab-item>
        <v-tab-item>
          <div class="input">
            <label for="title">Title</label>
            <input
              v-model="footer.name"
              type="text"
              name="title"
              id="title"
              placeholder="Enter title text"
            />
          </div>
          <div class="input">
            <label for="desc">Description</label>
            <textarea
              placeholder="Enter description text"
              v-model="footer.description"
              name="desc"
              id="desc"
              cols="44"
              rows="5"
            ></textarea>
          </div>
        </v-tab-item>
      </v-tabs>
    </div>
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
      icon: {
        dial: "call",
        audio: "fa-volume-up",
        trigger: "bolt",
        validation: "crop_square",
        menu: "fa-th"
      },
      options: {
        dial: {
          dialType: "",
          queueType: "",
          callerId: ""
        },
        audio: {
          audioFile: {},
          timeout: "",
          repeat: "",
          skip: false,
          expect: true
        },
        trigger: {
          connection: "",
          type: "",
          did: ""
        },
        validation: {
          expression: ""
        },
        menu: [
          {
            id: 0,
            value: "1",
            action: ""
          },
          {
            id: 1,
            value: "2",
            action: ""
          }
        ]
      },
      menuItems: ["Playback Audio1", "Playback Audio1", "Dial queue"],
      connections: ["option", "option"],
      type: ["inbound", "outbound"],
      dialTypes: ["Queue", "Queue"],
      queueTypes: ["Queue1", "Queue2"],
      shapeCount: 1,
      shapes: [
        {
          id: `trigger0`,
          data: "trigger",
          name: "trigger",
          x: 45,
          y: 18,
          title: "Trigger",
          description: "Description",
          draggable: true,
          showFooter: false,
          showCircle: false,
          model: {
            connection: "",
            type: "",
            did: ""
          }
        }
      ],
      line: [],
      start: "",
      end: "",
      showCircle: false,
      showFooter: false,
      zoom: ""
    };
  },
  methods: {
    positionLine() {
      if (this.line) {
        this.line.forEach(line => {
          line.position();
        });
      }
    },
    addFile(event, index) {
      let selectedFile = event.target.files[0];
      this.shapes[index].model.audioFile = selectedFile;
    },
    dragFlow(ev) {
      ev.dataTransfer.setData("text/html", ev.target.id);
    },
    disableDrag() {
      this.shapes.forEach(shape => {
        shape.draggable = false;
      });
    },
    enableDrag() {
      this.shapes.forEach(shape => {
        shape.draggable = true;
      });
    },
    drag(ev) {
      ev.stopPropagation();
      ev.dataTransfer.setData("text", "foo");
      this.start = ev.target.parentNode.id;
    },
    allowDrop(ev) {
      ev.preventDefault();
    },
    dropArrow(id, ev, index) {
      // this.shapes[index].draggable = true;
      this.shapes.forEach(shape => {
        shape.showFooter = false;
        shape.draggable = true;
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
      this.line.splice(index, 1, line);
      let div = document.querySelector("#div1");
      let lines = document.querySelectorAll(".leader-line");
      lines.forEach(line => {
        line.style.zoom = div.style.zoom;
      });
    },
    drop(ev) {
      const zoom = document.getElementById("div1").style.zoom || 100;
      const zoomInt = parseInt(zoom) / 100;
      ev.preventDefault();
      if (ev.target.id != "drag") {
        var data = ev.dataTransfer.getData("text/html");
        if (data) {
          this.shapes.push({
            id: `${data}${this.shapeCount}`,
            data: data,
            name: data,
            x: ev.offsetX / zoomInt,
            y: ev.offsetY / zoomInt,
            title: `${data.toUpperCase()}`,
            draggable: true,
            description: "Description",
            showFooter: false,
            showCircle: false,
            model: { ...this.options[data] }
          });
          this.shapeCount += 1;
        }
      }
    },
    activated(id) {
      this.shapes.forEach(shape => {
        shape.showFooter = false;
      });

      // this.shapes[id].showFooter = true;
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
      this.line[index].outlineColor = "red";
      this.line[index].outlineSize = "4";
    },
    unHighlightLine(index) {
      this.line[index].outline = false;
    },
    removeLine(index) {
      this.line[index].remove();
      this.line.splice(index, 1);
    },
    zoomIn() {
      let div = document.querySelector("#div1");
      let zoom = document.querySelector("#div1").style.zoom;
      // Zoom the connector
      let lines = document.querySelectorAll(".leader-line");
      if (zoom == "50%") {
        div.style.margin = "0 auto";
      }
      if (!zoom) {
        div.style.zoom = "100%";
        if (lines) {
          lines.forEach(line => {
            line.style.zoom = "100%";
          });
        }
      }
      if (parseInt(zoom) >= 30) {
        div.style.zoom = `${parseInt(div.style.zoom) + 10}%`;
        if (lines) {
          lines.forEach(line => {
            line.style.zoom = `${parseInt(line.style.zoom) + 10}%`;
          });
        }
        this.line.forEach(line => {
          line.position();
        });
      }
    },
    zoomOut() {
      // Zoom the connector
      let lines = document.querySelectorAll(".leader-line");
      let div = document.querySelector("#div1");
      let zoom = document.querySelector("#div1").style.zoom;
      if (zoom == "50%") {
        div.style.margin = "0 auto";
      }
      if (!zoom) {
        div.style.zoom = "100%";
        if (lines) {
          lines.forEach(line => {
            line.style.zoom = "100%";
          });
        }
      }
      if (zoom != "30%") {
        div.style.zoom = `${parseInt(div.style.zoom) - 10}%`;
        if (lines) {
          lines.forEach(line => {
            line.style.zoom = `${parseInt(line.style.zoom) - 10}%`;
          });
        }
        this.line.forEach(line => {
          line.position();
        });
      }
    }
  }
};
</script>

<style>
.canvas {
  overflow: auto;
  overflow-y: auto;
}
.multiselect {
  width: 60%;
}
#div1 {
  width: 1600px;
  height: 1600px;
  /* max-width: calc(100% - 200px); */
  min-height: calc(100vh - 100px);
  position: relative;
  left: 200px;
  overflow: auto;
  background-image: linear-gradient(
      0deg,
      transparent 24%,
      rgba(0, 0, 0, 0.1) 25%,
      rgba(0, 0, 0, 0.1) 26%,
      transparent 27%,
      transparent 74%,
      rgba(0, 0, 0, 0.1) 75%,
      rgba(0, 0, 0, 0.1) 76%,
      transparent 77%,
      transparent
    ),
    linear-gradient(
      90deg,
      transparent 24%,
      rgba(0, 0, 0, 0.1) 25%,
      rgba(0, 0, 0, 0.1) 26%,
      transparent 27%,
      transparent 74%,
      rgba(0, 0, 0, 0.1) 75%,
      rgba(0, 0, 0, 0.1) 76%,
      transparent 77%,
      transparent
    );
  background-repeat: repeat;
  background-size: 2% 2%;
}
.nav {
  width: 200px;
  z-index: 2;
  position: fixed;
  margin-left: -25px;
  bottom: 0;
  top: 65px;
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow-y: auto;
}

.content__header p,
.content__description p {
  margin: 0;
  word-break: break-word;
}

.content__header i {
  color: #fff !important;
  cursor: pointer;
}

.content__description {
  display: flex;
  align-items: center;
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
  z-index: 2;
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
  margin: 10px;
  align-items: center;
}

.input label {
  min-width: 16%;
  margin-right: 10px;
}

.input input,
.menu-value {
  border: 1px solid #e8e8e8;
  padding: 5px 20px;
  width: 60%;
  border-radius: 5px;
  color: #35495e;
  outline: none;
}

.input textarea {
  border: 1px solid #e8e8e8;
  border-radius: 5px;
  padding: 5px 20px;
  color: #35495e;
  outline: none;
}

.menu-header {
  background: rgba(36, 29, 59, 0.3);
}

.hover {
  border: 1.5px solid red;
}
.controls {
  position: fixed;
  display: flex;
  bottom: 10px;
  right: 0px;
}
.controls i {
  display: block;
  color: #fff !important;
  background: #424242;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  text-align: center;
  padding: 10px 0;
  margin: 10px 0;
}

.zoom-in,
.zoom-out {
  top: 90%;
  width: 40px;
  height: 40px;
}

.zoom-in {
  right: 50px;
}

.zoom-out {
  right: 0;
}
.flow {
  border: 1px solid #373737;
  position: relative;
}
</style>
