<template>
  <v-navigation-drawer
    class="pb-0 vuse-sidebar google-material"
    :class="[
      navDrawerAlphaMod ? 'alpha' : '',
      navDrawerScheme,
      navDrawerVariant ? 'google-material-effect' : ''
    ]"
    persistent
    fixed
    width="200"
    :mini-variant.sync="navMiniVarient"
    :clipped="true"
    v-model="drawer"
    :left="navDrawerPosition === 'left'"
    :right="navDrawerPosition === 'right'"
    enable-resize-watcher
    hide-overlay
    floating
    id="app-drawer"
    app
    dark
  >
    <!-- Drawer Toolbar -->
    <!-- <v-toolbar flat class="text-xs-center z-index-2">
      <v-list>
        <v-list-tile>
          <v-list-tile-avatar>
            <img :src="logo" />
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title class="headline">Vuse Admin</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-toolbar> -->
    <!-- Drawer Items -->
    <v-list dense="dense" expand="expand" class="nav-drawer" id="app-sidebar">
      <template v-for="(item, i) in items">
        <!--group with subitems-->
        <v-list-group
          v-if="item.items"
          :group="item.group"
          :prepend-icon="item.icon"
          no-action
          :key="`${i}-item`"
          active-class="act-menu"
        >
          <v-list-tile slot="activator" ripple>
            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <template v-for="(subItem, i) in item.items">
            <!--sub group-->
            <v-list-group
              v-if="subItem.items"
              :group="subItem.group"
              sub-group
              :key="`${i}-subitems`"
            >
              <v-list-tile
                slot="activator"
                ripple
                class="list__tile-inner-group"
              >
                <v-list-tile-action v-if="subItem.icon">
                  <v-icon>{{ subItem.icon }}</v-icon>
                </v-list-tile-action>
                <v-list-tile-action v-else>
                  <v-avatar size="28">
                    <span>{{ subItem.title | first2Char }}</span>
                  </v-avatar>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>{{ subItem.title }}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile
                v-for="(grand, i) in subItem.items"
                :key="i"
                :to="genChildTarget(item, grand)"
                :href="grand.href"
                ripple
              >
                <v-list-tile-action v-if="grand.icon">
                  <v-icon>{{ grand.icon }}</v-icon>
                </v-list-tile-action>
                <v-list-tile-action v-else>
                  <v-avatar size="28">
                    <span>{{ grand.title | first2Char }}</span>
                  </v-avatar>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>{{ grand.title }}</v-list-tile-title>
                </v-list-tile-content>
                <v-chip
                  v-if="grand.badge"
                  color="primary"
                  disabled
                  class="white--text pa-0 chip--x-small"
                  >{{ grand.badge }}</v-chip
                >
              </v-list-tile>
            </v-list-group>

            <!--child item-->
            <v-list-tile
              v-else
              :key="i"
              :to="genChildTarget(item, subItem)"
              :href="subItem.href"
              :disabled="subItem.disabled"
              :target="subItem.target"
              ripple
            >
              <v-list-tile-action>
                <v-icon v-if="subItem.prependIcon">{{
                  subItem.prependIcon
                }}</v-icon>
                <v-avatar size="28" v-else>
                  <span>{{ subItem.title | first2Char }}</span>
                </v-avatar>
              </v-list-tile-action>
              <v-list-tile-content class>
                <v-list-tile-title>
                  <span>{{ subItem.title }}</span>
                </v-list-tile-title>
              </v-list-tile-content>
              <v-chip
                v-if="subItem.badge"
                color="primary"
                disabled
                class="white--text pa-0 chip--x-small"
                >{{ subItem.badge }}</v-chip
              >
              <v-list-tile-action v-if="subItem.action">
                <v-icon :class="[subItem.actionClass || 'success--text']">{{
                  subItem.action
                }}</v-icon>
              </v-list-tile-action>
            </v-list-tile>
          </template>
        </v-list-group>
        <v-subheader
          v-else-if="item.header"
          class="heading-text"
          :key="`${i}-item`"
          :class="[i !== 0 ? 'mt-3' : '']"
          >{{ item.header }}</v-subheader
        >
        <v-divider v-else-if="item.divider" :key="`${i}-item`"></v-divider>
        <!--top-level link-->
        <v-list-tile
          v-else
          :to="!item.href ? { name: item.name } : null"
          :href="item.href"
          ripple
          :disabled="item.disabled"
          :target="item.target"
          rel="noopener"
          :key="`${i}-item`"
          class="list__tile-solo"
        >
          <v-list-tile-action>
            <v-icon v-if="item.icon">{{ item.icon }}</v-icon>
            <v-avatar size="28" v-else>
              <span>{{ item.title | first2Char }}</span>
            </v-avatar>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
          <v-chip
            v-if="item.badge"
            :color="item.color || 'primary'"
            disabled
            class="white--text pa-0 chip--x-small"
            >{{ item.badge }}</v-chip
          >
          <v-list-tile-action v-if="item.subAction">
            <v-icon class="success--text">{{ item.subAction }}</v-icon>
          </v-list-tile-action>
          <v-chip
            v-else-if="item.chip"
            label="label"
            small="small"
            class="caption blue lighten-2 white--text mx-0"
            >{{ item.chip }}</v-chip
          >
        </v-list-tile>
      </template>
      <!-- <v-spacer class="mb-5"></v-spacer> -->
      <div class="flows">
        <ul>
          <li class="flows__title">
            <p>Add flow</p>
            <v-btn fab flat class="fab" @click="addFlow">
              <v-icon color="#000">add</v-icon>
            </v-btn>
          </li>
          <li
            class="flow"
            :id="`flow${index}`"
            v-for="(flow, index) in flows"
            :key="flow"
            @click="changeFlow(flow, index)"
          >
            {{ flow }}
            <v-btn fab flat class="flow-fab" @click.stop="removeFlow(index)">
              <v-icon color="#000">close</v-icon>
            </v-btn>
          </li>
        </ul>
      </div>
    </v-list>
    <div
      class="sidebar-background"
      :style="{ 'background-image': `url(${navDrawerAlphaImg})` }"
    ></div>
  </v-navigation-drawer>
