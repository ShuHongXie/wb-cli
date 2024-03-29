// router.js
import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export function createRouter() {
  return new Router({
    mode: "history",
    routes: [
      { path: "/", component: () => import("./pages/Home.vue") },
      { path: "/item/:id", component: () => import("./pages/Item.vue") },
    ],
  });
}
