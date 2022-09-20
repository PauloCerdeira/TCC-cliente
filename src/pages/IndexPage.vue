<template>
  <q-page class="q-py-md q-px-sm">
    <q-input
      filled
      @update:model-value="getLocations()"
      v-model="search_location"
      label="Pesquisar localização"
    >
    </q-input>

    <div v-for="result in search_results" :key="result" class="q-my-md">
      {{ result }}
      <br />
    </div>

    <div v-if="currentWheater" class="q-mx-auto">
      <p class="q-mb-sm q-mt-md">{{ currentWheater.sys.country }}</p>

      <h4 class="q-mt-none">
        {{ currentWheater.main.temp }} °C - {{ currentWheater.name }}
      </h4>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "IndexPage",
  data() {
    return {
      search_location: "",
      search_results: [],
      openWeatherKey: "27d6d870bd455bfeda31b8f1eb2118e1",
      currentWheater: null,
    };
  },
  async created() {
    this.currentWheater = (
      await this.$openWeatherApi.get(
        `/data/2.5/weather?id=524901&appid=${this.openWeatherKey}&units=metric&lang=pt_br`
      )
    ).data;
    console.log(this.currentWheater);
  },
  methods: {
    async getLocations() {
      console.log("rodou", this.search_location);
      if (this.search_location.length > 2)
        this.search_results = (
          await this.$openWeatherApi.get(
            `/geo/1.0/direct?q=${this.search_location}&appid=${this.openWeatherKey}`
          )
        ).data;
      //   this.currentWheater = (
      //   await this.$openWeatherApi.get(
      //     `/data/2.5/weather?id=524901&appid=${this.openWeatherKey}&units=metric&lang=pt_br`
      //   )
      // ).data;
      // console.log(this.currentWheater);
    },
  },
});
</script>