</template>
<script>
import { mapGetters } from "vuex";
import appDrawerItems from "@/data/app-drawer-items";
import { camel } from "@/utils/helpers";

export default {
  data() {
    return {
      flows: ["Flow 1"],
      count: 1,
      items: appDrawerItems,
      dark: false,
      logo: "/static/vuse-circle-white.svg"
    };
  },
  mounted() {
    const ps = document.getElementById("app-drawer");
    ps.addEventListener("mouseenter", this.miniEnterVariantHandler);
    ps.addEventListener("mouseleave", this.miniLeaveVariantHandler);
  },
  beforeDestroy() {
    const ps = document.getElementById("app-drawer");
    if (ps) {
      ps.removeEventListener("mouseenter", this.miniEnterVariantHandler);
      ps.removeEventListener("mouseleave", this.miniVariantHandler);
    }
  },
  computed: {
    ...mapGetters({
      clipped: "navClipped",
      navDrawer: "navDrawer",
      navMiniVarient: "navMiniVarient",
      navDrawerPosition: "navDrawerPosition",
      navDrawerScheme: "navDrawerScheme",
      navDrawerAlphaMod: "navDrawerAlphaMod",
      navDrawerAlphaImg: "navDrawerAlphaImg",
      navDrawerVariant: "navDrawerVariant",
      fixedFooter: "fixedFooter",
      showFooter: "showFooter",
      miniview: "miniview"
    }),
    activemenu() {
      return this.$vuetify.theme.activemenu;
    },
    drawer: {
      get() {
        return this.navDrawer;
      },
      set(value) {
        this.$store.dispatch("toggleDrawer", value);
      }
    }
  },
  methods: {
    addFlow() {
      this.flows.push(`Flow ${this.flows.length + 1}`);
      this.count++;
    },
    changeFlow(flow, id) {
      document.querySelectorAll(".flow").forEach(node => {
        node.classList.remove("selected");
      });
      document.querySelector(`#flow${id}`).classList.add("selected");
      this.$emit("changeFlow", [this.flows, flow]);
    },
    removeFlow(index) {
      this.flows.splice(index, 1);
      this.flows = this.flows.map((flow, index) => {
        return `Flow ${index + 1}`;
      });
      this.changeFlow(this.flows[0], 0);
    },
    drag(ev) {
      ev.dataTransfer.setData("text/html", ev.target.id);
    },
    miniEnterVariantHandler() {
      // if it's tab or small devive then it won't listen this event
      if (
        this.miniview &&
        this.navMiniVarient === true &&
        this.$vuetify.breakpoint.mdAndDown === false
      ) {
        this.$store.dispatch("toggleMiniVarient", false);
        // const container = document.querySelector('#app-sidebar')
        // container.scrollTop = 0
      }
    },
    miniLeaveVariantHandler() {
      // if it's tab or small devive then it won't listen this event
      if (
        this.miniview &&
        this.navMiniVarient === false &&
        this.$vuetify.breakpoint.mdAndDown === false
      ) {
        this.$store.dispatch("toggleMiniVarient", true);
        // const container = document.querySelector('#app-sidebar')
        // container.scrollTop = 0
      }
    },
    genChildTarget(item, subItem) {
      if (subItem.href) return;
      if (item.component) {
        return {
          name: item.component,
          params: {
            section: item.group,
            component: subItem.name
          }
        };
      }
      // console.log(`Sidebar:`)
      // console.log({ name: `${item.group}/${camel(subItem.name)}` })
      return { name: `${item.group}/${camel(subItem.name)}` };
    }
  }
};
</script>
<style scoped>
.shapes {
  width: calc(100% - 10px);
  height: 300px;
  margin: 0 6px;
  overflow-y: auto;
  background: #fff;
  border: 1px solid;
  display: flex;
  flex-flow: row wrap;
  padding: 10px;
}
.shapes div {
  width: 60px;
  height: 60px;
  margin: 0 5px;
}
.square,
.circle,
.rect {
  border: 1px solid #373737;
}
.circle {
  border-radius: 50%;
}
.rect {
  border-radius: 15%;
}
.flows ul {
  list-style-type: none;
  color: #000;
  padding: 0;
}
.flows__title {
  font-size: 1.2rem;
  font-weight: bold;
  text-transform: uppercase;
}
.flow {
  cursor: pointer;
  transition: all 0.2s;
}
.flows ul li {
  margin: 15px 0;
  display: flex;
  color: #000;
  align-items: center;
  justify-content: space-between;
  outline: none;
  border: none;
  padding: 0 20px;
  border-bottom: 1px solid #000;
  border-radius: 0;
}

