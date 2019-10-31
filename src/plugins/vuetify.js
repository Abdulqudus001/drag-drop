/* eslint-disable */
import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/src/stylus/app.styl";
import colors from "vuetify/es5/util/colors";
import { store } from "@/store";

Vue.use(Vuetify, {
  iconfont: "md",
  theme: {
    // dark: true,
    themes: {
      dark: {
        // primary: String(store.state.swatch.colorScheme.primary),
        // secondary: String(colors.pink.base),
        // accent: String(colors.deepPurple.accent2),
        // error: String(colors.red.accent4),
        // info: String(colors.blue.lighten1),
        // success: String(colors.green.accent4),
        // warning: String(colors.amber.darken2)
      }
    }
  },
  options: {
    themeVariations: ["primary", "secondary"]
  }
});
