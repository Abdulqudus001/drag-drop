<template>
  <v-app :dark="colorScheme.dark" :class="colorScheme.scheme">
    <router-view @generateJSON="generateJSON" name="header" />
    <router-view @changeFlow="changeFlow" name="sidebar" />
    <v-content>
      <router-view :flows="flows" :flow="flow" :showJSON="showJSON" />
    </v-content>
    <!-- <router-view name="footer" /> -->
    <!-- <app-settings
      :drawer="subDrawer"
      @toggleSubDrawer="handleSubdrawer"
    ></app-settings> -->
    <!-- Toggle settings button -->
    <!-- <v-btn fixed class="settings-btn" @click.stop="subDrawer = !subDrawer">
      <v-icon light>settings</v-icon>
    </v-btn> -->
  </v-app>
</template>
<script>
import { mapGetters } from "vuex";
// import AppSettings from "@/components/AppSettings";
export default {
  data() {
    return {
      flows: ["Flow 1"],
      flow: "Flow 1",
      subDrawer: false,
      showJSON: false
    };
  },
  computed: {
    ...mapGetters({
      colorScheme: "colorScheme"
    })
  },
  // components: {
  //   AppSettings
  // },
  methods: {
    changeFlow([flows, flow]) {
      this.flows = flows;
      this.flow = flow;
    },
    handleSubdrawer(value) {
      this.subDrawer = value;
    },
    generateJSON() {
      this.showJSON = !this.showJSON;
    }
  }
};
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
