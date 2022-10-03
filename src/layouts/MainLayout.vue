<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title style="font-size: 1.2rem">
          Monitoramento de Consumo
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <EssentialRoutes
          v-for="route in routeList"
          :key="route.title"
          v-bind="route"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import EssentialRoutes from "components/EssentialRoutes.vue";
export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialRoutes,
  },

  setup() {
    const leftDrawerOpen = ref(false);

    return {
      routeList: [
        {
          title: "Consumo em tempo Real",
          caption: "Veja seu consumo de energia em tempo real",
          icon: "school",
          route: "/tempoReal",
        },
        {
          title: "Consumo por periodo",
          caption: "Veja a quantidade consumida em periodos especificos",
          icon: "calendar_month",
          route: "/periodo",
        },
      ],
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>
