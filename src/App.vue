<template>
  <v-app :dark="colorScheme.dark" :class="colorScheme.scheme">
    <router-view name="header" />
    <router-view name="sidebar" />
    <v-content>
      <router-view />
    </v-content>
    <router-view name="footer" />
    <app-settings
      :drawer="subDrawer"
      @toggleSubDrawer="handleSubdrawer"
    ></app-settings>
    <!-- Toggle settings button -->
    <v-btn fixed class="settings-btn" @click.stop="subDrawer = !subDrawer">
      <v-icon light>settings</v-icon>
    </v-btn>
  </v-app>
</template>
<script>
import { mapGetters } from "vuex";
import AppSettings from "@/components/AppSettings";
export default {
  data() {
    return {
      subDrawer: false
    };
  },
  computed: {
    ...mapGetters({
      colorScheme: "colorScheme"
    })
  },
  components: {
    AppSettings
  },
  methods: {
    handleSubdrawer(value) {
      this.subDrawer = value;
    }
  }
};
</script>
