<template>
  <q-page class="q-py-md q-px-sm">
    <q-input
      filled
      @keyup="getLocations()"
      v-model="search_location"
      label="Pesquisar localização"
    >
      <q-menu no-parent-event fit no-focus v-model="showAutoComplete">
        <q-list v-if="search_results.length > 0 && !search_pending">
          <q-item
            v-for="result in search_results"
            :key="result"
            class="flex"
            @click="getWeather(result)"
            clickable
            v-close-popup
          >
            <div class="col">
              {{ result.name }} <br />
              <span v-if="result.state">{{ result.state }}, </span>
              {{ result.country }}
            </div>
            <div class="col"></div>
            lat: {{ result.lat.toFixed(3) }} <br />
            lon: {{ result.lon.toFixed(3) }}
            <br />
          </q-item>
        </q-list>
        <div v-else>CARREGANDO PORRAAAAAAAAAAAA</div>
      </q-menu>
    </q-input>

    <div v-if="currentWheater" class="q-mx-auto rpw">
      <div class="q-mb-sm q-mt-md col-12">
        <span v-if="currentWheater.state">{{ currentWheater.state }}, </span>
        {{ currentWheater.sys.country }}
      </div>

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
      search_cooldown: null,
      search_results: [],
      search_pending: false,
      showAutoComplete: false,
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
      if (this.search_location.trim().length > 2) {
        this.showAutoComplete = true;
        let now = Date.now();
        let elapsedTime = now - this.search_cooldown;
        if (this.search_cooldown == null || elapsedTime > 2000) {
          this.search_cooldown = now;
          this.search_results = (
            await this.$openWeatherApi.get(
              `/geo/1.0/direct?q=${this.search_location.trim()}&appid=${
                this.openWeatherKey
              }`
            )
          ).data;
          console.log(this.search_results);
        } else {
          this.search_pending = true;
          setTimeout(async () => {
            if (this.search_location.trim().length > 2) {
              this.search_results = (
                await this.$openWeatherApi.get(
                  `/geo/1.0/direct?q=${this.search_location.trim()}&limit=5&appid=${
                    this.openWeatherKey
                  }`
                )
              ).data;
            } else {
              this.search_results = [];
            }
            console.log(this.search_results);
            this.search_pending = false;
          }, 2000);
        }
      } else {
        this.showAutoComplete = false;
      }
      //   this.currentWheater = (
      //   await this.$openWeatherApi.get(
      //     `/data/2.5/weather?id=524901&appid=${this.openWeatherKey}&units=metric&lang=pt_br`
      //   )
      // ).data;
      // console.log(this.currentWheater);
    },
    async getWeather(location) {
      this.currentWheater = (
        await this.$openWeatherApi.get(
          `/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${this.openWeatherKey}&units=metric&lang=pt_br`
        )
      ).data;
      this.currentWheater.name = location.name;
      this.currentWheater.state = location.state;
      this.search_location = location.name;
      this.search_results = [];
      console.log(this.currentWheater);
    },
  },
});
</script>
