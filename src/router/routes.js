const routes = [
  {
    path: "/",
    redirect: "/tempoReal",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/tempoReal",
        component: () => import("src/pages/ConsumoTempoReal.vue"),
      },
      {
        path: "/periodo",
        component: () => import("src/pages/ConsumoPeriodo.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
