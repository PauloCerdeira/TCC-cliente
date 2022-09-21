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
            lat: {{ result.lat.toFixed(3) }} <br />
            lon: {{ result.lon.toFixed(3) }}
            <br />
          </q-item>
        </q-list>
        <div v-else-if="!search_pending" class="q-pa-md fit flex">
          <h6 class="q-ma-none">Nenhum resultado encontrado.</h6>
        </div>
        <div class="q-pa-md fit flex" v-else>
          <q-spinner class="q-mx-auto" color="primary" size="3em" />
        </div>
      </q-menu>
    </q-input>

    <div v-if="selectedLocation" class="q-mx-auto row">
      <div class="col-6 text-h5 q-py-md q-px-sm">
        {{ Math.ceil(selectedLocation.main.temp) }} °C
        <div class="text-caption">
          Sensação térmica: {{ Math.ceil(selectedLocation.main.feels_like) }} °C
          <br />
          <q-icon color="red" name="arrow_upward" />
          {{ Math.ceil(selectedLocation.main.temp_max) }} °C
          <q-icon color="blue" name="arrow_downward" />
          {{ Math.ceil(selectedLocation.main.temp_min) }} °C
        </div>
      </div>
      <div class="col-6 row text-h5 q-py-md q-px-sm items-center">
        <div class="col-12 row justify-center">
          {{ selectedLocation.name }}
        </div>
        <div class="text-subtitle1 col-12 row justify-center">
          <span class="q-pr-xs" v-if="selectedLocation.state"
            >{{ selectedLocation.state }},
          </span>
          {{ selectedLocation.sys.country }}
        </div>
      </div>
      <div class="col-12">
        <span v-for="weather in selectedLocation.weather" :key="weather.id"
          >{{ weather.description }} <br
        /></span>
      </div>
      <div class="col-12">
        Umidade: {{ selectedLocation.main.humidity }} % <br />
        nuvens: {{ selectedLocation.clouds.all }} % <br />
        vel vento: {{ selectedLocation.wind.speed * 3.6 }} km/h <br />
        deg vento: {{ selectedLocation.wind.deg }} <br />
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "IndexPage",
  data() {
    return {
      search_location: "Carrão",
      search_cooldown: null,
      search_results: [],
      search_pending: false,
      last_search: "",
      showAutoComplete: false,
      openWeatherKey: "27d6d870bd455bfeda31b8f1eb2118e1",
      selectedLocation: null,
    };
  },
  async created() {
    await this.getLocations();
    await this.getWeather(this.search_results[0]);
    this.showAutoComplete = false;
  },
  methods: {
    async getLocations() {
      console.log("rodou", this.search_location);
      if (this.search_location.trim().length > 2) {
        if (this.search_location.trim() == this.last_search.trim()) return;
        this.last_search = this.search_location;
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
              this.last_search = this.search_location;
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
      //   this.selectedLocation = (
      //   await this.$openWeatherApi.get(
      //     `/data/2.5/weather?id=524901&appid=${this.openWeatherKey}&units=metric&lang=pt_br`
      //   )
      // ).data;
      // console.log(this.selectedLocation);
    },
    async getWeather(location) {
      this.selectedLocation = (
        await this.$openWeatherApi.get(
          `/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${this.openWeatherKey}&units=metric&lang=pt_br`
        )
      ).data;
      this.selectedLocation.name = location.name;
      this.selectedLocation.state = location.state;
      this.search_location = location.name;
      this.search_results = [];
      console.log(this.selectedLocation);
    },
  },
});
</script>