.flow:hover {
  background: rgba(255, 255, 255, 0.1);
  /* border: 1px solid rgba(0, 0, 0, 0.1); */
  border-radius: 5px;
}

.flow.selected {
  background: rgba(255, 255, 255, 0.1);
  /* border: 1px solid rgba(0, 0, 0, 0.1); */
  border-radius: 5px;
  font-weight: bold;
}

.flows p {
  margin: 0;
}
.fab {
  width: 30px;
  height: 30px;
}

.flow-fab {
  width: 20px;
  height: 20px;
}

.flow-fab i {
  font-size: 16px;
}

.fab i,
.flow-fab i {
  color: #000 !important;
}
</style>
<style scoped lang="stylus">
// .no-overflow
// overflow: hidden
#app-drawer {
  img.logo {
    margin: 40px 0 15px;
  }

  .chip--x-small {
    font-size: 10px;
    height: 16px;

    .chip__content {
      line-height: 1;
      padding: 8px;
    }
  }

  .diamond-sponsor {
    // todo trim down actual image file dimensions
    height: 35px;
    margin-bottom: 0.25em;

    aside.navigation-drawer ul li {
      font-size: 14px;
      color: #373737;
    }

    &-label {
      color: #676767;
      margin: 24px 0 16px 0;
      font-size: 13px;
    }
  }
}
</style>
