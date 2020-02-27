import NavHeader from "./../../components/NavHeader";
import NavFooter from "@/components/NavFooter.vue";
import NoData from "@/components/NoData"


function plugins(Vue) {
  Vue.component("nav-header", NavHeader);
  Vue.component("nav-footer",NavFooter);
  Vue.component("no-data",NoData)
}

export default plugins;