import Vue from "vue";
import VueRouter from "vue-router";
// import Home from "../views/home/index";
import Layout from "../layout/index";
import Settings from "../views/settings/index";
import Blueprints from "../views/blueprints/index";
import Collections from "../views/collections/index";
import BlueprintTemplate from "../views/blueprintTemplate/index";
import BlueprintJsonEditor from "../views/blueprintJsonEditor/index";
import CollectionMonitor from "../views/collectionMonitor/index";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/collections",
    component: Layout,
    children: [
      {
        path: "blueprints",
        component: Blueprints,
      },
      {
        path: "blueprint-template",
        component: BlueprintTemplate,
      },
      {
        path: "blueprint-json-editor",
        component: BlueprintJsonEditor,
      },
      {
        path: "collections",
        component: Collections,
      },
      {
        path: "collection-monitor",
        component: CollectionMonitor,
      },
      {
        path: "settings",
        component: Settings,
      },
    ],
  },
];

const original = VueRouter.prototype.push;

VueRouter.prototype.push = function push(location) {
  return original.call(this, location).catch((err) => err);
};
const router = new VueRouter({
  mode: "history",
  routes,
});

export default router;
