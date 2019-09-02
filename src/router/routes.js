import AppSidebar from "@/layouts/App/NavDrawer";
import AppToolbar from "@/layouts/App/Toolbar";
import AppFooter from "@/layouts/App/Footer";

import BlankPage from "@/views/BlankPage";

export const routes = [
  { path: "/", redirect: "/blank-page" },
  {
    path: "/blank-page",
    name: "BlankPage",
    components: {
      default: BlankPage,
      sidebar: AppSidebar,
      header: AppToolbar,
      footer: AppFooter
    }
  }
];
