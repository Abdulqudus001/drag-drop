import Vue from "vue";
import VueMultiselect from "vue-multiselect";
import "./plugins/vuetify";
import "./plugins/vuse";
import App from "./App.vue";
import router from "./router";
import { store } from "./store";
import { createI18n } from "./i18n/index";

Vue.config.productionTip = false;

import VueDraggableResizable from "vue-draggable-resizable";
import "vue-draggable-resizable/dist/VueDraggableResizable.css";

Vue.component("multi-select", VueMultiselect);
Vue.component("vue-draggable-resizable", VueDraggableResizable);

const i18n = createI18n();

// let count = 0;
// Vue.mixin({
//   created() {
//     console.log(++count);
//   },
//   destroyed() {
//     console.log(--count);
//   }
// });

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount("#app");
